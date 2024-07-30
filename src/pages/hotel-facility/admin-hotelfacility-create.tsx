import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axiosInstance from '../../config/axios.config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { SelectOptionComponent, TextInputField } from '../../components/common/form';
import SelectHotelComponent from '../hotel/hotel-select.component';

const createDTO = Yup.object().shape({
    priceImpact:Yup.number().required(),
    isincluded: Yup.object({
        label:Yup.string().matches(/^(Included|Not Included)$/),
        value:Yup.string().matches(/^(included|not included)$/)
    }),
    hotel_id: Yup.string().required('Hotel is required'),
    facility_id: Yup.string().required('Facility is required'),
});

const AdminHotelFacilityCreate = () => {
    const [loading, setLoading] = useState(false);
    const [hotels, setHotels] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const navigate = useNavigate();
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(createDTO),

    });

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('/hotel', {
                    params: { page: 1, limit: 100 },
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("accessToken")
                    }
                });
                const hotelsData = response.result; // Ensure correct field name
                const hotelOptions = hotelsData.map((hotel: { name: any; _id: any; }) => ({
                    label: hotel.name,
                    value: hotel._id
                }));
                setHotels(hotelOptions);
            } catch (exception:any) {
                console.error("Failed to load hotels");
                toast.error("Failed to load hotels");
            } finally {
                setLoading(false);
            }
        };
        fetchHotels();
    }, []);

    useEffect(() => {
        const fetchFacilities = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('/facility', {
                    params: { page: 1, limit: 100 },
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("accessToken")
                    }
                });
                const facilitiesData = response.result; // Ensure correct field name
                const facilityOptions = facilitiesData.map((facility: { name: any; _id: any; }) => ({
                    label: facility.name,
                    value: facility._id
                }));
                setFacilities(facilityOptions);
            } catch (exception:any) {
                console.error("Failed to load facilities:", exception.message || exception);
                toast.error("Failed to load facilities");
            } finally {
                setLoading(false);
            }
        };
        fetchFacilities();
    }, []);

    const submitEvent = async (data:any) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('isincluded', data.isincluded.value);
            formData.append('priceImpact', data.priceImpact);
            formData.append('hotel_id', data.hotel_id);
            formData.append('facility_id', data.facility_id); // Added this line
          

            await axiosInstance.post('/hotel-facility', formData, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('accessToken'),
                    // "Content-Type": "multipart/form-data"
                }
            });
            toast.success("HotelFacility created successfully.");
            navigate("/admin/hotelfacility");
        } catch (exception:any) {
            console.error("Error while creating hotelfacility:", exception.message || exception);
            toast.error("Error while creating hotelfacility");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            <div className="mx-auto max-w-screen-xl px-4 py-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-16">
                    <div className="col-span-full lg:col-span-1">
                        <h1 className="text-4xl font-bold text-center lg:text-left">
                            HotelFacility Create
                        </h1>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 mt-8">
                    <div className="overflow-x-auto rounded-t-lg">
                        <form onSubmit={handleSubmit(submitEvent)} className="grid grid-cols-6 gap-6">
                            <div className="col-span-6">
                                <label htmlFor="hotel_id" className="block text-sm font-medium text-gray-700">
                                    Hotel
                                </label>
                                <Controller
                                    name="hotel_id"
                                    control={control}
                                    render={({ field }) => (
                                        <SelectHotelComponent
                                            options={hotels}
                                            value={field.value}
                                            onChange={field.onChange}
                                            errMsg={errors?.hotel_id?.message}
                                            isDisabled={loading}
                                        />
                                    )}
                                />
                            </div>
                            <div className="col-span-6">
                                <label htmlFor="facility_id" className="block text-sm font-medium text-gray-700">
                                    Facility
                                </label>
                                <Controller
                                    name="facility_id"
                                    control={control}
                                    render={({ field }) => (
                                        <SelectHotelComponent
                                            options={facilities}
                                            value={field.value}
                                            onChange={field.onChange}
                                            errMsg={errors?.facility_id?.message}
                                            isDisabled={loading}
                                        />
                                    )}
                                />
                            </div>
                        
                            <div className="col-span-6">
                                <label htmlFor="priceImpact" className="block text-sm font-medium text-gray-700">
                                    
                                </label>
                                <TextInputField
                                    control={control}
                                    type="number"
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
                                    type="submit"
                                    className="inline-block shrink-0 rounded-md border border-green-700 bg-green-700 px-6 py-2 text-sm font-medium text-white transition hover:bg-transparent hover:text-green-500 focus:outline-none focus:ring active:text-green-600"
                                    disabled={loading}
                                >
                                    Create HotelFacility
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminHotelFacilityCreate;
