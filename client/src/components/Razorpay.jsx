import React from "react";

function Razorpay() {
  const handleSubmit = async () => {
    try {
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }

      const razorpayOptions = {
        key: "YOUR_RAZORPAY_KEY",
        amount: 5000, // 5000 paise or 50 INR
        currency: "INR",
        image: "https://example.com/your-logo.png",
        order_id: "ORDER_ID",
        name: "Your Company",
        description: "Your Company",
        handler: (response) => {
          alert(response.razorpay_payment_id);
          setpaymentId(response.razorpay_payment_id);
        },
        prefill: {
          name: "Ishaan Jain",
          email: "ishaanj2612@gmail.com",
          contact: "8920800490", // Make this value dynamic or configurable
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(razorpayOptions);
      paymentObject.open();
    } catch (error) {
      console.error(error);
    }
  };
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        reject(false);
      };
      document.body.appendChild(script);
    });
  };
  return (
    <div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
}

export default Razorpay;
