import { useNavigate } from "react-router";
import "../App.css";
import loginImage from "../assets/login-image.png";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import ButtonSecondary from "../components/ButtonSecondary";

function LandingPage() {
  const navigate = useNavigate();
  const navigateToLogin = () => {
    navigate("/login");
  };
  return (
    <div className="flex relative w-full h-screen bg-primaryPressed">
      <div className="flex flex-col justify-center text-left pl-[117px] pr-[139px] w-full h-full">
        <p className="text-[32px] mb-2 font-medium text-[#E3DDB2] ">
          Welcome to,
        </p>
        <p className="text-[28px] text-white mb-8 font-medium">
          Women Center's Admin Panel!
        </p>
        <p className="text-base text-white mb-16 ">
          As an administrator of a women's center, your role is to oversee the
          day-to-day operations of the center and ensure that it is fulfilling
          its mission of supporting and empowering women.
        </p>
        <ButtonSecondary onClick={navigateToLogin}>
          <LoginOutlinedIcon /> Get into the dashboard
        </ButtonSecondary>
      </div>
      <div
        id="login-image"
        className="flex items-center justify-center w-full h-full"
      >
        <img src={loginImage} alt="login-image" className="max-h-screen" />
      </div>
    </div>
  );
}
export default LandingPage;
