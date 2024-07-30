import { useForm, Controller } from "react-hook-form";
import { TextInputField } from "../../components/common/form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axiosInstance from "../../config/axios.config";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SelectHotelComponent from "./hotel-select.component";
import { LoadingComponent } from "../../components/common";

const hotelTypeOptions = [
    { label: "Luxury Hotel", value: "Luxury Hotel" },
    { label: "Boutique Hotel", value: "Boutique Hotel" },
    { label: "Resort Hotel", value: "Resort Hotel" },
    { label: "Business Hotel", value: "Business Hotel" },
    { label: "Airport Hotel", value: "Airport Hotel" },
    { label: "Extended Stay Hotel", value: "Extended Stay Hotel" },
    { label: "Bed and Breakfast", value: "Bed and Breakfast" },
    { label: "Motel", value: "Motel" },
    { label: "Inn", value: "Inn" },
    { label: "Hostel", value: "Hostel" },
    { label: "Eco Hotel", value: "Eco Hotel" },
    { label: "Apartment Hotel", value: "Apartment Hotel" },
    { label: "Casino Hotel", value: "Casino Hotel" },
    { label: "Conference Hotel", value: "Conference Hotel" },
    { label: "Family Hotel", value: "Family Hotel" },
    { label: "Historic Hotel", value: "Historic Hotel" },
    { label: "Beach Hotel", value: "Beach Hotel" },
    { label: "Ski Hotel", value: "Ski Hotel" }
];

const editDTO = Yup.object({
    name: Yup.string().min(3, 'Name must be at least 3 characters').required('Name is required'),
    country: Yup.string().min(3, 'Country must be at least 3 characters').required('Country is required'),
    city: Yup.string().required('City is required'),
    type: Yup.string()
        .oneOf(hotelTypeOptions.map(option => option.value), 'Invalid hotel type')
        .required('Hotel type is required'),

    description: Yup.string().min(2, 'Description must be at least 2 characters').required('Description is required'),
    image: Yup.mixed().optional()
});

const AdminHotelEdit = () => {
    const [loading, setLoading] = useState(true);
    const [detail, setDetail] = useState<any>({});
    const params = useParams();
    const navigate = useNavigate();
    const { control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(editDTO)
    });

    const submitEvent = async (data:any) => {
        try {
          setLoading(true);
      
          const formData = new FormData();
          formData.append("name", data.name);
          formData.append("country", data.country);
          formData.append("city", data.city);
          formData.append("type", data.type); // `data.type` should be the correct type string
          formData.append("description", data.description);
      
          if (data.image) {
            formData.append("image", data.image);
          }
      
          await axiosInstance.put(`/hotel/${params.id}`, formData, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("accessToken"),
              "Content-Type": "multipart/form-data",
            },
          });
      
          toast.success("Hotel updated successfully.");
          navigate("/admin/hotel");
        } catch (exception) {
          console.error(exception);
          toast.error("Error while updating hotel");
        } finally {
          setLoading(false);
        }
      };
      



    const handleFileChange = (e: any) => {
        const uploaded = e.target.files[0];
        if (uploaded) {
            setValue('image', uploaded);
        }
    };

    const getHotelById = async () => {
        try {
            const response: any = await axiosInstance.get(`/hotel/${params.id}`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('accessToken')
                }
            });
            console.log("Hotel Response is:", response);

            setValue("name", response.result.name);
            setValue("country", response.result.country);
            setValue("city", response.result.city);
            setValue("description", response.result.description);
            setValue("type", response.result.type);
            

            setDetail(response);

        } catch (exception) {
            console.error("Hotel fetch error:", exception);
            toast.error("Hotel fetch error");
            navigate("/admin/hotel");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getHotelById();
    }, [params.id]);

    return (
        <section>
            <div className="mx-auto max-w-screen-xl px-4 py-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-16">
                    <div className="col-span-full lg:col-span-1">
                        <h1 className="text-4xl font-bold text-center lg:text-left">
                            Hotel Edit
                        </h1>
                    </div>
                </div>
            </div>
            <div className="rounded-lg border border-gray-200 mt-8">
                <div className="overflow-x-auto rounded-t-lg">
                    {loading ? (
                        <LoadingComponent />
                    ) : (
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
                                <label htmlFor="country" className="block text-sm font-medium text-gray-700">

                                </label>
                                <TextInputField
                                    control={control}
                                    name="country"
                                    errMsg={errors?.country?.message}
                                    required
                                />
                            </div>

                            <div className="col-span-6">
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">

                                </label>
                                <TextInputField
                                    control={control}
                                    name="city"
                                    errMsg={errors?.city?.message}
                                    required
                                />
                            </div>

                            <div className="col-span-6">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">

                                </label>
                                <TextInputField
                                    control={control}
                                    name="description"
                                    errMsg={errors?.description?.message}
                                    required
                                />
                            </div>

                            <div className="col-span-6">
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                                    Type
                                </label>
                                <Controller
                                    name="type"
                                    control={control}
                                    render={({ field }) => (
                                        <SelectHotelComponent
                                            options={hotelTypeOptions}
                                            value={field.value}
                                            onChange={field.onChange}
                                            errMsg={errors?.type?.message}
                                            isDisabled={loading}
                                        />
                                    )}
                                />
                            </div>

                            <div className="col-span-6">
                                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                    Image
                                </label>
                                <input
                                    id="file_input"
                                    type="file"
                                    onChange={handleFileChange}
                                />
                                <div className="block w-[25%]">
                                    {detail.image && (
                                        <img
                                            src={`${import.meta.env.VITE_IMAGE_URL}/uploads/hotels/${detail.image}`}
                                            alt="Hotel"
                                            crossOrigin="anonymous"
                                        />
                                    )}
                                </div>
                                <span className="text-red-500">{errors?.image?.message}</span>
                            </div>

                            <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                                <button
                                    type="submit"
                                    className="inline-block shrink-0 rounded-md border border-green-700 bg-green-700 px-6 py-2 text-sm font-medium text-white transition hover:bg-transparent hover:text-green-500 focus:outline-none focus:ring active:text-green-600"
                                    disabled={loading}
                                >
                                    Update Hotel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AdminHotelEdit;
