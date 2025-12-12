import { ComponentProps } from "react";
interface Props extends ComponentProps<"button"> {
  text: string;
}

const ButtonComponent = ({ text, ...rest }: Props) => {
  return (
    <button
      {...rest}
      className="bg-orange-700 text-white min-w-32 px-4 py-1 mb-6 uppercase font-bold hover:bg-orange-800 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-700"
      style={{
        clipPath:
          "polygon(0px 0px, 100% 0px, 100% 14px, 100% 100%, 14px 100%, 0px calc(100% - 14px))",
        padding: "9px 32px 9px 39px",
      }}
    >
      {text}
    </button>
  );
};

export default ButtonComponent;
