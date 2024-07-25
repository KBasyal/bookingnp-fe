import { NavLink } from "react-router-dom"
import reactLogo from "../../../assets/react.svg"
 export const ImageComponent = ({ classes = "h-8 w-auto", url = reactLogo, alt = "" }: { classes: string, url: string, alt: string }) => {
    return (
        <>
            <img className={classes} src={url} alt={alt} />
        </>
    )
}
export const LogoComponent = () => {
    return (
        <>
            <div className="flex lg:flex-1">
                <NavLink to="/" className="-m-1.5 p-1.5">
                    <span className="sr-only">Your Company</span>
                    <ImageComponent classes="h-8 w-auto" url={reactLogo} alt="Logo"/>
                </NavLink>
            </div>

        </>
    )
}