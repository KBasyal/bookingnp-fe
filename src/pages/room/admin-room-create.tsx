import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axiosInstance from '../../config/axios.config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { SelectOptionComponent, TextInputField } from '../../components/common/form';
import SelectRoomComponent from '../hotel/hotel-select.component';
import SelectHotelComponent from '../hotel/hotel-select.component';



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



const createDTO = Yup.object().shape({
    type: Yup.string()
        .oneOf(roomTypeOptions.map(option => option.value), 'Invalid room type')
        .required('Room type is required'),
    price_per_night: Yup.string()
        .min(1, 'Price per night must be at least 100')
        .required('Price per night is required'),
    numberofBed: Yup.string()
        .min(1, 'Number of beds must be at least 1')
        .required('Number of beds is required'),
    image: Yup.mixed().required('Image is required'),
    isBooked: Yup.object({
        label: Yup.string().matches(/^(Open|Booked)$/),
        value: Yup.string().matches(/^(open|booked)$/)
    }).required(),
    hotel_id: Yup.string().required('Hotel is required'),
});

const AdminRoomCreate = () => {
    const [loading, setLoading] = useState(false);
    const [hotels, setHotels] = useState([]);
    const navigate = useNavigate();
    const { control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(createDTO),
        defaultValues: {
            type: "",
            hotel_id: ""
        }
    });

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('/hotel', {
                    params: { page: 1, limit: 100 }, // Adjust limit as needed
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("accessToken")
                    }
                });
    
                const hotelsData = response.result; // No data field, accessing result directly
                console.log("Hotels data:", hotelsData);
    
                const hotelOptions = hotelsData.map((hotel:any) => ({
                    label: hotel.name,
                    value: hotel._id
                }));
                console.log("Hotel options:", hotelOptions);
    
                setHotels(hotelOptions);
                console.log("Hotels set in state:", hotelOptions);
            } catch (exception) {
                console.log("Exception is:", exception);
                toast.error("Failed to load hotels");
            } finally {
                setLoading(false);
            }
        };
    
        fetchHotels(); 
    }, []);
    
    const submitEvent = async (data: any) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('type', data.type);
            formData.append('price_per_night', data.price_per_night);
            formData.append('numberofBed', data.numberofBed);
            formData.append('isBooked', data.isBooked.value);
            formData.append('hotel_id', data.hotel_id);
            formData.append('image', data.image);

            await axiosInstance.post('/room/', formData, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('accessToken'),
                    "Content-Type": "multipart/form-data"
                }
            });
            toast.success("Room created successfully.");
            navigate("/admin/room");
        } catch (exception) {
            console.log(exception);
            toast.error("Error while creating room");
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
                            Room Create
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
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                                    Room Type
                                </label>
                                <Controller
                                    name="type"
                                    control={control}
                                    render={({ field }) => (
                                        <SelectRoomComponent
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
                                    Price Per Night
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
                                    Number of Beds
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
                                    Status
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
                                <span className="text-red-500">{errors?.image?.message}</span>
                            </div>
                            <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                                <button
                                    type="submit"
                                    className="inline-block shrink-0 rounded-md border border-green-700 bg-green-700 px-6 py-2 text-sm font-medium text-white transition hover:bg-transparent hover:text-green-500 focus:outline-none focus:ring active:text-green-600"
                                    disabled={loading}
                                >
                                    Create Room
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminRoomCreate;
