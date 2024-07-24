import { ReactNode } from "react";
import "./landing.page.css"
import HomeBannerComponent from "../../components/banner/home-banner.component";

const LandingPage = (): ReactNode => {
    return (
        <>
            <HomeBannerComponent />
            <h1>Hello Guys</h1>
        </>
    )
}

export default LandingPage;