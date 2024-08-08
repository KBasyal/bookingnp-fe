import AuthContext from "../../context/auth.context";
import { useForm } from "react-hook-form";
import { TextInputField } from "../../components/common/form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axiosInstance from "../../config/axios.config";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { LoadingComponent } from "../../components/common";

const CustomerManageAccount = () => {
    const [loading, setLoading] = useState(false);
    const auth = useContext(AuthContext);
    const { loggedInUser } = auth; // Destructure loggedInUser from context

    const params = useParams();

    const editDTO = Yup.object({
        name: Yup.string().min(3).required(),
        email: Yup.string().email().required(),
        password: Yup.string().min(6).required(), // Assuming a minimum length for password
        image: Yup.mixed().optional(),
        role: Yup.string().oneOf(['staff', 'customer', 'admin']).required() // Role validation
    });

    const { control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(editDTO),
        defaultValues: {
            name: loggedInUser?.name || '',
            email: loggedInUser?.email || '',
            password: '', // Password should be empty on load
            role: loggedInUser?.role || '', // Role field
            image: loggedInUser?.image
        }
    });

    const navigate = useNavigate();

    const submitEvent = async (data: any) => {
        try {
            setLoading(true);
            const mappedData = {
                ...data,
                status: data.status.value
            };
            await axiosInstance.put('/user/' + params.id, mappedData, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('accessToken'),
                    "Content-Type": "multipart/form-data"
                }
            });
            toast.success("User updated successfully.");
            navigate("/admin/banner");
        } catch (exception) {
            console.log(exception);
            toast.error("Error while updating user");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: any) => {
        const uploaded = e.target.files[0];
        setValue('image', uploaded);
    };

    return (
        <>
            <section>
                <div className="mx-auto max-w-screen-xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-16">
                        <div className="col-span-full lg:col-span-1">
                            <h1 className="text-4xl font-bold text-center lg:text-left">
                                User Details
                            </h1>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 mt-8">
                        <div className="overflow-x-auto rounded-t-lg">
                            {
                                loading ? (
                                    <LoadingComponent />
                                ) : (
                                    <form onSubmit={handleSubmit(submitEvent)} className="grid grid-cols-6 gap-6">
                                        <div className="col-span-6">
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            </label>
                                            <TextInputField
                                                control={control}
                                                name="name"
                                                errMsg={errors?.name?.message as string}
                                                required={true} type={""} />
                                        </div>

                                        <div className="col-span-6">
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            </label>
                                            <TextInputField
                                                control={control}
                                                name="email"
                                                type="email"
                                                errMsg={errors?.email?.message as string}
                                                required={true}
                                            />
                                        </div>

                                        {/* <div className="col-span-6">
                                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                                Password
                                            </label>
                                            <TextInputField
                                                control={control}
                                                name="password"
                                                type="password"
                                                errMsg={errors?.password?.message as string}
                                                required={true}
                                            />
                                        </div> */}

                                        <div className="col-span-6">
                                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                                Role
                                            </label>
                                            <input
                                                type="text"
                                                value={loggedInUser?.role || ''}
                                                readOnly
                                                className="bg-gray-100 text-gray-500 border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 block w-full sm:text-sm"
                                            />
                                        </div>

                                        <div className="col-span-6">
                                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                                Image
                                            </label>
                                            <input
                                                className="w-[75%]"
                                                id="file_input"
                                                type="file"
                                                onChange={handleFileChange}
                                            />
                                            {loggedInUser?.image && (
                                                <div className="block w-[25%]">
                                                    <img src={`${import.meta.env.VITE_IMAGE_URL}/uploads/users/${loggedInUser.image}`} alt="User" crossOrigin="anonymous" />
                                                </div>
                                            )}
                                            <span className="text-red-500">{errors?.image?.message}</span>
                                        </div>

                                        <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                                            <button
                                                className="inline-block shrink-0 rounded-md border border-green-700 bg-green-700 px-6 py-2 text-sm font-medium text-white transition hover:bg-transparent hover:text-green-500 focus:outline-none focus:ring active:text-green-600"
                                                disabled={loading}
                                            >
                                                Update User
                                            </button>
                                        </div>
                                    </form>
                                )
                            }
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default CustomerManageAccount;
