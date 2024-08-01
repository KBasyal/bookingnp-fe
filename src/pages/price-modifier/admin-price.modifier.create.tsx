import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import axiosInstance from '../../config/axios.config';
import { useNavigate } from 'react-router-dom';
import SelectHotelComponent from '../hotel/hotel-select.component';
import SelectRoomComponent from '../room/room-select';
import { TextInputField } from '../../components/common/form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const offerTypes = [
    { label: "Seasonal", value: "Seasonal" },
    { label: "Discount", value: "Discount" },
    { label: "Service Charge", value: "Service Charge" },
    { label: "Other", value: "Other" }
];

const createDTO = Yup.object().shape({
    type: Yup.object({
        label: Yup.string().matches(/^(Seasonal|Discount|Service Charge|Other)$/).required(),
        value: Yup.string().matches(/^(Seasonal|Discount|Service Charge|Other)$/).required()
    }),
    percentage: Yup.number().required(),
    applicableFrom: Yup.date().required(),
    applicableTo: Yup.date().required(),
    hotel_id: Yup.string().required('Hotel is required'),
    room_id: Yup.string().required('Room is required'),
});

const AdminPriceModifierCreate = () => {
    const [loading, setLoading] = useState(false);
    const [hotels, setHotels] = useState([]);
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();
    const { control, handleSubmit, formState: { errors }, watch } = useForm({
        resolver: yupResolver(createDTO),
    });

    const selectedHotelId = watch("hotel_id");

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                setLoading(true);
                const response:any = await axiosInstance.get('/hotel', {
                    params: { page: 1, limit: 100 },
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("accessToken")
                    }
                });
                const hotelsData = response.result;
                const hotelOptions = hotelsData.map((hotel:any) => ({
                    label: hotel.name,
                    value: hotel._id
                }));
                setHotels(hotelOptions);
            } catch (exception) {
                console.error("Failed to load hotels");
                toast.error("Failed to load hotels");
            } finally {
                setLoading(false);
            }
        };
        fetchHotels();
    }, []);

    useEffect(() => {
        if (selectedHotelId) {
            const fetchRooms = async (hotelId:any) => {
                try {
                    setLoading(true);
                    const response:any = await axiosInstance.get('/room', {
                        params: { hotel_id: hotelId },
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("accessToken")
                        }
                    });
                    const roomsData = response.result;
                    const roomOptions = roomsData.map((room:any) => ({
                        label: room._id,
                        value: room._id
                    }));
                    setRooms(roomOptions);
                } catch (exception) {
                    console.error("Failed to load rooms:", exception);
                    toast.error("Failed to load rooms");
                } finally {
                    setLoading(false);
                }
            };
            fetchRooms(selectedHotelId);
        } else {
            setRooms([]);
        }
    }, [selectedHotelId]);

    const submitEvent = async (data:any) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('type', data.type.value);
            formData.append('percentage', data.percentage);
            formData.append('applicableFrom', data.applicableFrom.toISOString());
            formData.append('applicableTo', data.applicableTo.toISOString());
            formData.append('hotel_id', data.hotel_id);
            formData.append('room_id', data.room_id);

            await axiosInstance.post('/price-modifier', formData, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('accessToken'),
                }
            });
            toast.success("Room Facility created successfully.");
            navigate("/admin/price-modifier");
        } catch (exception) {
            console.error("Error while creating Room facility:", exception);
            toast.error("Error while creating Room facility");
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
                            Room Facility Create
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
                                <label htmlFor="room_id" className="block text-sm font-medium text-gray-700">
                                    Room
                                </label>
                                <Controller
                                    name="room_id"
                                    control={control}
                                    render={({ field }) => (
                                        <SelectHotelComponent
                                            options={rooms}
                                            value={field.value}
                                            onChange={field.onChange}
                                            errMsg={errors?.room_id?.message}
                                            isDisabled={loading}
                                        />
                                    )}
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
                                        />
                                    )}
                                />
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
                                    Create Price Modifier
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminPriceModifierCreate;

