import React from "react";
// import mainlogo from "../res/bg.png";
import Logo from "../images/Logo.png"
import BackgroundImage from "../images/BackgroundImage6.png"
import GoogleButton from "react-google-button";
import { Link } from "react-router-dom";

const Login = () => {
  const googleAuth = () => {
    window.open(`${process.env.REACT_APP_API_URL}/auth/google`, "_self");
  };

  return (
    // <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white">
    //   <div className="flex flex-col md:flex-row">
    //     {/* Login form */}
    //     <div className="w-full md:w-2/5 px-4 py-8 md:py-0 flex flex-col justify-center">
    //       <div className="text-right mb-8 md:mb-12">
    //         <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">Login here</h1>
    //       </div>
    //       <div className="flex flex-col">
    //         <div className="flex justify-end">
    //             <GoogleButton onClick={googleAuth} />
    //         </div>
    //         <div className="mt-8 flex justify-end">
    //           <Link to="/about-us" className="text-white hover:text-gray-300 mr-4">About Us</Link>
    //           <Link to="/Faq" className="text-white hover:text-gray-300 mr-4">FAQ</Link>
    //           <Link to="/help" className="text-white hover:text-gray-300">Help</Link>
    //         </div>
    //       </div>
    //     </div>
        
    //     {/* Image panel */}
    //     <div className="w-0 md:w-3/5 flex items-center justify-center">
    //       <img src={Logo} alt="logo" className="max-w-full h-5/6 object-cover" />
    //     </div>
    //   </div>
    // </div>
    <div className="min-h-screen flex flex-col justify-center items-center bg-cover text-white" style={{ backgroundColor: "#1c1e29" }}>
        <div className="flex justify-center">
                <div className="flex flex-col justify-center">
                    <div className="text-right mb-4 md:mb-6">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">Login here</h1>
                    </div>
                    <div className="flex flex-col items-center">
                        <GoogleButton onClick={googleAuth} />
                        <div className="mt-4 flex md:mt-6">
                            <Link to="/about-us" className="text-white hover:text-gray-300 mr-4">About Us</Link>
                            <Link to="/Faq" className="text-white hover:text-gray-300 mr-4">FAQ</Link>
                            <Link to="/help" className="text-white hover:text-gray-300">Help</Link>
                        </div>
                    </div>
                </div>
                <div className="w-0 md:w-2/5">
                    <img src={Logo} alt="Logo" className="h-full" />
                </div>
        </div>
    </div>
  );
};

export default Login;
