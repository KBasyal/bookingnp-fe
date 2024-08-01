import { ReactNode } from "react";
import "./landing.page.css"
import HomeBannerComponent from "../../components/home/banner/home-banner.component";
import HotelComponent from "../../components/home/hotel";

const LandingPage = (): ReactNode => {
    return (
        <>
            <HomeBannerComponent />

            <HotelComponent />

        </>
    )
}

export default LandingPage;