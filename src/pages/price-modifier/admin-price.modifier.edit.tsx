import { Controller, useForm } from "react-hook-form";
import { TextInputField } from "../../components/common/form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axiosInstance from "../../config/axios.config";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { LoadingComponent } from "../../components/common";
import SelectRoomComponent from "../room/room-select";
import DatePicker from "react-datepicker";

const editDTO = Yup.object().shape({
    type: Yup.object({
        label: Yup.string().matches(/^(Seasonal|Discount|Service Charge|Other)$/).required(),
        value: Yup.string().matches(/^(Seasonal|Discount|Service Charge|Other)$/).required()
    }).required("Type is required"), // Added this line
    percentage: Yup.number().required("Percentage is required"),
    applicableFrom: Yup.date().required("Applicable From is required"),
    applicableTo: Yup.date().required("Applicable To is required"),
    hotel_id: Yup.string().required('Hotel is required'),
    room_id: Yup.string().required('Room is required'),
});

const offerTypes = [
    { label: "Seasonal", value: "Seasonal" },
    { label: "Discount", value: "Discount" },
    { label: "Service Charge", value: "Service Charge" },
    { label: "Other", value: "Other" }
];

const AdminPriceModifierEdit = () => {
    const [loading, setLoading] = useState(true);
    const [hotelName, setHotelName] = useState("");
    const [roomId, setRoomId] = useState("");
    const params = useParams();
    const navigate = useNavigate();
    const { control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(editDTO)
    });

    const submitEvent = async (data: any) => {
        try {
            setLoading(true);
            console.log("Submitting data:", data);
            console.log("submitting type:", data.type.value)

            const formData = new FormData();
            formData.append("room_id", data.room_id);
            formData.append("percentage", data.percentage);
            formData.append("applicableFrom", data.applicableFrom);
            formData.append("applicableTo", data.applicableTo);
            formData.append("hotel_id", data.hotel_id);

            formData.append("type", data.type.value); // Send only the value

            await axiosInstance.put(`/price-modifier/${params.id}`, formData, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('accessToken'),
                    'Content-Type': 'multipart/form-data'
                },
            });
            // console.log("the submitted data is:", formData)

            toast.success("Price Modifier updated successfully.");
            navigate("/admin/price-modifier");
        } catch (exception) {
            console.error("Error while updating price modifier:", exception);
            toast.error("Error while updating price modifier");
        } finally {
            setLoading(false);
        }
    };

    const fetchHotelName = async (hotelId: string) => {
        try {
            const response: any = await axiosInstance.get(`/hotel/${hotelId}`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('accessToken')
                }
            });
            setHotelName(response.result.name);
        } catch (exception) {
            console.error("Error fetching hotel name:", exception);
            toast.error("Error fetching hotel details");
        }
    };

    const getRoomFacilityById = async () => {
        try {
            const response: any = await axiosInstance.get(`/price-modifier/${params.id}`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('accessToken')
                }
            });

            const result = response.result;
            console.log(result);
            setValue("percentage", result.percentage);
            setValue("applicableTo", result.applicableTo);
            setValue("applicableFrom", result.applicableFrom);
            setValue("hotel_id", result.hotel_id);
            setValue("room_id", result.room_id);
            setValue("type", {
                label: result.type,
                value: result.type
            });

            setRoomId(result.room_id);
            await fetchHotelName(result.hotel_id);
        } catch (error) {
            console.error("Error fetching price modifier details:", error);
            toast.error("Error fetching price modifier details");
            navigate("/admin/price-modifier");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (params.id) {
            getRoomFacilityById();
        }
    }, [params.id]);

    return (
        <section>
            <div className="mx-auto max-w-screen-xl px-4 py-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-16">
                    <div className="col-span-full lg:col-span-1">
                        <h1 className="text-4xl font-bold text-center lg:text-left">
                            Edit Price Modifier
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
                                    <label htmlFor="roomId" className="block text-sm font-medium text-gray-700">
                                        Room ID
                                    </label>
                                    <p className="mt-1 text-gray-900">{roomId}</p>
                                </div>
                                <div className="col-span-6">
                                    <label htmlFor="hotelName" className="block text-sm font-medium text-gray-700">
                                        Hotel Name
                                    </label>
                                    <p className="mt-1 text-gray-900">{hotelName}</p>
                                </div>
                                <div className="col-span-6">
                                    <label htmlFor="percentage" className="block text-sm font-medium text-gray-700">
                                        Percentage
                                    </label>
                                    <TextInputField
                                        control={control}
                                        name="percentage"
                                        errMsg={errors?.percentage?.message}
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
                                            <SelectRoomComponent
                                                options={offerTypes}
                                                value={field.value}
                                                onChange={field.onChange}
                                                errMsg={errors?.type?.message}
                                                isDisabled={loading}
                                                placeholder="Select offer types"
                                            />
                                        )}
                                    />
                                </div>
                                <div className="col-span-6">
                                <label htmlFor="applicableFrom" className="block text-sm font-medium text-gray-700">
                                    Applicable From
                                </label>
                                <Controller
                                    name="applicableFrom"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            selected={field.value}
                                            onChange={(date) => field.onChange(date)}
                                            dateFormat="yyyy-MM-dd"
                                            className="form-input w-full"
                                            placeholderText="Select a start date"
                                            isClearable
                                        />
                                    )}
                                />
                                {errors.applicableFrom && <p className="text-red-600 text-sm mt-1">{errors.applicableFrom.message}</p>}
                            </div>
                            <div className="col-span-6">
                                <label htmlFor="applicableTo" className="block text-sm font-medium text-gray-700">
                                    Applicable To
                                </label>
                                <Controller
                                    name="applicableTo"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            selected={field.value}
                                            onChange={(date) => field.onChange(date)}
                                            dateFormat="yyyy-MM-dd"
                                            className="form-input w-full"
                                            placeholderText="Select an end date"
                                            isClearable
                                        />
                                    )}
                                />
                                {errors.applicableTo && <p className="text-red-600 text-sm mt-1">{errors.applicableTo.message}</p>}
                            </div>
                                <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                                    <button
                                        type="submit"
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

export default AdminPriceModifierEdit;

