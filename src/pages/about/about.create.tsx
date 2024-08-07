// import { useForm } from "react-hook-form";
// import { TextInputField, SelectOptionComponent } from "../../components/common/form";
// import * as Yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import axiosInstance from "../../config/axios.config";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";

// const AdminAboutCreate = () => {
//     let [loading, setLoading] = useState(false);

//     const teamMemberSchema = Yup.object().shape({
//         name: Yup.string().required('Name is required'),
//         position: Yup.string().required('Position is required'),
//     });
    
//     const createDTO = Yup.object().shape({
//         title: Yup.string().min(2, 'Title must be at least 2 characters').required('Title is required'),
//         content: Yup.string().required('Content is required'),
//         image: Yup.string(),
//         team: Yup.array().of(teamMemberSchema).required('Team is required'),
//     });
    
 

//     const { control, handleSubmit, setValue, formState: { errors } } = useForm({
//         resolver: yupResolver(createDTO)
//     });

//     const navigate = useNavigate();

//     const submitEvent = async (data: any) => {
//         try {
//             setLoading(true);
//             const mappedData = {
//                 ...data,
//                 status: data.status.value
//             };
//             const response = await axiosInstance.post('/about', mappedData, {
//                 headers: {
//                     Authorization: "Bearer " + localStorage.getItem('accessToken'),
//                     "Content-Type": "multipart/form-data"
//                 }
//             });
//             toast.success("Banner created successfully.");
//             navigate("/admin/banner");
//         } catch (exception) {
//             console.log(exception);
//             toast.error("Error while creating banner");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleFileChange = (e: any) => {
//         const uploaded = e.target.files[0];
//         setValue('image', uploaded);
//     };

//     return (
//         <>
//             <section>
//                 <div className="mx-auto max-w-screen-xl px-4 py-4 sm:px-6 lg:px-8">
//                     <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-16">
//                         <div className="col-span-full lg:col-span-1">
//                             <h1 className="text-4xl font-bold text-center lg:text-left">
//                                 About Create
//                             </h1>
//                         </div>
//                     </div>

//                     <div className="rounded-lg border border-gray-200 mt-8">
//                         <div className="overflow-x-auto rounded-t-lg">
//                             <form onSubmit={handleSubmit(submitEvent)} className="grid grid-cols-6 gap-6">
//                                 <div className="col-span-6 ">
//                                     <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                        
//                                     </label>
//                                     <TextInputField
//                                         control={control}
//                                         name="title"
//                                         errMsg={errors?.title?.message as string}
//                                         required={true}
//                                     />
//                                 </div>

//                                 <div className="col-span-6">
//                                     <label htmlFor="content" className="block text-sm font-medium text-gray-700">  </label>
//                                     <TextInputField
//                                         control={control}
//                                         name="content"
//                                         type="url"
//                                         errMsg={errors?.content?.message as string}
//                                         required={true}
//                                     />
//                                 </div>                                
//                                 <div className="col-span-6 ">
//                                     <label htmlFor="image" className="block text-sm font-medium text-gray-700">
//                                         Image
//                                     </label>
//                                     <input
//                                         id="file_input"
//                                         type="file"
//                                         onChange={handleFileChange}
//                                     />
//                                     <span className="text-red-500">{errors?.image?.message}</span>
//                                 </div>

//                                 <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
//                                     <button
//                                         className="inline-block shrink-0 rounded-md border border-green-700 bg-green-700 px-6 py-2 text-sm font-medium text-white transition hover:bg-transparent hover:text-green-500 focus:outline-none focus:ring active:text-green-600"
//                                         disabled={loading}
//                                     >
//                                         Create About
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//         </>
//     );
// };

// export default AdminAboutCreate;

