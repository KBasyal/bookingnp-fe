import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../../config/axios.config";

const HotelComponent = () => {
    const [data, setData] = useState([] as any[]);

    const getHotelForHomePage = async () => {
        try {
            const response: any = await axiosInstance.get("/hotel/home-list");
            setData(response.result);
        } catch (exception) {
            console.error(exception);
        }
    };

    useEffect(() => {
        getHotelForHomePage();
    }, []);

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Hotels</h2>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {data.map((hotel: any) => (
                        <div key={hotel._id} className="group block overflow-hidden rounded-lg shadow-lg">
                            <div className="relative w-full h-64 sm:h-72">
                                <img
                                    src={`${import.meta.env.VITE_IMAGE_URL}/hotels/${hotel.image}`}
                                    crossOrigin="anonymous"
                                    alt={hotel.name}
                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="relative p-6 bg-white border-t border-gray-200">
                                <h3 className="mt-4 text-lg font-medium text-gray-900">{hotel.name}</h3>
                                <p className="mt-1.5 text-sm text-gray-700">{hotel.description}</p>
                                <Link to={`/room/home-list/${hotel._id}`}>
                                    <button className="mt-4 block w-full rounded bg-yellow-400 py-2 text-sm font-medium transition-transform hover:scale-105">
                                        View Details
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HotelComponent;
