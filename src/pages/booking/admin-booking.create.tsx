import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import axiosInstance from '../../config/axios.config';
import { useNavigate } from 'react-router-dom';
import SelectHotelComponent from '../hotel/hotel-select.component';
import { TextInputField } from '../../components/common/form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const createDTO = Yup.object().shape({
    hotel_id: Yup.string().required(),
    room_id: Yup.string().required(),
    checkin: Yup.date().required(),
    checkout: Yup.date().required(),
    noofguests: Yup.string().required(),
    total: Yup.string().required()
});

const AdminBookingCreate = () => {
    const [loading, setLoading] = useState(false);
    const [hotels, setHotels] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [roomDetails, setRoomDetails] = useState<any>({});
    const [pricePerNight, setPricePerNight] = useState(0);
    const [hotelId, setHotelId]= useState([]);
    const [noOfBed, setNoOfBed] =useState([]);
    const navigate = useNavigate();
    const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm({
        resolver: yupResolver(createDTO),
        defaultValues: {
            hotel_id: '',
            room_id: '',
            noofguests: '',
            total: ''
        }
    });

    const selectedHotelId = watch("hotel_id");
    const selectedRoomId = watch("room_id");
    const checkin = watch("checkin");
    const checkout = watch("checkout");

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                setLoading(true);
                const response: any = await axiosInstance.get('/hotel', {
                    params: { page: 1, limit: 100 },
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("accessToken")
                    }
                });
                const hotelsData = response.result;
                const hotelOptions = hotelsData.map((hotel: { name: any; _id: any; }) => ({
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
            const fetchRooms = async (hotelId: string) => {
                try {
                    setLoading(true);
                    const response: any = await axiosInstance.get('/room', {
                        params: { hotel_id: hotelId },
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("accessToken")
                        }
                    });
                    const roomsData = response.result;
                    const roomOptions = roomsData.map((room: { _id: any; price_per_night: any; }) => ({
                        label: room._id,
                        value: room._id,
                        pricePerNight: room.price_per_night,
            
                        
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

    useEffect(() => {
        if (selectedRoomId) {
            const fetchFacilities = async (roomId: any) => {
                try {
                    setLoading(true);
                    const response: any = await axiosInstance.get('/room-facility', {
                        params: { room_id: roomId },
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("accessToken")
                        }
                    });
                    const facilitiesData = response.result;

                    const facilityIds: any = facilitiesData.map((facility: { facility_id: any; }) => facility.facility_id);

                    const facilityResponses: any = await Promise.all(
                        facilityIds.map((facilityId: any) =>
                            axiosInstance.get(`/facility/${facilityId}`, {
                                headers: {
                                    Authorization: "Bearer " + localStorage.getItem("accessToken")
                                }
                            })
                        )
                    );

                    const facilityOptions: any = facilityResponses.map((res: { result: { name: any; _id: any; }; }) => ({
                        label: res.result.name,
                        value: res.result._id
                    }));

                    setFacilities(facilityOptions);

                    // Find the selected room and store its details
                    const room: any = rooms.find(room => room.value === roomId);
                    if (room) {
                        setPricePerNight(room.pricePerNight);
                        // Store selected room details
                    }
                } catch (exception) {
                    console.log("Failed to load facilities:", exception);
                    toast.error("Failed to load facilities");
                } finally {
                    setLoading(false);
                }
            };
            fetchFacilities(selectedRoomId);
        } else {
            setFacilities([]);
        }
    }, [selectedRoomId, rooms]);


    useEffect(() => {
        if (selectedRoomId) {
            const fetchRoomDetails = async (roomId: string) => {
                try {
                    setLoading(true);
                    const response: any = await axiosInstance.get(`/room/${roomId}`, {
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("accessToken")
                        }
                    });
                    const room = response.result;
                    setRoomDetails(room);
                    setPricePerNight(room.price_per_night);
                    setHotelId(room.hotel_id);
                    setNoOfBed(room.numberofBed);
                } catch (exception) {
                    console.error("Failed to load room details:", exception);
                    toast.error("Failed to load room details");
                } finally {
                    setLoading(false);
                }
            };
            fetchRoomDetails(selectedRoomId);
        } else {
            setRoomDetails({});
        }
    }, [selectedRoomId]);

    useEffect(() => {
        if (checkin && checkout) {
            const start = new Date(checkin);
            const end = new Date(checkout);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            const total = days * pricePerNight;
            setValue("total", total.toString());
        }
    }, [checkin, checkout, pricePerNight, setValue]);

    const submitEvent = async (data: { total: any; checkin: { toISOString: () => any; }; checkout: { toISOString: () => any; }; hotel_id: any; room_id: any; noofguests: any; }) => {
        try {
            setLoading(true);
            const formData = {
                total: data.total,
                checkin: data.checkin.toISOString(),
                checkout: data.checkout.toISOString(),
                hotel_id: data.hotel_id,
                room_id: data.room_id,
                noofguests: data.noofguests,
            };

            await axiosInstance.post('/booking', formData, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('accessToken'),
                }
            });

            const updateDate = {
                isBooked: 'booked',
                hotel_id: hotelId,
                price_per_night:pricePerNight,
                numberofBed:noOfBed

            }

            await axiosInstance.put(`/room/${data.room_id}`, updateDate, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('accessToken')
                }
            });

            toast.success("Booking created and room status updated successfully.");
            navigate("/admin/bookings");
        } catch (exception) {
            console.error("Error while creating booking:", exception);
            toast.error("Error while creating booking");
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
                            Create Booking
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
                                <label htmlFor="roomfacility_id" className="block text-sm font-medium text-gray-700">
                                    Facilities
                                </label>
                                <Controller
                                    name="roomfacility_id"
                                    control={control}
                                    render={({ field }) => (
                                        <SelectHotelComponent
                                            options={facilities}
                                            value={field.value}
                                            onChange={field.onChange}
                                            errMsg={errors?.roomfacility_id?.message}
                                            isDisabled={loading}
                                        />
                                    )}
                                />
                            </div>


                            {roomDetails && (
                                <>
                                    <div className="col-span-6">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Room Type
                                        </label>
                                        <p>{roomDetails.type}</p>
                                    </div>
                                    <div className="col-span-6">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Number of Beds
                                        </label>
                                        <p>{roomDetails.numberofBed}</p>
                                    </div>
                                    <div className="col-span-6">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Image
                                        </label>
                                        {roomDetails.image && (
                                            <img
                                                src={roomDetails.image}
                                                alt="Room"
                                                className="rounded-lg object-cover"
                                            />
                                        )}
                                    </div>
                                </>
                            )}

                            <div className="col-span-6">
                                <label htmlFor="noofguests" className="block text-sm font-medium text-gray-700">
                                    Number of Guests
                                </label>
                                <TextInputField
                                    control={control}
                                    name="noofguests"
                                    type='number'
                                    errMsg={errors?.noofguests?.message}
                                    required
                                />
                            </div>
                            <div className="col-span-6">
                                <label htmlFor="checkin" className="block text-sm font-medium text-gray-700">
                                    Check-in Date
                                </label>
                                <Controller
                                    name="checkin"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            selected={field.value}
                                            onChange={field.onChange}
                                            className="input"
                                            dateFormat="yyyy-MM-dd"
                                            placeholderText="Select check-in date"
                                            required
                                        />
                                    )}
                                />
                                {errors.checkin && <p className="text-red-600">{errors.checkin.message}</p>}
                            </div>
                            <div className="col-span-6">
                                <label htmlFor="checkout" className="block text-sm font-medium text-gray-700">
                                    Check-out Date
                                </label>
                                <Controller
                                    name="checkout"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            selected={field.value}
                                            onChange={field.onChange}
                                            className="input"
                                            dateFormat="yyyy-MM-dd"
                                            placeholderText="Select check-out date"
                                            required
                                        />
                                    )}
                                />
                                {errors.checkout && <p className="text-red-600">{errors.checkout.message}</p>}
                            </div>

                            <div className="col-span-6">
                                <label htmlFor="total" className="block text-sm font-medium text-gray-700">
                                    Total Price
                                </label>
                                <TextInputField
                                    control={control}
                                    name="total"
                                    type="number"
                                    errMsg={errors?.total?.message}
                                    required
                                // readOnly
                                />
                            </div>

                            <div className="col-span-6">
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                    disabled={loading}
                                >
                                    Create Booking
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminBookingCreate;
