import React from 'react';
import Logo from '../images/Logo.png';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { useNavigate } from 'react-router-dom';
import '../styles/About.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const About = () => {
  const navigate = useNavigate();
  
  return (

    <div className='bigCont'>
      <div className='mt-5 ml-5'>
          <HomeOutlinedIcon
            className="text-slate-200 cursor-pointer mt-3 ml-5"
            fontSize="large"
            onClick={() => navigate("/")}
          />

      </div>
    
    <div className='about-us-container h-screen bg-cover relative flex flex-row '>
      <div className='text-container-container flex flex-grow justify-center items-center md:w-60'>
        <div className='text-container text-center'>
          <h2 className='text-red-300 font-bold text-5xl satisfy-regular'>ABOUT US</h2>
          <div>
            <p className='poppins-medium-italic text-red-100 text-xl'>
              At Code Collab, we're passionate about fostering collaboration and innovation in software development. Our platform empowers developers to work together in real-time, sharing ideas and code to create remarkable solutions. Join us on a journey of creativity and excellence as we shape the future of software development together.
            </p>
          </div>
          <div>
            <h2 className='text-red-300 font-bold text-5xl satisfy-regular mt-5'>Contact Us</h2>
            <div className='flex flex-col'>
              <div className='flex justify-center gap-4'>
                <p className='text-red-100 poppins-medium-italic font-bold my-1'>Email:</p>
                <p className='text-red-100 poppins-medium-italic my-1'>xyz@gmail.com</p>
              </div>
              <div className='flex justify-center gap-4'>
                <p className='text-red-100 poppins-medium-italic font-bold my-1'>Phone no:</p>
                <p className='text-red-100 poppins-medium-italic my-1'>1234567890</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='Logo-container hidden md:block md:w-40'>
        <img src={Logo} alt='Logo' className='max-h-100' />
      </div>
    </div>
    </div>
  );
}

export default About;
