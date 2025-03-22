import { useEffect, useState } from "react";
import axios from "axios";

export default function Payments() {
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/freelancer/payments")
      .then((res) => setPaymentData(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!paymentData) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h3 className="font-semibold text-lg">Escrow Balance</h3>
      <p className="text-xl font-semibold">${paymentData.balance}</p>
      <button className="px-4 py-2 bg-green-600 text-white rounded-lg mt-2">
        Withdraw Funds
      </button>
    </div>
  );
}
