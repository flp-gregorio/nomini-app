import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

type NavHeaderProps = {
  onPrevious: () => void;
  onNext: () => void;
  headerText: string;
};

const NavigationComponent = (props: NavHeaderProps) => {
  return (
    <>
      <div className="flex items-stretch text-center text-white font-montserrat uppercase font-bold text-xs h-fit w-full max-w-md md:max-w-3xl lg:max-w-5xl py-3 md:py-4 bg-transparent flex-row justify-between gap-4 mx-auto">
        <button className="uppercase text-xl flex items-center px-4 hover:bg-orange-600 transition-colors rounded-lg" onClick={props.onPrevious}>
          <FaArrowLeft className="" />
        </button>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-barlow uppercase tracking-tighter text-orange-600 py-1 flex-1 flex items-center justify-center">{props.headerText}</h1>
        <button className="uppercase text-xl order-3 flex items-center px-4 hover:bg-orange-600 transition-colors rounded-lg" onClick={props.onNext}>
          <FaArrowRight className="" />
        </button>
      </div>
    </>
  );
};

export default NavigationComponent;
