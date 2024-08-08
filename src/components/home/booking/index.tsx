import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import axiosInstance from '../../../config/axios.config';
import { useNavigate, useParams } from 'react-router-dom';
import SelectHotelComponent from '../../../pages/hotel/hotel-select.component';
import { TextInputField } from '../../common/form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface RoomDetails {
    type: string;
    numberofBed: string;
    image: string;
}

const createDTO = Yup.object().shape({
    hotel_id: Yup.string().required('Hotel is required'),
    room_id: Yup.string().required('Room is required'),
    checkin: Yup.date().required('Check-in date is required').nullable(),
    checkout: Yup.date().required('Check-out date is required').nullable(),
    noofguests: Yup.string().required('Number of guests is required'),
    total: Yup.string().required('Total price is required')
});

const HomeHotelBooking = () => {
    const { hotel_id, room_id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [hotels, setHotels] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);
    const [pricePerNight, setPricePerNight] = useState(0);
    const [hotelName, setHotelName] = useState('');
    const [noOfBed, setNoOfBed] = useState('');

    const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm({
        resolver: yupResolver(createDTO),
        defaultValues: {
            hotel_id: hotel_id || '',
            room_id: room_id || '',
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
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                    }
                });
                const hotelsData = response.result;
                const hotelOptions = hotelsData.map((hotel: { name: any; _id: any; }) => ({
                    label: hotel.name,
                    value: hotel._id
                }));
                setHotels(hotelOptions);

                // Set the hotel name based on the hotel_id from URL
                const currentHotel = hotelsData.find((hotel: { _id: string | undefined; }) => hotel._id === hotel_id);
                if (currentHotel) {
                    setHotelName(currentHotel.name);
                }
            } catch (exception) {
                console.error("Failed to load hotels", exception);
                toast.error("Failed to load hotels");
            } finally {
                setLoading(false);
            }
        };
        fetchHotels();
    }, [hotel_id]);

    useEffect(() => {
        if (selectedHotelId) {
            const fetchRooms = async (hotel_id: any) => {
                try {
                    setLoading(true);
                    const response: any = await axiosInstance.get('/room', {
                        params: { hotel_id: hotel_id },
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                        }
                    });
                    const roomsData = response.result;
                    const roomOptions = roomsData.map((room: any) => ({
                        label: room._id,
                        value: room._id,
                        pricePerNight: room.price_per_night,
                        image: room.image,
                        facility_id: room.facility_id
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
            const fetchRoomDetails = async (roomId: string) => {
                try {
                    setLoading(true);
                    const response: any = await axiosInstance.get(`/room/${roomId}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                        }
                    });
                    const room = response.result;
                    setRoomDetails(room);
                    console.log("the roomdettail is", room)
                    setPricePerNight(room.price_per_night);
                    // setHotelId(room.hotel_id);
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
            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            const total = days * Number(pricePerNight);
            setValue("total", total.toString());
        }
    }, [checkin, checkout, pricePerNight, setValue]);



    const submitEvent = async (data: {
        total: string;
        checkin: Date;
        checkout: Date;
        hotel_id: string;
        room_id: string;
        noofguests: string;
    }) => {
        try {
            setLoading(true);
            const formData = {
                total: data.total,
                checkin: data.checkin.toISOString(),
                checkout: data.checkout.toISOString(),
                hotel_id: data.hotel_id,
                room_id: data.room_id,
                noofguests: data.noofguests
            };

            await axiosInstance.post('/booking', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            const updateDate = {
                isBooked: 'booked',
                hotel_id: hotel_id,
                price_per_night: pricePerNight,
                numberofBed: noOfBed
            };

            await axiosInstance.put(`/room/${data.room_id}`, updateDate, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            toast.success("Booking created and room status updated successfully.");
            navigate("/admin/booking");
        } catch (exception) {
            console.error("Error while creating booking:", exception);
            toast.error("Error while creating booking");
        } finally {
            setLoading(false);
        }
    };
    console.log("the room details are:", roomDetails)

    return (
        <section className="bg-gray-50 min-h-screen py-10">
            <div className="container mx-auto max-w-4xl p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-3xl font-bold text-center mb-8">Create Booking</h1>
                <form onSubmit={handleSubmit(submitEvent)} className="space-y-6">
                    <div className="flex flex-col gap-4">
                        <div>
                            <label htmlFor="hotel_id" className="block text-sm font-medium text-gray-700">Hotel</label>
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
                                        className="mt-1 block w-full"
                                    />
                                )}
                            />
                        </div>
                        <div>
                            <label htmlFor="room_id" className="block text-sm font-medium text-gray-700">Room</label>
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
                                        className="mt-1 block w-full"
                                    />
                                )}
                            />
                        </div>
                        <div>
                            <label htmlFor="noofguests" className="block text-sm font-medium text-gray-700">Number of Guests</label>
                            <TextInputField
                                control={control}
                                name="noofguests"
                                type='number'
                                errMsg={errors?.noofguests?.message}
                                required
                                className="mt-1 block w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="checkin" className="block text-sm font-medium text-gray-700">Check-in Date</label>
                            <Controller
                                name="checkin"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        selected={field.value}
                                        onChange={field.onChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        dateFormat="yyyy-MM-dd"
                                        placeholderText="Select check-in date"
                                        required
                                    />
                                )}
                            />
                            {errors.checkin && <p className="text-red-600 text-sm mt-1">{errors.checkin.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="checkout" className="block text-sm font-medium text-gray-700">Check-out Date</label>
                            <Controller
                                name="checkout"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        selected={field.value}
                                        onChange={field.onChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        dateFormat="yyyy-MM-dd"
                                        placeholderText="Select check-out date"
                                        required
                                    />
                                )}
                            />
                            {errors.checkout && <p className="text-red-600 text-sm mt-1">{errors.checkout.message}</p>}
                        </div>
                        {roomDetails && (
                            <div className="bg-gray-100 p-4 rounded-lg">
                                <h2 className="text-lg font-semibold mb-2">Room Details</h2>
                                <div className="space-y-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Room Type</label>
                                        <p>{roomDetails.type}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Number of Beds</label>
                                        <p>{roomDetails.numberofBed}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Image</label>
                                        {roomDetails.image && (
                                            <img
                                                src={`${import.meta.env.VITE_IMAGE_URL}/rooms/${roomDetails.image}`}
                                                alt="Room"
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div>
                            <label htmlFor="total" className="block text-sm font-medium text-gray-700">Total Price</label>
                            <TextInputField
                                control={control}
                                name="total"
                                type="number"
                                errMsg={errors?.total?.message}
                                required
                                className="mt-1 block w-full"
                                disabled
                            />
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        >
                            {loading ? 'Creating Booking...' : 'Create Booking'}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default HomeHotelBooking;