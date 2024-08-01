import { useEffect, useState } from "react";

import axiosInstance from "../../../config/axios.config";
import { NavLink, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom"

const RoomComponent = () => {
    const { id } = useParams();
    console.log("The selected hotel id is:", id)
    const [data, setData] = useState([] as any[]);

    // const [rooms, setRooms] = useState([] as any[]);

    const getRoomsForHotel = async () => {
        try {

            const response: any = await axiosInstance.get('/room/home-list', {
                params: { hotel_id: id }, 
            });
            console.log("API Response:", response);
            setData(response.result);
        } catch (exception) {
            console.error("Error fetching rooms:", exception);
        }
    };
    
    useEffect(() => {
        getRoomsForHotel();
    }, [id]);

    const isAuthenticated = () => {
        // Check if the user is authenticated (e.g., by checking for a token)
        return !!localStorage.getItem("authToken");
    };

    const handleBookNowClick = () => {
        if (isAuthenticated()) {
            // Proceed with the booking process
            console.log("User is authenticated. Proceed with booking.");
        } else {
            // Redirect to login page
            // navigate("/login");
            <NavLink
            to={"/login"}
            />
        }
    };

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Rooms for Hotel</h2>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {data.map((room: any) => (
                        <div key={room.id} className="group block overflow-hidden rounded-lg shadow-lg">
                            <div className="relative w-full h-64 sm:h-72">
                                <img
                                    src={`${import.meta.env.VITE_IMAGE_URL}/rooms/${room.image}`}
                                    crossOrigin="anonymous"
                                    alt={room.name}
                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="relative p-6 bg-white border-t border-gray-200">
                                <h3 className="mt-4 text-lg font-medium text-gray-900">{room._id}</h3>
                                <p className="mt-1.5 text-sm text-gray-700">{room.type}</p>
                                <p className="mt-1.5 text-sm text-gray-700"> Base Price: {room.price_per_night}</p>
                                <button
                                    className="mt-4 block w-full rounded bg-yellow-400 py-2 text-sm font-medium transition-transform hover:scale-105"
                                    onClick={handleBookNowClick}
                                >
                                    Book Now
                                </button>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default RoomComponent;
