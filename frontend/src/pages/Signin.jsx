import { useState } from "react"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import { use } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export const Signin = () =>{

    const [email,setEmail] = useState("");
    const[password,setPassword] = useState("");
    const navigate = useNavigate();

    const handelSignIn = async ()=>{
        try{
            const response = await axios.post("http://localhost:3000/api/v1/user/signin",{
                username : email,
                password:password
            });
            console.log("Server Response:", response);
            const token = response.data.token;

            if (!token) {
                throw new Error("No token received");
            }

            localStorage.setItem("token",token);
            navigate("/dashboard")
        }catch(error){
            console.error("Login failed",error);
            alert("Invalid email or password");
        }
    }

    return <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                <Heading label={"Sign in"}/>
                <SubHeading label={"Enter your credentials to access your account "}/>
                <div className="space-y-4">
                        <InputBox placeholder="hari@gmail.com" label="Email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)} />
                        <InputBox placeholder="123456" label="Password"
                        type = "password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)} />
                        <Button label="Sign in" onClick={handelSignIn} />
                    </div>
            </div>
            <BottomWarning label={"Dont have an account?"} buttonText={"Sign up"} to={"/signup"}/>
        </div>

    </div>
}