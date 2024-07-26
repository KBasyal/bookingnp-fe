import { Routes, Route } from "react-router-dom";
import HomeLayout from "../pages/layouts";
import LandingPage from "../pages/landing/landing.page";
import RegisterPage from "../pages/auth/register";
import LoginPage from "../pages/auth/login";
import AuthContext from "../context/auth.context";
import { Suspense, useEffect, useState } from "react";



import axiosInstance from "./axios.config";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css"
import ActivateUser from "../pages/auth/activate";
import PermissionConfig from "./permission.config";
import AdminLayout from "../pages/layouts/admin";
import { LoadingComponent } from "../components/common";
import AdminDashboard from "../pages/dashboard/admin-dashboard.page";
import AdminBanner from "../pages/banner/admin-banner-list";
import AdminBannerCreate from "../pages/banner/admin-banner-create.page";
import AdminBannerEdit from "../pages/banner/admin-banner-edit.page";





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
                        <Route path="*" element={<>Error Page</>} />
                    </Route>
                    <Route path="/admin" element={<PermissionConfig allowAccess="admin">
                        <AdminLayout />
                    </PermissionConfig>}>
                        <Route index element={
                            <Suspense fallback={<LoadingComponent />}>
                                <AdminDashboard />
                            </Suspense>
                        }></Route>
                        <Route path="banner" element={<Suspense fallback={<LoadingComponent />}>
                            <AdminBanner />
                        </Suspense>}></Route>
                        <Route path="banner/create" element={<Suspense fallback={<LoadingComponent />}>
                            <AdminBannerCreate/>
                        </Suspense>} />
                        <Route path="banner/:id" element={<Suspense fallback={<LoadingComponent />}>
                            <AdminBannerEdit/>
                        </Suspense>} />
                    </Route>


                </Routes>

            </AuthContext.Provider>


        </>
    )
}

export default RoutingConfig;