import axiosInstance from "../../config/axios.config";
import { useState, useEffect } from 'react';
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [totalHotels, setTotalHotels] = useState([]);
  const [totalRooms, setTotalRooms] = useState([]);
  const [totalBookings, setTotalBookings] = useState([]);

  useEffect(() => {
    const fetchHotelCounts = async () => {
      try {
        setLoading(true);
        const hotelsResponse:any = await axiosInstance.get('/hotel', {
          params: { page: 1, limit: 1 },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken")
          }
        });
        setTotalHotels(hotelsResponse.meta.total);

      } catch (exception) {
        console.error("Failed to load data", exception);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchHotelCounts();
  }, []);

  useEffect(() =>{
    const fetchRoomCounts = async () =>{
      try{
        // console.log("I am here watching you")
        const roomResponse:any = await axiosInstance.get('/room', {
          params: { page: 1, limit: 1 },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken")
          }
        })
        console.log("the user response is :", roomResponse)
        setTotalRooms(roomResponse.meta.total);

      }catch(exception){
        console.log("the exception is :", exception)
      }finally{
        setLoading(false)
      }

    }
    fetchRoomCounts();
  },[])

  useEffect(() =>{
    const fetchBookingCounts = async () =>{
      try{
        
        const bookingsResponse:any = await axiosInstance.get('/booking', {
          params: { page: 1, limit: 1 },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken")
          }
        });
        setTotalBookings(bookingsResponse.meta.total);

      }catch(exception){
        console.log("the exception is :", exception)
      }finally{
        setLoading(false)
      }

    }
    fetchBookingCounts();
  },[])
  


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <svg className="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a9.93 9.93 0 00-7.07 2.93A9.93 9.93 0 002 12c0 2.71 1.09 5.15 2.93 7.07A9.93 9.93 0 0012 22a9.93 9.93 0 007.07-2.93A9.93 9.93 0 0022 12c0-2.71-1.09-5.15-2.93-7.07A9.93 9.93 0 0012 2zm0 18c-2.76 0-5.26-1.12-7.07-2.93A9.93 9.93 0 014 12c0-2.76 1.12-5.26 2.93-7.07A9.93 9.93 0 0112 4c2.76 0 5.26 1.12 7.07 2.93A9.93 9.93 0 0120 12c0 2.76-1.12 5.26-2.93 7.07A9.93 9.93 0 0112 20z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Rooms</p>
              <p className="text-xl font-semibold text-gray-900">{totalRooms}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 4V2H3v20h4v-2h2v-4H7v-4h2V8H7V4zm6 4h2v4h-2v4h2v4h-2v2h4V2h-4v2h2v4h-2v4zM5 8h2v4H5V8zm0 6h2v4H5v-4zm14-6v12h-2V8h2zm-2-2V4h-2v2h2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Hotels</p>
              <p className="text-xl font-semibold text-gray-900">{totalHotels}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <svg className="h-6 w-6 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 2.997a2 2 0 00-2-2H5a2 2 0 00-2 2V21l7.5-4.5L17 21V2.997z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Bookings</p>
              <p className="text-xl font-semibold text-gray-900">{totalBookings}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-sm font-medium text-gray-500">12.04.2022 - 12.05.2022</p>
            </div>
            <div>
              <button className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md">
                Day
              </button>
              <button className="px-4 py-2 text-sm font-medium rounded-md ml-2">
                Week
              </button>
              <button className="px-4 py-2 text-sm font-medium rounded-md ml-2">
                Month
              </button>
            </div>
          </div>
          <div className="h-48 bg-gray-100 rounded-lg"> {/* Replace this with your chart component */} </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-medium text-gray-500">Profit this week</p>
            <button className="px-4 py-2 bg-gray-100 text-sm font-medium rounded-md">
              This Week
            </button>
          </div>
          <div className="h-48 bg-gray-100 rounded-lg"> {/* Replace this with your chart component */} </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
