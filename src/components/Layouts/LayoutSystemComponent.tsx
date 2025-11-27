import { Outlet } from "react-router-dom"; // Import Outlet
import FooterComponent from "../FooterComponent";
import HeaderComponent from "../HeaderComponent";

const LayoutSystemComponent = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderComponent />
      <div className="bg-fiery bg-cover antialiased mx-auto flex-grow w-full">
        <Outlet />
      </div>
      <FooterComponent />
    </div>
  );
};

export default LayoutSystemComponent;