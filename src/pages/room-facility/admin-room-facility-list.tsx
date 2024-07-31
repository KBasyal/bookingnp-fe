import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../config/axios.config";
import TableActionButtons from "../../components/common/table/action-buttons.component";
import { LoadingComponent } from "../../components/common";
import PaginationComponent from "../../components/common/table/pagination.component";

const PER_PAGE_LIMIT = 15;

const AdminRoomFacility = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        totalPages: 1,
        currentPage: 1
    });
    const getHotelFacilityList = async ({ page = 1, limit = PER_PAGE_LIMIT }) => {
        try {
            setLoading(true);
            const response: any = await axiosInstance.get('/room-facility', {
                params: {
                    page: page,
                    limit: limit
                },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("accessToken")
                }
            });

            const facilities:any = await Promise.all(response.result.map(async (item: any) => {

                const [facilityRes]:any = await Promise.all([
                    axiosInstance.get(`/facility/${item.facility_id}`, {
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("accessToken")
                        }
                    }),

                ]);
                return {
                    ...item,
                    facilityName: facilityRes.result.name,
                };
            }));

            setPagination({
                totalPages: Math.ceil(response.meta.total / response.meta.limit),
                currentPage: response.meta.page
            });
            setData(facilities);
        } catch (error) {
            toast.error("Unable to fetch the hotel facility list.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getHotelFacilityList({ page: 1, limit: PER_PAGE_LIMIT });
    }, []);


    const deleteHotelFacility = async (id: string) => {
        try {
            setLoading(true);
            await axiosInstance.delete('/room-facility/' + id, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("accessToken")
                }
            });
            toast.success("Hotel Facility Deleted Successfully");
            getHotelFacilityList({ page: pagination.currentPage, limit: PER_PAGE_LIMIT });
        } catch (exception) {
            toast.error("Hotel Facility cannot be deleted at this moment");
            console.error(exception);
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
                            Room Facility List
                        </h1>
                    </div>
                    <div></div>
                    <div className="col-span-full lg:col-span-1 flex justify-center lg:justify-end">
                        <NavLink className="bg-green-800 mt-3 text-center py-2 px-2 text-white rounded w-[200px]" to="/admin/room-facility/create">
                            Create Room Facility
                        </NavLink>
                    </div>
                </div>
                <div className="rounded-lg border border-gray-200 mt-8">
                    <div className="overflow-x-auto rounded-t-lg">
                        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                            <thead className="ltr:text-left rtl:text-right bg-black">
                                <tr>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-white">
                                        Facility Name
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-white">
                                        Room ID
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-white">
                                        Included
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-white">
                                        Price Impact
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-white"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5}>
                                            <LoadingComponent />
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((hotelfacility: any, index: number) => (
                                        <tr className="odd:bg-gray-50" key={index}>
                                            <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{hotelfacility.facilityName}</td>
                                            <td className="whitespace-nowrap px-4 py-2 font-medium">{hotelfacility.room_id}</td>
                                            <td className="whitespace-nowrap px-4 py-2 font-medium">{hotelfacility.isincluded}</td>
                                            <td className="whitespace-nowrap px-4 py-2 font-medium">{hotelfacility.priceImpact}</td>
                                            <td className="whitespace-nowrap px-4 py-2 font-medium">
                                                <TableActionButtons
                                                    editUrl={"" + hotelfacility._id}
                                                    rowId={hotelfacility._id as string}
                                                    deleteAction={deleteHotelFacility}
                                                />
                                            </td>
                                        </tr>
                                    ))

                                )}
                            </tbody>
                        </table>
                    </div>
                    {!loading && (
                        <PaginationComponent
                            fetchCall={getHotelFacilityList}
                            pagination={pagination}
                        />
                    )}
                </div>


            </div>
        </section>
    );
};

export default AdminRoomFacility;
