import { ImageComponent } from "../../../components/common/image";
import reactLogo from "../../../assets/react.svg";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { TextInputField } from "../../../components/common/form";
import * as Yup from "yup";
import { useContext, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import axiosInstance from "../../../config/axios.config";
import AuthContext from "../../../context/auth.context";

const LoginPage = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const loginDto = Yup.object({
        email: Yup.string().email().required("Email is compulsory"),
        password: Yup.string().required()
    });

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(loginDto),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const submitForm = async (data: any) => {
        try {
            const response: any = await axiosInstance.post("/auth/login", data);
            localStorage.setItem("accessToken", response.result.token.accessToken);
            localStorage.setItem("refreshToken", response.result.token.refreshToken);
            auth.loggedInUser = response.result.detail;
            toast.success("Welcome to " + response.result.detail.role + " Panel");
            navigate("/" + response.result.detail.role);
        } catch (exception: any) {
            console.log(exception);
            toast.error(exception.message);
        }
    };

    useEffect(() => {
        if (auth.loggedInUser) {
            toast.info("You are already logged in");
            navigate("/" + auth.loggedInUser.role);
        }
    }, [auth, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-xl w-full p-8 rounded-lg shadow-lg bg-white">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <ImageComponent
                        classes="mx-auto h-10 w-auto"
                        url={reactLogo}
                        alt="logo"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-4" onSubmit={handleSubmit(submitForm)}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                        
                            </label>
                            <div className="mt-1">
                                <TextInputField
                                    control={control}
                                    type="email"
                                    name="email"
                                    errMsg={errors?.email?.message}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                              
                            </label>
                            <div className="mt-1">
                                <TextInputField
                                    control={control}
                                    type="password"
                                    name="password"
                                    errMsg={errors?.password?.message}
                                />
                            </div>
                            <div className="text-sm">
                                    <a href="/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                        Forgot password?
                                    </a>
                                </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                    <p className="mt-8 text-center text-sm text-gray-500">
                        Not a member?{' '}
                        <NavLink to="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            Register Your Account
                        </NavLink>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
