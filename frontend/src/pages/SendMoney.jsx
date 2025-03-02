import axios from "axios";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export const SendMoney = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Get values from URL parameters
    const id = searchParams.get("id") || ""; 
    const name = searchParams.get("name") || "Unknown"; 

    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // ✅ Define handleTransfer function
    const handleTransfer = async () => {
        if (!id || !amount || isNaN(amount) || amount <= 0) {
            setError("Invalid amount or missing user ID");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await axios.post(
                "http://localhost:3000/api/v1/account/transfer",
                { to: id, amount: Number(amount) },
                { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
            );

            setSuccess(true);
            console.log("Transfer successful:", response.data);

            // Redirect to dashboard after success
            setTimeout(() => navigate("/dashboard"), 2000);

        } catch (error) {
            console.error("Transfer failed:", error);
            setError(error.response?.data?.message || "Transfer failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center h-screen bg-gray-100">
            <div className="h-full flex flex-col justify-center">
                <div className="h-min max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h2 className="text-3xl font-bold text-center">Send Money</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                                <span className="text-2xl text-white">
                                    {name[0]?.toUpperCase() || "?"} 
                                </span>
                            </div>
                            <h3 className="text-2xl font-semibold">{name}</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="amount">
                                    Amount (in Rs)
                                </label>
                                <input
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    type="number"
                                    className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                                    id="amount"
                                    placeholder="Enter amount"
                                />
                            </div>
                            {/* ✅ Call handleTransfer correctly */}
                            <button
                                onClick={handleTransfer}  
                                disabled={loading}
                                className={`justify-center rounded-md text-sm font-medium h-10 px-4 py-2 w-full text-white transition ${
                                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500"
                                }`}
                            >
                                {loading ? "Processing..." : "Initiate Transfer"}
                            </button>

                            {/* Error & Success Messages */}
                            {error && <div className="text-red-500 text-sm">{error}</div>}
                            {success && <div className="text-green-500 text-sm">Transfer successful!</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
