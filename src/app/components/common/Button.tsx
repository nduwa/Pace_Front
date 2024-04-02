import { FC } from "react";
import { ButtonProps } from "../../types/Button";

const Button: FC<ButtonProps> = ({ size = "sm", rounded = false, ...props }) => {
  const colorClass =
    props.color == "white"
      ? "bg-white text-gray-700"
      : "bg-darkblue text-white focus:ring-darkblue";
  return (
    <>
      <button
        className={`roounded p-2 hover:bg-semiPrimary focus:ring-1  ${
          rounded && "rounded-md"
        } ${size} ${colorClass}`}
      >
        {props.label}
      </button>
    </>
  );
};

export default Button;
