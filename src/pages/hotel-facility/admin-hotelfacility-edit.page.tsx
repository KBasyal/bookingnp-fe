import { useForm } from "react-hook-form";
import { SelectOptionComponent, TextInputField } from "../../components/common/form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axiosInstance from "../../config/axios.config";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { LoadingComponent } from "../../components/common";

const editDTO = Yup.object().shape({
    priceImpact: Yup.number().required(),
    isincluded: Yup.object({
        label: Yup.string().matches(/^(Included|Not Included)$/),
        value: Yup.string().matches(/^(included|not included)$/)
    }),
    hotel_id: Yup.string().required('Hotel is required'),
    facility_id: Yup.string().required('Facility is required'),
});

const AdminHotelFacilityEdit = () => {
    const [loading, setLoading] = useState(true);
    const [hotelName, setHotelName] = useState("");
    const [facilityName, setFacilityName] = useState("");
    const params = useParams();
    const navigate = useNavigate();
    const { control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(editDTO)
    });
    const submitEvent = async (data: any) => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("priceImpact", data.priceImpact);
            formData.append("numberofBed", data.facility_id);
            formData.append("hotel_id", data.hotel_id);
            formData.append("isincluded", data.isincluded.value);

            if (data.image) {
                formData.append("image", data.image);
            }

            // Log formData contents for debugging
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }

            await axiosInstance.put(`/hotel-facility/${params.id}`, formData, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('accessToken'),
                },
            });

            toast.success("Hotel Facillity updated successfully.");
            navigate("/admin/hotel-facility");
        } catch (exception) {
            console.error(exception);
            toast.error("Error while updating room");
        } finally {
            setLoading(false);
        }
    };


    const fetchHotelName = async (hotelId: any) => {
        try {
            const response = await axiosInstance.get(`/hotel/${hotelId}`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('accessToken')
                }
            });
            console.log("hotel response:", response)
            setHotelName(response.result.name);
        } catch (exception) {
            console.error("Error fetching hotel name:", exception);
            toast.error("Error fetching hotel details");
        }
    };

    const fetchFacilityName = async (facilityId: any) => {
        try {
            const response = await axiosInstance.get(`/facility/${facilityId}`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('accessToken')
                }
            });
            setFacilityName(response.result.name);
        } catch (error) {
            console.error("Error fetching facility name:", error);
            toast.error("Error fetching facility details");
        }
    };

    const getHotelFacilityById = async () => {
        try {
            const response = await axiosInstance.get(`/hotel-facility/${params.id}`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('accessToken')
                }
            });
            const result = response.result;
            setValue("priceImpact", result.priceImpact);
            setValue("facility_id", result.facility_id);
            setValue("hotel_id", result.hotel_id);
            setValue("isincluded", {
                label: result.isBooked === 'included' ? 'Included' : 'Not Included',
                value: result.isBooked
            });
            console.log("The result is:", result);
            await fetchHotelName(result.hotel_id);
            await fetchFacilityName(result.facility_id);
        } catch (error) {
            console.error("Error fetching hotel facility details:", error);
            toast.error("Error fetching hotel facility details");
            navigate("/admin/hotel-facility");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getHotelFacilityById();
    }, [params.id]);

    return (
        <section>
            <div className="mx-auto max-w-screen-xl px-4 py-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-16">
                    <div className="col-span-full lg:col-span-1">
                        <h1 className="text-4xl font-bold text-center lg:text-left">
                            Hotel Facility
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
                                    <label htmlFor="hotelName" className="block text-sm font-medium text-gray-700">
                                        Hotel Name
                                    </label>
                                    <p className="mt-1 text-gray-900">{hotelName}</p>
                                </div>
                                <div className="col-span-6">
                                    <label htmlFor="facilityName" className="block text-sm font-medium text-gray-700">
                                        Facility Name
                                    </label>
                                    <p className="mt-1 text-gray-900">{facilityName}</p>
                                </div>
                                <div className="col-span-6">
                                    <label htmlFor="priceImpact" className="block text-sm font-medium text-gray-700">
                                    </label>
                                    <TextInputField
                                        control={control}
                                        name="priceImpact"
                                        errMsg={errors?.priceImpact?.message}
                                        required
                                    />
                                </div>
                                <div className="col-span-6">
                                    <label htmlFor="isincluded" className="block text-sm font-medium text-gray-700">
                                    </label>
                                    <SelectOptionComponent
                                        options={[{ label: "Included", value: "included" }, { label: "Not Included", value: "not included" }]}
                                        name="isincluded"
                                        control={control}
                                        errMsg={errors?.isincluded?.message as string}
                                    />
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

export default AdminHotelFacilityEdit;


