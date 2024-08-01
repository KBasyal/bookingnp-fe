import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useEffect, useState } from "react";
import axiosInstance from "../../../config/axios.config";

const HomeBannerComponent = () => {
    const settings = {
        dots: true,
        autoplay: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true
    };

    const [data, setData] = useState([] as any[]);

    const getBannerForHomePage = async () => {
        try {
            const response: any = await axiosInstance.get("/banner/home-list");
            setData(response.result);
        } catch (exception) {
            console.error(exception);
        }
    }

    useEffect(() => {
        getBannerForHomePage();
    }, []); // Empty dependency array to run only once

    return (
        <div className="bg-white mt-2">
            <div className="relative isolate">
                <Slider {...settings}>
                    {data && data.map((banner: any, ind: number) => (
                        <div key={ind}>
                            <a href={banner.link} target="_blank">
                            <img src={import.meta.env.VITE_IMAGE_URL+"/banners/"+banner.image} crossOrigin="anonymous" alt="" />
                            </a>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}

export default HomeBannerComponent;
