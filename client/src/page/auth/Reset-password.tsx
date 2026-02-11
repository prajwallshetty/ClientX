import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetPasswordMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import Logo from "@/components/logo";

const schema = z
  .object({
    password: z.string().trim().min(6, { message: "Min 6 characters" }),
    confirmPassword: z.string().trim().min(6, { message: "Min 6 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const ResetPassword = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token") || "";

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: { token: string; password: string }) =>
      resetPasswordMutationFn(payload),
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    if (!token) {
      toast({ title: "Invalid link", description: "Missing reset token", variant: "destructive" });
      return;
    }
    if (isPending) return;
    mutate(
      { token, password: values.password },
      {
        onSuccess: () => {
          toast({ title: "Password reset", description: "Please sign in with your new password" });
          navigate("/sign-in");
        },
        onError: (err: any) => {
          toast({ title: "Error", description: err.message, variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link to="/" className="flex items-center gap-2 self-center font-medium">
          <Logo />
          ClientX .
        </Link>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Reset password</CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-[#f1f7feb5] text-sm">Password</FormLabel>
                        <FormControl>
                          <Input type="password" className="!h-[48px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-[#f1f7feb5] text-sm">Confirm password</FormLabel>
                        <FormControl>
                          <Input type="password" className="!h-[48px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button disabled={isPending} type="submit" className="w-full">
                    Reset password
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
