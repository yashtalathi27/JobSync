import { useState } from "react";
import axios from "axios";

export default function Support() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submitDispute = () => {
    if (!message.trim()) return;
    setLoading(true);
    axios.post("http://localhost:5000/freelancer/dispute", { message })
      .then(() => {
        setMessage("");
        alert("Dispute submitted successfully!");
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h3 className="font-semibold text-lg">Raise a Dispute</h3>
      <textarea
        className="w-full p-2 border rounded-lg mt-2"
        placeholder="Describe your issue..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        className="px-4 py-2 bg-red-600 text-white rounded-lg mt-2"
        onClick={submitDispute}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Dispute"}
      </button>
    </div>
  );
}
