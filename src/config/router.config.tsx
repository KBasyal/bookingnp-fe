import { Routes, Route} from "react-router-dom";
import HomeLayout from "../pages/layouts";
import LandingPage from "../pages/landing/landing.page";


const RoutingConfig = () =>{
    return(
        <>
        <Routes>
            <Route path="/" element={<HomeLayout />}>
            <Route index element={<LandingPage />}></Route>

            </Route>

        </Routes>

        </>
    )
}

export default RoutingConfig;