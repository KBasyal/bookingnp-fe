// import { useEffect, useState } from "react";
// import axiosInstance from "../../config/axios.config";
// import { toast } from "react-toastify";
// import { NavLink } from "react-router-dom";
// import TableActionButtons from "../../components/common/table/action-buttons.component";

// interface AboutSection {
//     title: string;
//     content: string;
//     image?: string;
// }

// const AdminAbout = () => {
//     const [data, setData] = useState<AboutSection[]>([]);
//     const [loading, setLoading] = useState(true);

//     const getAbout = async () => {
//         try {
//             const response: any = await axiosInstance.get('/about', {
//                 headers: {
//                     Authorization: "Bearer " + localStorage.getItem("accessToken")
//                 }
//             });
//             setData(response.result);
//         } catch (exception) {
//             toast.error("Unable to fetch the about us");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         getAbout();
//     }, []);

//     const deleteAbout = async (id: string) => {
//         try {
//             setLoading(true);
//             await axiosInstance.delete('/about/' + id, {
//                 headers: {
//                     Authorization: "Bearer " + localStorage.getItem("accessToken")
//                 }
//             });
//             toast.success("About Deleted Successfully");
//         } catch (exception) {
//             toast.error("About cannot be deleted at this moment");
//             console.error(exception);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) {
//         return <div className="text-center text-xl">Loading...</div>;
//     }

//     return (
//         <div className="max-w-4xl mx-auto p-4">
//             <div className="flex justify-between items-center mb-6">
//                 <h1 className="text-3xl font-bold">About Us</h1>
//                 <NavLink className="bg-green-800 text-center py-2 px-4 text-white rounded" to="/admin/about/create">
//                     Create About
//                 </NavLink>
//             </div>
//             {data.map((section, index) => (
//                 <>
//                     <div key={index} className="mb-8 border-b pb-4">
//                         <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
//                         <p className="mb-4">{section.content}</p>
//                         {section.image && <img src={section.image} alt={section.title} className="w-full h-auto" />}
//                     </div>
//                     <TableActionButtons
//                         editUrl={"" + section._id}
//                         rowId={section._id as string}
//                         deleteAction={deleteAbout}
//                     />
//                 </>

//             ))}

//         </div>
//     );
// };

// export default AdminAbout;

import { useEffect, useState } from "react";
import axiosInstance from "../../config/axios.config";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import TableActionButtons from "../../components/common/table/action-buttons.component";

interface AboutSection {
    _id: string; // Add this line
    title: string;
    content: string;
    image?: string;
}

const AdminAbout = () => {
    const [data, setData] = useState<AboutSection[]>([]);
    const [loading, setLoading] = useState(true);

    const getAbout = async () => {
        try {
            const response: any = await axiosInstance.get('/about', {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("accessToken")
                }
            });
            setData(response.result);
        } catch (exception) {
            toast.error("Unable to fetch the about us");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAbout();
    }, []);

    const deleteAbout = async (id: string) => {
        try {
            setLoading(true);
            await axiosInstance.delete('/about/' + id, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("accessToken")
                }
            });
            toast.success("About Deleted Successfully");
        } catch (exception) {
            toast.error("About cannot be deleted at this moment");
            console.error(exception);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center text-xl">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">About Us</h1>
                <NavLink className="bg-green-800 text-center py-2 px-4 text-white rounded" to="/admin/about/create">
                    Create About
                </NavLink>
            </div>
            {data.map((section, index) => (
                <div key={index} className="mb-8 border-b pb-4">
                    <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
                    <p className="mb-4">{section.content}</p>
                    {section.image && <img src={section.image} alt={section.title} className="w-full h-auto" />}
                    <TableActionButtons
                        editUrl={`/admin/about/${section._id}`}
                        rowId={section._id}
                        deleteAction={deleteAbout}
                    />
                </div>
            ))}
        </div>
    );
};

export default AdminAbout;

