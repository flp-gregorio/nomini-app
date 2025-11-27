import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

type NavHeaderProps = {
  onPrevious: () => void;
  onNext: () => void;
  headerText: string;
};

const NavigationComponent = (props: NavHeaderProps) => {
  return (
    <>
      <div className="flex items-center text-center text-white font-montserrat uppercase font-bold text-xs h-full w-full max-w-xs py-5 bg-transparent flex-row md:max-w-screen-sm justify-around mx-auto">
        <button className="uppercase text-xl" onClick={props.onPrevious}>
          <FaArrowLeft className="" />
        </button>
        <h1 className="text-4xl md:text-6xl font-black font-barlow uppercase tracking-tighter text-orange-600">{props.headerText}</h1>
        <button className="uppercase text-xl order-3" onClick={props.onNext}>
          <FaArrowRight className="" />
        </button>
      </div>
    </>
  );
};

export default NavigationComponent;
