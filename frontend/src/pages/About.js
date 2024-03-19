import React from "react";
import BackgroundImage6 from "../images/BackgroundImage6.png";
import "../index";
import Logo from "../images/Logo.png";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { useNavigate } from "react-router-dom";


const About = () => {
    const navigate = useNavigate();
	return (
		<div
			className="about-us-container flex flex-col gap-32 h-screen min-h-screen p-5 w-screen bg-cover"
			style={{
				backgroundImage: `url(${BackgroundImage6})`,
			}}>
            
            <div className="flex justify-start gap-5 border-2 border-gray-600" style={{ backgroundColor: '#111', padding: '10px', color: 'white', fontSize: '24px', fontWeight: 'bold', textAlign: 'left', fontFamily: 'Arial, sans-serif', boxShadow: '0px 0px 10px 0px rgba(255, 255, 255, 0.3)' }}>
                <HomeOutlinedIcon
                className="text-slate-300 cursor-pointer ml-8"
                fontSize="large"
                onClick={() => navigate("/")}
                />
            </div>
			<div className="grid grid-cols-12 h-3/4 mx-12">
				<div className="text-container flex flex-col justify-center gap-16 col-span-7 text-right p-8 relative">
					<div className="flex flex-col gap-8 pr-4">
						<h2 className="text-red-300 font-bold text-5xl satisfy-regular">
							ABOUT US
						</h2>
						<div className="flex justify-end">
							<p className="poppins-medium-italic text-red-100 w-5/6 text-2xl ">
								At Code Collab, we're passionate about fostering collaboration
								and innovation in software development. Our platform empowers
								developers to work together in real-time, sharing ideas and code
								to create remarkable solutions. Join us on a journey of
								creativity and excellence as we shape the future of software
								development together.
							</p>
						</div>
					</div>
					<div className="flex flex-col left-2 gap-8 pr-4 text-left">
						<h2 className="text-red-300 font-bold text-5xl satisfy-regular text-end">
							Contact Us
						</h2>
						<div className="flex flex-col text-right">
							<div className="flex justify-end gap-4">
								<p className="text-red-100 poppins-medium-italic text-2xl font-bold  my-1">
									Email:{" "}
								</p>
								<p className="text-red-100 poppins-medium-italic text-2xl my-1">
									xyz@gmail.com
								</p>
							</div>
							<div className="flex justify-end gap-4">
								<p className="text-red-100 poppins-medium-italic text-2xl my-1 font-bold">
									Phone no:{" "}
								</p>
								<p className="text-red-100 poppins-medium-italic text-2xl my-1">
									1234567890
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className="Logo col-span-5 object-fill pr-20">
					<img src={Logo}></img>
				</div>
			</div>
		</div>
	);
};

export default About;
