import { useForm, Controller } from "react-hook-form";
import { SelectOptionComponent, TextInputField } from "../../components/common/form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axiosInstance from "../../config/axios.config";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SelectHotelComponent from "../hotel/hotel-select.component";
import { LoadingComponent } from "../../components/common";


const roomTypeOptions = [
    { label: "Single Room", value: "Single Room" },
    { label: "Double Room", value: "Double Room" },
    { label: "Twin Room", value: "Twin Room" },
    { label: "Triple Room", value: "Triple Room" },
    { label: "Quad Room", value: "Quad Room" },
    { label: "Queen Room", value: "Queen Room" },
    { label: "King Room", value: "King Room" },
    { label: "Studio Room", value: "Studio Room" },
    { label: "Suite", value: "Suite" },
    { label: "Junior Suite", value: "Junior Suite" },
    { label: "Presidential Suite", value: "Presidential Suite" },
    { label: "Accessible Room", value: "Accessible Room" },
    { label: "Connecting Rooms", value: "Connecting Rooms" },
    { label: "Adjoining Rooms", value: "Adjoining Rooms" },
    { label: "Deluxe Room", value: "Deluxe Room" },
    { label: "Executive Room", value: "Executive Room" },
    { label: "Penthouse", value: "Penthouse" }
];

const editDTO = Yup.object({
    type: Yup.string()
        .oneOf(roomTypeOptions.map(option => option.value), 'Invalid room type')
        .required('Room type is required'),
    price_per_night: Yup.string()
        .min(1, 'Price per night must be at least 100')
        .required('Price per night is required'),
    numberofBed: Yup.string()
        .min(1, 'Number of beds must be at least 1')
        .required('Number of beds is required'),
    isBooked: Yup.object({
        label: Yup.string().matches(/^(Open|Booked)$/),
        value: Yup.string().matches(/^(open|booked)$/)
    }).required(),
    hotel_id: Yup.string().required('Hotel is required'),
    image: Yup.mixed().optional()
});

const AdminRoomEdit = () => {
    const [loading, setLoading] = useState(true);
    const [detail, setDetail] = useState<any>({});
    const params = useParams();
    const navigate = useNavigate();
    const { control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(editDTO)
    });
    const submitEvent = async (data: any) => {
        try {
            setLoading(true);
    
            const formData = new FormData();
            formData.append("type", data.type);
            formData.append("price_per_night", data.price_per_night);
            formData.append("numberofBed", data.numberofBed);
            formData.append("hotel_id", data.hotel_id);
            formData.append("isBooked", data.isBooked.value);
    
            if (data.image) {
                formData.append("image", data.image);
            }
    
            // Log formData contents for debugging
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }
    
            await axiosInstance.put(`/room/${params.id}`, formData, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('accessToken'),
                    "Content-Type": "multipart/form-data",
                    // Do not set 'Content-Type' header, let the browser handle it
                },
            });
    
            toast.success("Room updated successfully.");
            navigate("/admin/room");
        } catch (exception) {
            console.error(exception);
            toast.error("Error while updating room");
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

    const getRoomById = async () => {
        try {
            const response: any = await axiosInstance.get(`/room/${params.id}`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('accessToken')
                }
            });
            console.log("Room Response is:", response);

            setValue("type", response.result.type);
            setValue("price_per_night", response.result.price_per_night);
            setValue("numberofBed", response.result.numberofBed);
            setValue("hotel_id", response.result.hotel_id);
            setValue("isBooked", {
                label: response.result.isBooked === 'open' ? 'Open' : 'Booked',
                value: response.result.isBooked
            });
            setValue("image", response.result.image)
            setDetail(response.result as any);
        } catch (exception) {
            console.error("Room fetch error:", exception);
            toast.error("Room fetch error");
            navigate("/admin/room");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getRoomById();
    }, [params.id]);

    return (
        <section>
            <div className="mx-auto max-w-screen-xl px-4 py-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-16">
                    <div className="col-span-full lg:col-span-1">
                        <h1 className="text-4xl font-bold text-center lg:text-left">
                            Room Edit
                        </h1>
                    </div>
                </div>
                <div className="rounded-lg border border-gray-200 mt-8">
                    <div className="overflow-x-auto rounded-t-lg">
                        {loading ? (
                            <LoadingComponent />
                        ) : (
                            <form onSubmit={handleSubmit(submitEvent)} className="grid grid-cols-6 gap-6">

                                <div className="col-span-6">
                                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                                        Room Type
                                    </label>
                                    <Controller
                                        name="type"
                                        control={control}
                                        render={({ field }) => (
                                            <SelectHotelComponent
                                                options={roomTypeOptions}
                                                value={field.value}
                                                onChange={field.onChange}
                                                errMsg={errors?.type?.message}
                                                isDisabled={loading}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="col-span-6">
                                    <label htmlFor="price_per_night" className="block text-sm font-medium text-gray-700">

                                    </label>
                                    <TextInputField
                                        control={control}
                                        name="price_per_night"
                                        errMsg={errors?.price_per_night?.message}
                                        required
                                    />
                                </div>
                                <div className="col-span-6">
                                    <label htmlFor="numberofBed" className="block text-sm font-medium text-gray-700">
                                    </label>
                                    <TextInputField
                                        control={control}
                                        type="number"
                                        name="numberofBed"
                                        errMsg={errors?.numberofBed?.message}
                                        required
                                    />
                                </div>
                                <div className="col-span-6">
                                    <label htmlFor="isBooked" className="block text-sm font-medium text-gray-700">
                                    </label>

                                    <SelectOptionComponent
                                        options={[{ label: "Open", value: "open" }, { label: "Booked", value: "booked" }]}
                                        name="isBooked"
                                        control={control}
                                        errMsg={errors?.isBooked?.message as string}
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
                                                src={detail.image}
                                                alt="Room"
                                                className="rounded-lg object-cover"
                                            />
                                        )}
                                    </div>
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
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminRoomEdit;
