import { Outlet } from "react-router-dom"; // Import Outlet
import FooterComponent from "../FooterComponent";
import HeaderComponent from "../HeaderComponent";

const LayoutSystemComponent = () => {
  return (
    <>
      <HeaderComponent />
      <div className="bg-fiery bg-cover antialiased mx-auto min-w-min min-h-screen">
        <Outlet />
      </div>
      <FooterComponent />
    </>
  );
};

export default LayoutSystemComponent;