import { Children, FC, ReactNode, ReactElement } from "react";
import { Link } from "react-router-dom";

import SyncLoader from "react-spinners/PulseLoader";

interface IButtonProps {
  isLoading?: boolean;
  children?: ReactNode;
  label?: string;
  className?: string;
  onClick?: () => void;
  color?: string;
  icon?: ReactElement;
  border?: string;
  to?: string;
}
const Button: FC<IButtonProps> = (props) => {
  return (
    <>
      {props.to ? (
        <Link
          to={props.to}
          onClick={() => {
            props.onClick && props.onClick();
          }}
          className={`flex justify-center rounded-md border ${
            props.border ?? "border-transparent"
          }  py-2 px-4 text-sm font-medium shadow-sm focus:ring-2 ${
            props.color
              ? props.color
              : `hover:bg-darkblue  focus:ring-darkblue bg-darkblue text-white`
          } focus:outline-none  outline-none transition-colors duration-300 ${
            props.className
          }`}
        >
          {props.isLoading ? (
            <SyncLoader size={8} color='#fff' />
          ) : (
            <>
              {props.icon && <div>{props.icon}</div>}
              <div>{props.children ? <>{Children}</> : <>{props.label}</>}</div>
            </>
          )}
        </Link>
      ) : (
        <button
          disabled={props.isLoading}
          onClick={() => {
            props.onClick && props.onClick();
          }}
          className={`flex justify-center rounded-md border ${
            props.border ?? "border-transparent"
          }  py-2 px-4 text-sm font-medium shadow-sm focus:ring-2 ${
            props.color
              ? props.color
              : `hover:bg-darkblue  focus:ring-darkblue bg-darkblue text-white`
          } focus:outline-none  outline-none transition-colors duration-300 ${
            props.className
          }`}
        >
          {props.isLoading ? (
            <SyncLoader size={8} color='#fff' />
          ) : (
            <>
              {props.icon && <div>{props.icon}</div>}
              <div>{props.children ? <>{Children}</> : <>{props.label}</>}</div>
            </>
          )}
        </button>
      )}
    </>
  );
};

export default Button;
