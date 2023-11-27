import React from "react";
import LogoImage from "@/assets/logo.png";

interface CustomIconProps {
    width?: string; //default 230.326mm
    height?: string; //default 62.9674mm
}
const Logo: React.FC<CustomIconProps> = ({ width, height }) => {
    return <img src={LogoImage.src} alt="logo" width={width} height={height} />;

};

export default Logo;
