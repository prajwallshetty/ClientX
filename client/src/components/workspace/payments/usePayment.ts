import { useParams } from "react-router-dom";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const usePayment = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const createOrder = async (amount: number) => {
    const res = await fetch(`/api/workspace/${workspaceId}/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount })
    });
    return await res.json();
  };

  const triggerCheckout = async (amount: number) => {
    const order = await createOrder(amount);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      order_id: order.id,
      handler: async () => {
        await fetch(`/api/workspace/${workspaceId}/send-payout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fundAccountId: "fa_XXXXXX", // Replace with actual User Y account
            amount: amount
          })
        });
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return { triggerCheckout };
};