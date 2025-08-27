import { useDeviceType } from "../../hooks/useResponsiveType";
import Homepage from "../../pages/public/HomePage";
import HomeMobileView from "./HomeMobileView";


const ResponsiveHome = () => {
     const deviceType = useDeviceType();
     console.log(400,deviceType)
  return (
    <div>{deviceType==="mobile"&&<HomeMobileView/>}
    {deviceType==="tablet"&&<Homepage/>}
    {deviceType==="desktop"&&<Homepage/>}</div>
  )
}

export default ResponsiveHome