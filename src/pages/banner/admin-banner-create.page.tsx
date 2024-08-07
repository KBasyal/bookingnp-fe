import { useForm } from "react-hook-form";
import { TextInputField, SelectOptionComponent } from "../../components/common/form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axiosInstance from "../../config/axios.config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AdminBannerCreate = () => {
    let [loading, setLoading] = useState(false);
    
    const createDTO = Yup.object({
        title: Yup.string().min(3).required(),
        link: Yup.string().url().nullable(),
        status: Yup.object({
            label: Yup.string().matches(/^(Publish|Unpublish)$/),
            value: Yup.string().matches(/^(active|inactive)$/)
        }).required(),
        image: Yup.mixed().required()
    });

    const { control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(createDTO)
    });

    const navigate = useNavigate();

    const submitEvent = async (data: any) => {
        try {
            setLoading(true);
            const mappedData = {
                ...data,
                status: data.status.value
            };
            const response = await axiosInstance.post('/banner', mappedData, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('accessToken'),
                    "Content-Type": "multipart/form-data"
                }
            });
            toast.success("Banner created successfully.");
            navigate("/admin/about");
        } catch (exception) {
            console.log(exception);
            toast.error("Error while creating banner");
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
                                Banner Create
                            </h1>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 mt-8">
                        <div className="overflow-x-auto rounded-t-lg">
                            <form onSubmit={handleSubmit(submitEvent)} className="grid grid-cols-6 gap-6">
                                <div className="col-span-6 ">
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                        
                                    </label>
                                    <TextInputField
                                        control={control}
                                        name="title"
                                        errMsg={errors?.title?.message as string}
                                        required={true}
                                    />
                                </div>

                                <div className="col-span-6">
                                    <label htmlFor="link" className="block text-sm font-medium text-gray-700">  </label>
                                    <TextInputField
                                        control={control}
                                        name="link"
                                        type="url"
                                        errMsg={errors?.link?.message as string}
                                        required={true}
                                    />
                                </div>

                                <div className="col-span-6 ">
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                        
                                    </label>
                                    <SelectOptionComponent
                                        options={[{ label: "Publish", value: "active" }, { label: "Unpublish", value: "inactive" }]}
                                        name="status"
                                        control={control}
                                        errMsg={errors?.status?.message as string}
                                    />
                                </div>
                                
                                <div className="col-span-6 ">
                                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                        Image
                                    </label>
                                    <input
                                        id="file_input"
                                        type="file"
                                        onChange={handleFileChange}
                                    />
                                    <span className="text-red-500">{errors?.image?.message}</span>
                                </div>

                                <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                                    <button
                                        className="inline-block shrink-0 rounded-md border border-green-700 bg-green-700 px-6 py-2 text-sm font-medium text-white transition hover:bg-transparent hover:text-green-500 focus:outline-none focus:ring active:text-green-600"
                                        disabled={loading}
                                    >
                                        Create Banner
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AdminBannerCreate;