import { useForm, useFieldArray, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axiosInstance from "../../config/axios.config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AdminAboutCreate = () => {
    let [loading, setLoading] = useState(false);

    const teamMemberSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        position: Yup.string().required('Position is required'),
    });

    const createDTO = Yup.object().shape({
        title: Yup.string().min(2, 'Title must be at least 2 characters').required('Title is required'),
        content: Yup.string().required('Content is required'),
        image: Yup.mixed().required(),
        team: Yup.array().of(teamMemberSchema).required('Team is required'),
    });

    const { control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(createDTO)
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "team"
    });

    const navigate = useNavigate();

    const submitEvent = async (data: any) => {
        try {
            setLoading(true);
            const mappedData={
                ...data,
        
            }
            const response = await axiosInstance.post('/about', mappedData, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('accessToken'),
                    "Content-Type": "multipart/form-data"
                }
            });
            toast.success("About section created successfully.");
            navigate("/admin/about");
        } catch (exception) {
            console.log(exception);
            toast.error("Error while creating about section");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: any) => {
        const uploaded = e.target.files[0];
        setValue('image', uploaded);
    };

    return (
        <section>
            <div className="mx-auto max-w-screen-xl px-4 py-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-16">
                    <div className="col-span-full lg:col-span-1">
                        <h1 className="text-4xl font-bold text-center lg:text-left">
                            About Create
                        </h1>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 mt-8">
                    <div className="overflow-x-auto rounded-t-lg">
                        <form onSubmit={handleSubmit(submitEvent)} className="grid grid-cols-6 gap-6">
                            <div className="col-span-6">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                    Title
                                </label>
                                <Controller
                                    control={control}
                                    name="title"
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="text"
                                            className="input border border-gray-300 p-2 rounded w-full"
                                        />
                                    )}
                                />
                                <span className="text-red-500">{errors?.title?.message}</span>
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
                                    id="file_input"
                                    type="file"
                                    onChange={handleFileChange}
                                    className="input border border-gray-300 p-2 rounded w-full"
                                />
                                <span className="text-red-500">{errors?.image?.message}</span>
                            </div>

                            <div className="col-span-6">
                                <label className="block text-sm font-medium text-gray-700">
                                    Team
                                </label>
                                {fields.map((field, index) => (
                                    <div key={field.id} className="mb-4 border-b pb-4">
                                        <div className="mb-2">
                                            <label htmlFor={`team.${index}.name`} className="block text-sm font-medium text-gray-700">
                                                Name
                                            </label>
                                            <Controller
                                                control={control}
                                                name={`team.${index}.name`}
                                                render={({ field }) => (
                                                    <input
                                                        {...field}
                                                        type="text"
                                                        className="input border border-gray-300 p-2 rounded w-full"
                                                    />
                                                )}
                                            />
                                            <span className="text-red-500">{errors?.team?.[index]?.name?.message}</span>
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor={`team.${index}.position`} className="block text-sm font-medium text-gray-700">
                                                Position
                                            </label>
                                            <Controller
                                                control={control}
                                                name={`team.${index}.position`}
                                                render={({ field }) => (
                                                    <input
                                                        {...field}
                                                        type="text"
                                                        className="input border border-gray-300 p-2 rounded w-full"
                                                    />
                                                )}
                                            />
                                            <span className="text-red-500">{errors?.team?.[index]?.position?.message}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="inline-block shrink-0 rounded-md border border-red-700 bg-red-700 px-2 py-1 text-sm font-medium text-white transition hover:bg-transparent hover:text-red-700 focus:outline-none focus:ring active:text-red-600"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => append({ name: '', position: '' })}
                                    className="inline-block shrink-0 rounded-md border border-blue-700 bg-blue-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-700 focus:outline-none focus:ring active:text-blue-600"
                                >
                                    Add Team Member
                                </button>
                                <span className="text-red-500">{errors?.team?.message}</span>
                            </div>

                            <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                                <button
                                    type="submit"
                                    className="inline-block shrink-0 rounded-md border border-green-700 bg-green-700 px-6 py-2 text-sm font-medium text-white transition hover:bg-transparent hover:text-green-700 focus:outline-none focus:ring active:text-green-600"
                                    disabled={loading}
                                >
                                    Create About
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminAboutCreate;
