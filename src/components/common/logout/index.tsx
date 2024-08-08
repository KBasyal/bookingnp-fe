import axiosInstance from "../../../config/axios.config";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../context/auth.context";

const useLogout = () => {
    const { setLoggedInUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await axiosInstance.post("/auth/logout"); // Call your backend logout endpoint
            setLoggedInUser(null); // Clear user context
            localStorage.removeItem("authToken"); // Remove token from local storage
            navigate("/login"); // Redirect to login page
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return logout;
};

export default useLogout;
