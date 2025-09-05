import { useState } from "react";

// if TS complains about Razorpay on window:
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentPage() {
  const [form, setForm] = useState({ name: "", email: "", amount: "" });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  // dynamically load Razorpay script
  const loadScript = (src: string) =>
    new Promise<boolean>((resolve) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  const pay = async () => {
    // 1) get order
    const createOrder = await fetch(
      "http://localhost:8000/api/payment/create-order",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // if backend uses cookie-session
        body: JSON.stringify({
          amount: Number(form.amount), // rupees
          name: form.name,
          email: form.email,
        }),
      }
    );
    const order = await createOrder.json();
    if (!order?.orderId) {
      alert("Failed to create order");
      return;
    }

    // 2) load checkout
    const ok = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!ok) return alert("Failed to load Razorpay");

    // 3) open Razorpay
    const options = {
      key: order.key,
      amount: order.amount, // in paise
      currency: order.currency,
      name: "Workspace Payments",
      description: `Payment to ${form.name}`,
      order_id: order.orderId,
      prefill: { name: form.name, email: form.email },
      handler: async (response: any) => {
        // 4) verify + download invoice
        const verifyRes = await fetch(
          "http://localhost:8000/api/payment/verify-and-invoice",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              ...response,
              amount: order.amount, // pass paise for invoice total
              name: form.name,
              email: form.email,
            }),
          }
        );

        const contentType = verifyRes.headers.get("content-type") || "";
        if (contentType.includes("application/pdf")) {
          const blob = await verifyRes.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `invoice_${response.razorpay_payment_id}.pdf`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        } else {
          const err = await verifyRes.json().catch(() => ({}));
          alert(err?.message || "Payment verification failed");
        }
      },
      theme: { color: "#0ea5e9" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-3">
      <h1 className="text-xl font-semibold">Send Payment</h1>
      <input
        name="name"
        placeholder="Recipient Name"
        className="border rounded w-full p-2"
        value={form.name}
        onChange={onChange}
      />
      <input
        name="email"
        placeholder="Recipient Email"
        className="border rounded w-full p-2"
        value={form.email}
        onChange={onChange}
      />
      <input
        name="amount"
        placeholder="Amount (₹)"
        className="border rounded w-full p-2"
        value={form.amount}
        onChange={onChange}
        type="number"
        min="1"
      />
      <button onClick={pay} className="bg-emerald-600 text-white px-4 py-2 rounded">
        Pay with Razorpay
      </button>
    </div>
  );
}
