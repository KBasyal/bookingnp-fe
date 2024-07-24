import { Routes, Route} from "react-router-dom";
import HomeLayout from "../pages/layouts";
import LandingPage from "../pages/landing/landing.page";
import RegisterPage from "../pages/auth/register";
import LoginPage from "../pages/auth/login";


const RoutingConfig = () =>{
    return(
        <>
        <Routes>
            <Route path="/" element={<HomeLayout />}>
            <Route index element={<LandingPage />}></Route>
            <Route path ="register" element={<RegisterPage/>}/>
            <Route path="login" element={<LoginPage/>}/>

            </Route>

        </Routes>

        </>
    )
}

export default RoutingConfig;