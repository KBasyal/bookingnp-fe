import { Routes, Route } from "react-router-dom";
import HomeLayout from "../pages/layouts";
import LandingPage from "../pages/landing/landing.page";
import RegisterPage from "../pages/auth/register";
import LoginPage from "../pages/auth/login";
import AuthContext from "../context/auth.context";
import { useEffect, useState } from "react";



import axiosInstance from "./axios.config";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css"
import ActivateUser from "../pages/auth/activate";





const RoutingConfig = () => {
    const [loggedInUser, setLoggedInUser] = useState();
    const [loading, setLoading] = useState(true);
    const getLoggedInUser = async () => {
        try {
            const token = localStorage.getItem("accessToken") || null;
            const response: any = await axiosInstance.get(
                "auth/me",
                {
                    headers: {
                        "Authorization": "Bearer " + token,
                    }
                }
            );
            setLoggedInUser(response.result)
        } catch (exception) {
            // handle exception

        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        const token = localStorage.getItem("accessToken") || null
        if (token) {
            getLoggedInUser()
        } else {
            setLoading(false)
        }
    }, [])
    return (
        <>
            <AuthContext.Provider value={{ loggedInUser: loggedInUser }}>
                <ToastContainer
                    theme="colored"
                />
                <Routes>
                    <Route path="/" element={<HomeLayout />}>
                        <Route index element={<LandingPage />}></Route>
                        <Route path="register" element={<RegisterPage />} />
                        <Route path="activate/:token" element={<ActivateUser />} />
                        <Route path="login" element={<LoginPage />} />
                        

                    </Route>

                </Routes>

            </AuthContext.Provider>


        </>
    )
}

export default RoutingConfig;