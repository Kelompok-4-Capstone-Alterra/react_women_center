import React from "react";
import { useNavigate } from 'react-router';
import '../App.css'
import loginImage from '../assets/login-image.png'
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import Button from "../components/Button";

const LandingPage =()=> {
  const navigate = useNavigate();
  const navigateToLogin = () => {
      navigate('/login');
  };
  return (
    <div className="flex relative w-full h-screen bg-primary">
      <div className="flex flex-col justify-center text-left pl-[117px] pr-[139px] w-full h-full">
        <p className="text-[32px] mb-2 font-medium text-[#E3DDB2] "> Welcome to,</p>
        <p className="text-[28px] mb-8 font-medium">Women Center's Admin Panel!</p>
        <p className="text-base mb-16">As an administrator of a women's center, 
          your role is to oversee the day-to-day operations of the center 
          and ensure that it is fulfilling its mission of supporting and empowering women.</p>
        <Button className="bg-[#BDB728] h-[56px]
        border-[#EADB7D] hover:bg-[#AEAB59] active:bg-[#913175] hover:outline-[#AEAB59]" onClick={navigateToLogin}>
          <LoginOutlinedIcon className="m-2.5 pb-0.5"/> Get into the dashboard
        </Button>
      </div>
      <div id='login-image' className="flex items-center justify-center w-full h-full">
          <img src={loginImage} alt="login-image" className="max-h-screen" />
      </div>
    </div>
  )
}
export default LandingPage