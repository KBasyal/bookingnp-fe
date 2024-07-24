import { ReactNode } from "react";
import "./landing.page.css"
import HomeBannerComponent from "../../components/banner/home-banner.component";

const LandingPage = (): ReactNode => {
    return (
        <>
            <HomeBannerComponent />
        </>
    )
}

export default LandingPage;