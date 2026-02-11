import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { config } from "../config/app.config";
import { registerSchema } from "../validation/auth.validation";
import { HTTPSTATUS } from "../config/http.config";
import { registerUserService } from "../services/auth.service";
import passport from "passport";
import UserModel from "../models/user.model";
import AccountModel from "../models/account.model";
import { ProviderEnum } from "../enums/account-provider.enum";
import { PasswordResetTokenModel } from "../models/password-reset-token.model";
import crypto from "crypto";
import { sha256Hex } from "../utils/hash.util";
import { sendMail } from "../utils/mailer";

export const googleLoginCallback = asyncHandler(
  async (req: Request, res: Response) => {
    const currentWorkspace = req.user?.currentWorkspace;

    if (!currentWorkspace) {
      return res.redirect(
        `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
      );
    }

    return res.redirect(
      `${config.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`
    );
  }
);

export const forgotPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body as { email?: string };
    if (!email) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: "Email is required" });
    }

    const account = await AccountModel.findOne({
      provider: ProviderEnum.EMAIL,
      providerId: email.toLowerCase(),
    });

    // Always respond success to prevent user enumeration
    if (!account) {
      return res.status(HTTPSTATUS.OK).json({ message: "If the email exists, a reset link has been sent" });
    }

    const user = await UserModel.findById(account.userId);
    if (!user) {
      return res.status(HTTPSTATUS.OK).json({ message: "If the email exists, a reset link has been sent" });
    }

    // Create token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = sha256Hex(Buffer.from(rawToken));
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

    // Invalidate previous tokens
    await PasswordResetTokenModel.updateMany({ userId: user._id, used: false }, { $set: { used: true } });

    await PasswordResetTokenModel.create({
      userId: user._id,
      tokenHash,
      expiresAt,
      used: false,
    });

    const resetUrl = `${config.FRONTEND_ORIGIN}/reset-password?token=${rawToken}`;

    // Try to send email if SMTP is configured; ignore errors to avoid user enumeration.
    try {
      await sendMail({
        to: user.email,
        subject: "Reset your ClientX password",
        html: `
          <div style="font-family:Inter,Segoe UI,Arial,sans-serif;line-height:1.6;color:#0f172a">
            <h2>Reset your password</h2>
            <p>We received a request to reset your password. Click the button below to continue. This link expires in 15 minutes.</p>
            <p style="margin:24px 0">
              <a href="${resetUrl}" style="background:#4f46e5;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;display:inline-block">Reset password</a>
            </p>
            <p>If the button doesn't work, copy and paste this URL into your browser:</p>
            <p style="word-break:break-all;color:#334155">${resetUrl}</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
        text: `Reset your password: ${resetUrl}`,
      });
    } catch {}

    // In non-production, return the token and URL to help testing.
    const payload: Record<string, string> = { message: "If the email exists, a reset link has been sent" };
    if (config.NODE_ENV !== "production") {
      payload["resetToken"] = rawToken;
      payload["resetUrl"] = resetUrl;
    }

    return res.status(HTTPSTATUS.OK).json(payload);
  }
);

export const resetPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const { token, password } = req.body as { token?: string; password?: string };
    if (!token || !password) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: "Token and password are required" });
    }

    const tokenHash = sha256Hex(Buffer.from(token));
    const record = await PasswordResetTokenModel.findOne({ tokenHash, used: false });
    if (!record || record.expiresAt.getTime() < Date.now()) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: "Invalid or expired token" });
    }

    const user = await UserModel.findById(record.userId);
    if (!user) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: "Invalid token" });
    }

    user.password = password;
    await user.save();
    record.used = true;
    await record.save();

    return res.status(HTTPSTATUS.OK).json({ message: "Password reset successfully" });
  }
);

export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse({
      ...req.body,
    });

    await registerUserService(body);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "User created successfully",
    });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      (
        err: Error | null,
        user: Express.User | false,
        info: { message: string } | undefined
      ) => {
        if (err) {
          return next(err);
        }

        if (!user) {
          return res.status(HTTPSTATUS.UNAUTHORIZED).json({
            message: info?.message || "Invalid email or password",
          });
        }

        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }

          return res.status(HTTPSTATUS.OK).json({
            message: "Logged in successfully",
            user,
          });
        });
      }
    )(req, res, next);
  }
);

export const logOutController = asyncHandler(
  async (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res
          .status(HTTPSTATUS.INTERNAL_SERVER_ERROR)
          .json({ error: "Failed to log out" });
      }
    });

    req.session = null;
    return res
      .status(HTTPSTATUS.OK)
      .json({ message: "Logged out successfully" });
  }
);
