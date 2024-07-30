import { useForm } from "react-hook-form";
import { TextInputField} from "../../components/common/form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axiosInstance from "../../config/axios.config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AdminFacilityCreate = () => {
    let [loading, setLoading] = useState(false);

    const createDTO = Yup.object({
        name: Yup.string().min(3).required(),
        description: Yup.string().min(10).required(),
        adonprice: Yup.number().min(0).optional()
    });

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(createDTO),
    });

  

    const navigate = useNavigate();

    const submitEvent = async (data: any) => {
        try {
            setLoading(true);
            const mappedData = {
                ...data,
            };
            const response = await axiosInstance.post('/facility', mappedData, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('accessToken'),
                    "Content-Type": "multipart/form-data"
                }
            });
            toast.success("Facility created successfully.");
            navigate("/admin/facility");
        } catch (exception) {
            console.log(exception);
            toast.error("Error while creating facility");
        } finally {
            setLoading(false);
        }
    };

    // const handleFileChange = (e: any) => {
    //     const uploaded = e.target.files[0];
    //     setValue('image', uploaded);
    // };

    return (
        <>
            <section>
                <div className="mx-auto max-w-screen-xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-16">
                        <div className="col-span-full lg:col-span-1">
                            <h1 className="text-4xl font-bold text-center lg:text-left">
                                Facility Create
                            </h1>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 mt-8">
                        <div className="overflow-x-auto rounded-t-lg">
                            <form onSubmit={handleSubmit(submitEvent)} className="grid grid-cols-6 gap-6">
                                <div className="col-span-6">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">

                                    </label>
                                    <TextInputField
                                        control={control}
                                        name="name"
                                        errMsg={errors?.name?.message}
                                        required
                                    />
                                </div>

                                <div className="col-span-6">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">  </label>
                                    <TextInputField
                                        control={control}
                                        name="description"
                                        type="string"
                                        errMsg={errors?.description?.message as string}
                                        required={true}
                                    />
                                </div>

                                <div className="col-span-6">
                                    <label htmlFor="adonprice" className="block text-sm font-medium text-gray-700">  </label>
                                    <TextInputField
                                        control={control}
                                        name="adonprice"
                                        type="number"
                                        errMsg={errors?.description?.message as string}
                                        required={true}
                                    />
                                </div>
                                <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                                    <button
                                        className="inline-block shrink-0 rounded-md border border-green-700 bg-green-700 px-6 py-2 text-sm font-medium text-white transition hover:bg-transparent hover:text-green-500 focus:outline-none focus:ring active:text-green-600"
                                        disabled={loading}
                                    >
                                        Create Facility
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

export default AdminFacilityCreate;
