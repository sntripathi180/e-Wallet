import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export const Appbar= () =>{
const [user,setUser] = useState({firstName: "User"});
const navigate = useNavigate()
useEffect(()=>{
    axios.get("http://localhost:3000/api/v1/user/me",{
        headers:{ Authorization:"Bearer " + localStorage.getItem("token")},
    })
    .then(response =>{
        setUser(response.data || {firstName : "User"});
    })
    .catch(error =>{
        console.error("Error fetching user details: ", error);
    });
},[]);
const handelLogout =()=>{
    localStorage.removeItem("token")
    navigate("/signin")
}

    return <div className="shadow h-14 flex justify-between">
        <div className="flex flex-col justify-center h-full ml-4">
            PayTM Wallet

        </div>
        <div className="flex">
            <div className="flex flex-col justify-center h-full mr-4">
                Hello,{user.firstName}
            </div>
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl"
                onClick={handelLogout}
                title ="Click to logout">
                   {user.firstName[0]?.toUpperCase() || "U "}
                </div>
            </div>

        </div>
    </div>
}