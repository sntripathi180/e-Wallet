import { useEffect, useState } from "react";
import axios from "axios";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";

export const Dashboard = () => {
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        axios.get("http://localhost:3000/api/v1/account/balance", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(response => {
            setBalance(response.data.balance);
        })
        .catch(error => {
            console.error("Error fetching balance:", error);
        });
    }, []);

    return (
        <div>
            <Appbar />
            <div className="m-8">
                <Balance value={balance} />
                <Users />
            </div>
        </div>
    );
};
