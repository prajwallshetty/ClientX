import { Request, Response } from 'express';
import axios from 'axios';

export const sendPayout = async (req: Request, res: Response) => {
  const { workspaceId } = req.params;
  const { fundAccountId, amount } = req.body;

  try {
    const payout = await axios.post('https://api.razorpay.com/v1/payouts', {
      account_number: process.env.RAZORPAYX_ACCOUNT_NUMBER!,
      fund_account_id: fundAccountId,
      amount: amount * 100,
      currency: 'INR',
      mode: 'UPI',
      purpose: 'payout',
      narration: `Workspace ${workspaceId} payout`,
      reference_id: `ws_${workspaceId}_${Date.now()}`
    }, {
      auth: {
        username: process.env.RAZORPAY_KEY_ID!,
        password: process.env.RAZORPAY_KEY_SECRET!
      }
    });

    res.json(payout.data);
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
};