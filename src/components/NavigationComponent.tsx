import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

type NavHeaderProps = {
  onPrevious: () => void;
  onNext: () => void;
  headerText: string;
};

const NavigationComponent = (props: NavHeaderProps) => {
  return (
    <>
      <div className="flex items-stretch text-center text-white font-montserrat uppercase font-bold text-xs h-fit w-full max-w-xs py-5 bg-transparent flex-row md:max-w-screen-sm justify-between gap-4 mx-auto">
        <button className="uppercase text-xl flex items-center px-4 hover:bg-orange-600 transition-colors rounded-lg" onClick={props.onPrevious}>
          <FaArrowLeft className="" />
        </button>
        <h1 className="text-4xl md:text-6xl font-black font-barlow uppercase tracking-tighter text-orange-600 py-2 flex-1 flex items-center justify-center">{props.headerText}</h1>
        <button className="uppercase text-xl order-3 flex items-center px-4 hover:bg-orange-600 transition-colors rounded-lg" onClick={props.onNext}>
          <FaArrowRight className="" />
        </button>
      </div>
    </>
  );
};

export default NavigationComponent;
