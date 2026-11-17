import { ComponentProps } from "react";

interface Props extends ComponentProps<"button"> {
  text: string;
  className?: string;
}

const ButtonComponent = ({ text, className = "", ...rest }: Props) => {
  return (
    <button
      {...rest}
      className={`bg-[#FF641A] text-white min-w-36 px-8 py-2.5 font-barlow text-sm sm:text-base uppercase font-bold tracking-[0.14em] hover:bg-[#e55512] active:scale-[0.99] transition-all duration-200 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF641A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090B] ${className}`}
      style={{
        clipPath:
          "polygon(0px 0px, 100% 0px, 100% 14px, 100% 100%, 14px 100%, 0px calc(100% - 14px))",
      }}
    >
      {text}
    </button>
  );
};

export default ButtonComponent;
