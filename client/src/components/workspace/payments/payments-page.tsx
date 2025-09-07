// payments-page.tsx
"use client";

import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentsPage = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  useEffect(() => {
    // Load Razorpay script dynamically if not already loaded
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handlePayment = async () => {
    // Step 1: Create Razorpay order from backend
    const res = await fetch(`/api/workspace/${workspaceId}/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 100 }) // ₹100
    });

    const order = await res.json();

    // Step 2: Open Razorpay checkout
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      order_id: order.id,
      name: "ClientX Payments",
      description: `Workspace ${workspaceId} payment`,
      handler: async () => {
        // Step 3: Trigger payout to User Y
        await fetch(`/api/workspace/${workspaceId}/send-payout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fundAccountId: "fa_XXXXXX", // Replace with actual RazorpayX fund account ID
            amount: 100
          })
        });
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Workspace Payments</h1>
      <p className="text-muted-foreground">
        Send ₹100 from User X to User Y inside workspace <strong>{workspaceId}</strong>.
      </p>
      <Button onClick={handlePayment}>Pay ₹100</Button>
    </div>
  );
};

export default PaymentsPage;