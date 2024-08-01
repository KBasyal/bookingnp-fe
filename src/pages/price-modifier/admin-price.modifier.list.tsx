import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../config/axios.config";
import TableActionButtons from "../../components/common/table/action-buttons.component";
import { LoadingComponent } from "../../components/common";

const PER_PAGE_LIMIT = 15;

const AdminPriceModifier = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        totalPages: 1,
        currentPage: 1
    });
    const getHotelFacilityList = async ({ page = 1, limit = PER_PAGE_LIMIT }) => {
        try {
            setLoading(true);
            const response: any = await axiosInstance.get('/price-modifier', {
                params: {
                    page: page,
                    limit: limit
                },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("accessToken")
                }
            });

            console.log("the response is:", response)
            const details: any = await Promise.all(response.result.map(async (item: any) => {

                const [roomRes, hotelRes]:any = await Promise.all([
                    axiosInstance.get(`/room/${item.room_id}`, {
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("accessToken")
                        }
                    }),
                    axiosInstance.get(`/hotel/${item.hotel_id}`, {
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("accessToken")
                        }
                    })
                ]);
                return {
                    ...item,
                    room_id: roomRes.result._id,
                    hotelName: hotelRes.result.name
                };
            }));
            setPagination({
                totalPages: Math.ceil(response.meta.total / response.meta.limit),
                currentPage: response.meta.page
            });
            setData(details);
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


    const 
    deletePriceModifier = async (id: string) => {
        try {
            setLoading(true);
            await axiosInstance.delete('/price-modifier/' + id, {
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
                            Price Modifier List
                        </h1>
                    </div>
                    <div></div>
                    <div className="col-span-full lg:col-span-1 flex justify-center lg:justify-end">
                        <NavLink className="bg-green-800 mt-3 text-center py-2 px-2 text-white rounded w-[200px]" to="/admin/price-modifier/create">
                            Create Price Modifier
                        </NavLink>
                    </div>
                </div>
                <div className="rounded-lg border border-gray-200 mt-8">
                    <div className="overflow-x-auto rounded-t-lg">
                        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                            <thead className="ltr:text-left rtl:text-right bg-black">
                                <tr>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-white">
                                        Hotel Name
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-white">
                                        Room ID
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-white">
                                        Type
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-white">
                                        Valid From
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-white">
                                        Valid To
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-white">
                                        Discount
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
                                    data.map((pricemodifier: any, index: number) => (
                                        <tr className="odd:bg-gray-50" key={index}>
                                            <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{pricemodifier.hotelName}</td>
                                            <td className="whitespace-nowrap px-4 py-2 font-medium">{pricemodifier.room_id}</td>
                                            <td className="whitespace-nowrap px-4 py-2 font-medium">{pricemodifier.type}</td>
                                            <td className="whitespace-nowrap px-4 py-2 font-medium">{pricemodifier.applicableFrom}</td>
                                            <td className="whitespace-nowrap px-4 py-2 font-medium">{pricemodifier.applicableTo}</td>
                                            <td className="whitespace-nowrap px-4 py-2 font-medium">{pricemodifier.priceImpact}</td>
                                            <td className="whitespace-nowrap px-4 py-2 font-medium">{pricemodifier.percentage}</td>

                                            <td className="whitespace-nowrap px-4 py-2 font-medium">
                                                <TableActionButtons
                                                    editUrl={"" + pricemodifier._id}
                                                    rowId={pricemodifier._id as string}
                                                    deleteAction={
                                                        deletePriceModifier
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ))

                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* {!loading && (
                        <PaginationComponent
                            fetchCall={getHotelFacilityList}
                            pagination={pagination}
                        />
                    )} */}
                </div>


            </div>
        </section>
    );
};

export default AdminPriceModifier;
