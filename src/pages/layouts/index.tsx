import {Outlet} from "react-router-dom"


import {HeaderComponent, FooterComponent} from "../../components/common"
const HomeLayout = ()=>{
    return(
        <>
        <HeaderComponent />
            <Outlet />
        <FooterComponent/>
        </>
    )
}
export default HomeLayout;