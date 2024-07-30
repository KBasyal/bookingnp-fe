import { useForm } from "react-hook-form";
import { TextInputField } from "../../components/common/form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axiosInstance from "../../config/axios.config";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { LoadingComponent } from "../../components/common";


const AdminFacilityEdit = () => {
    let [loading, setLoading] = useState(true);

    const params = useParams()
    // const dispatch = useDispatch()
    const [detail, setDetail] = useState({} as any)
    
    const editDTO = Yup.object({
        name: Yup.string().min(3).required(),
        description: Yup.string().min(10).required(),
        adonprice: Yup.number().min(0).optional()
    });

    const { control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(editDTO)
    });

    const navigate = useNavigate();

    const submitEvent = async (data: any) => {
        try {
            setLoading(true);
            const mappedData = {
                ...data,
            };
            await axiosInstance.put('/facility/'+params.id, mappedData, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('accessToken'),
                    "Content-Type": "multipart/form-data"
                }
            });
            toast.success("Facility updated successfully.");
            navigate("/admin/facility");
        } catch (exception) {
            console.log(exception);
            toast.error("Error while creating facility");
        } finally {
            setLoading(false);
        }
    };

    // const handleFileChange = (e: any) => {
    //     const uploaded = e.target.files[0];
    //     setValue('image', uploaded);
    // };
    const getFacilityById =async() =>{
        try{
            const response :any = await axiosInstance.get("/facility/"+params.id,{
                headers:{
                    "Authorization": "Bearer " + localStorage.getItem('accessToken')

                }

            })
            console.log("response is", response)
            setValue("name", response.result.name)
            setValue("description", response.result.description)
            setValue("adonprice",response.result.adonprice)

            setDetail(response.result as any)

        }catch(exception){
            toast.error("Facility fetch error");
            navigate("/admin/facility")

        }finally{
            setLoading(false)
        }

    }

    useEffect(() => {

        // const id = params.id
        // if(!id){
        //     toast.error("Facility Id is required")
        // }else{
        //     // dispatch(getFacilityDetail(id))
        //     // setLoading(false)

        // }
        getFacilityById()

    }, [params])
    // const detail = useSelector((root: any)=>{
    //     return root.facility.facilityDetail

    // })

    return (
        <>
            <section>
                <div className="mx-auto max-w-screen-xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-16">
                        <div className="col-span-full lg:col-span-1">
                            <h1 className="text-4xl font-bold text-center lg:text-left">
                                Facility Edit
                            </h1>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 mt-8">
                        <div className="overflow-x-auto rounded-t-lg">
                            {
                                loading ? <>
                                    <LoadingComponent />
                                </> : <>
                                    <form onSubmit={handleSubmit(submitEvent)} className="grid grid-cols-6 gap-6">
                                        <div className="col-span-6 ">
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            
                                            </label>
                                            <TextInputField
                                                control={control}
                                                name="name"
                                                errMsg={errors?.name?.message as string}
                                                required={true}
                                            />
                                        </div>

                                        <div className="col-span-6">
                                            <label htmlFor="link" className="block text-sm font-medium text-gray-700"> </label>
                                            <TextInputField
                                                control={control}
                                                name="description"
                                                type="string"
                                                errMsg={errors?.description?.message as string}
                                                required={true}
                                            />
                                        </div>
                                        <div className="col-span-6">
                                            <label htmlFor="adonprice" className="block text-sm font-medium text-gray-700"> </label>
                                            <TextInputField
                                                control={control}
                                                name="adonprice"
                                                type="number"
                                                errMsg={errors?.adonprice?.message as string}
                                                required={true}
                                            />
                                        </div>
                                        <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                                            <button
                                                className="inline-block shrink-0 rounded-md border border-green-700 bg-green-700 px-6 py-2 text-sm font-medium text-white transition hover:bg-transparent hover:text-green-500 focus:outline-none focus:ring active:text-green-600"
                                                disabled={loading}
                                            >
                                                Save Facility
                                            </button>
                                        </div>
                                    </form>
                                </>
                            }

                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AdminFacilityEdit;
