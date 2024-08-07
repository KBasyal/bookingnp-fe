import { useForm, Controller } from "react-hook-form";
import { TextInputField } from "../../components/common/form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axiosInstance from "../../config/axios.config";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { LoadingComponent } from "../../components/common";

const AdminAboutEdit = () => {
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const [detail, setDetail] = useState<any>({});

    const editDTO = Yup.object({
        title: Yup.string().min(3).required(),
        content: Yup.string().min(10).required(),
        image: Yup.mixed().optional(), // Handle as a file or path
        // No team field needed here
    });

    const { control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(editDTO),
    });

    const navigate = useNavigate();

    const submitEvent = async (data: any) => {
        try {
            setLoading(true);
            
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('content', data.content);
            
            // Handle image file
            if (data.image) {
                formData.append('image', data.image);
            }
    
            // No need to include team data
            // formData.append('team', JSON.stringify(data.team)); // Removed

            // Make API request
            await axiosInstance.put('/about/' + params.id, formData, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('accessToken'),
                    "Content-Type": "multipart/form-data"
                }
            });
            toast.success("About section updated successfully.");
            navigate("/admin/about");
        } catch (exception) {
            console.log(exception);
            toast.error("Error while updating About section.");
        } finally {
            setLoading(false);
        }
    };
    
    const handleFileChange = (e: any) => {
        const uploaded = e.target.files[0];
        if (uploaded) {
            setValue('image', uploaded); // Handle file as needed
        }
    };

    const getAboutById = async () => {
        try {
            const response: any = await axiosInstance.get("/about/" + params.id, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('accessToken')
                }
            });
            setValue("title", response.result.title);
            setValue("content", response.result.content);
            setDetail(response.result);
        } catch (exception) {
            toast.error("Error fetching About section.");
            navigate("/admin/about");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAboutById();
    }, [params]);

    return (
        <>
            <section>
                <div className="mx-auto max-w-screen-xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-16">
                        <div className="col-span-full lg:col-span-1">
                            <h1 className="text-4xl font-bold text-center lg:text-left">
                                Edit About Section
                            </h1>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 mt-8">
                        <div className="overflow-x-auto rounded-t-lg">
                            {
                                loading ? (
                                    <LoadingComponent />
                                ) : (
                                    <form onSubmit={handleSubmit(submitEvent)} className="grid grid-cols-6 gap-6 p-4">
                                        <div className="col-span-6">
                                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                                Title
                                            </label>
                                            <TextInputField
                                                control={control}
                                                name="title"
                                                errMsg={errors?.title?.message as string}
                                                required={true}
                                            />
                                        </div>

                                        <div className="col-span-6">
                                            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                                                Content
                                            </label>
                                            <Controller
                                                control={control}
                                                name="content"
                                                render={({ field }) => (
                                                    <textarea
                                                        {...field}
                                                        className="input border border-gray-300 p-2 rounded w-full"
                                                    />
                                                )}
                                            />
                                            <span className="text-red-500">{errors?.content?.message}</span>
                                        </div>

                                        <div className="col-span-6">
                                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                                Image
                                            </label>
                                            <input
                                                className="w-full"
                                                id="file_input"
                                                type="file"
                                                onChange={handleFileChange}
                                            />
                                            {detail?.image && (
                                                <div className="mt-4">
                                                    <img src={import.meta.env.VITE_IMAGE_URL + "/uploads/about/" + detail?.image} alt="Current Image" className="w-48 h-auto" />
                                                </div>
                                            )}
                                            <span className="text-red-500">{errors?.image?.message}</span>
                                        </div>

                                        <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                                            <button
                                                className="inline-block shrink-0 rounded-md border border-green-700 bg-green-700 px-6 py-2 text-sm font-medium text-white transition hover:bg-transparent hover:text-green-500 focus:outline-none focus:ring active:text-green-600"
                                                disabled={loading}
                                            >
                                                Save Changes
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

export default AdminAboutEdit;
