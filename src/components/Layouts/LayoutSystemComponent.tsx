import { Outlet } from "react-router-dom"; // Import Outlet
import FooterComponent from "../FooterComponent";
import HeaderComponent from "../HeaderComponent";

const LayoutSystemComponent = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#09090B] text-[#F5F5F5]">
      <HeaderComponent />
      <main
        className="relative antialiased mx-auto flex-grow w-full"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 45% at 50% 10%, rgba(255, 100, 26, 0.065) 0%, transparent 72%)",
        }}
      >
        <Outlet />
      </main>
      <FooterComponent />
    </div>
  );
};

export default LayoutSystemComponent;