import { useForm } from "react-hook-form";
import { TextInputField, SelectOptionComponent } from "../../components/common/form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axiosInstance from "../../config/axios.config";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { LoadingComponent } from "../../components/common";


const AdminBannerEdit = () => {
    let [loading, setLoading] = useState(true);

    const params = useParams()
    // const dispatch = useDispatch()
    const [detail, setDetail] = useState({} as any)



    const editDTO = Yup.object({
        title: Yup.string().min(3).required(),
        link: Yup.string().url().required(),
        status: Yup.object({
            label: Yup.string().matches(/^(Publish|Unpublish)$/),
            value: Yup.string().matches(/^(active|inactive)$/)
        }).required(),
        image: Yup.mixed().optional()
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
                status: data.status.value
            };
            await axiosInstance.put('/banner/'+params.id, mappedData, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('accessToken'),
                    "Content-Type": "multipart/form-data"
                }
            });
            toast.success("Banner updated successfully.");
            navigate("/admin/banner");
        } catch (exception) {
            console.log(exception);
            toast.error("Error while creating banner");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: any) => {
        const uploaded = e.target.files[0];
        setValue('image', uploaded);
    };
    const getBannerById =async() =>{
        try{
            const response :any = await axiosInstance.get("/banner/"+params.id,{
                headers:{
                    "Authorization": "Bearer " + localStorage.getItem('accessToken')

                }

            })
            setValue("title", response.result.title)
            setValue("link", response.result.link)
            setValue("status",{
                label:response.result.status === 'active' ? 'Publish':'Unpublish',
                value:response.result.status
            })

            setDetail(response.result as any)

        }catch(exception){
            toast.error("Banner fetch error");
            navigate("/admin/banner")

        }finally{
            setLoading(false)
        }

    }

    useEffect(() => {

        // const id = params.id
        // if(!id){
        //     toast.error("Banner Id is required")
        // }else{
        //     // dispatch(getBannerDetail(id))
        //     // setLoading(false)

        // }
        getBannerById()

    }, [params])
    // const detail = useSelector((root: any)=>{
    //     return root.banner.bannerDetail

    // })

    return (
        <>
            <section>
                <div className="mx-auto max-w-screen-xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-16">
                        <div className="col-span-full lg:col-span-1">
                            <h1 className="text-4xl font-bold text-center lg:text-left">
                                Banner Edit
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
                                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                            
                                            </label>
                                            <TextInputField
                                                control={control}
                                                name="title"
                                                errMsg={errors?.title?.message as string}
                                                required={true}
                                            />
                                        </div>

                                        <div className="col-span-6">
                                            <label htmlFor="link" className="block text-sm font-medium text-gray-700"> </label>
                                            <TextInputField
                                                control={control}
                                                name="link"
                                                type="url"
                                                errMsg={errors?.link?.message as string}
                                                required={true}
                                            />
                                        </div>

                                        <div className="col-span-6 ">
                                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                                
                                            </label>
                                            <SelectOptionComponent
                                                options={[{ label: "Publish", value: "active" }, { label: "Unpublish", value: "inactive" }]}
                                                name="status"
                                                control={control}
                                                errMsg={errors?.status?.message as string}
                                            />
                                        </div>

                                        <div className="col-span-6 ">
                                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                                Image
                                            </label>
                                            <input
                                                className="w-[75%]"
                                                id="file_input"
                                                type="file"
                                                onChange={handleFileChange}
                                            />
                                            <div className="block w-[25%">
                                                <img src={import.meta.env.VITE_IMAGE_URL +"/uploads/banners/"+detail?.image} crossOrigin="anonymous"></img>

                                            </div>
                                            <span className="text-red-500">{errors?.image?.message}</span>
                                        </div>

                                        <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                                            <button
                                                className="inline-block shrink-0 rounded-md border border-green-700 bg-green-700 px-6 py-2 text-sm font-medium text-white transition hover:bg-transparent hover:text-green-500 focus:outline-none focus:ring active:text-green-600"
                                                disabled={loading}
                                            >
                                                Save Banner
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

export default AdminBannerEdit;
