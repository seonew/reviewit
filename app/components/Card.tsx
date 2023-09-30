import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  width?: string;
  height?: string;
  color?: string;
};

const Card = ({ children, width, height, color }: Props) => {
  return (
    <div
      className={`flex items-center justify-center rounded-lg w-full relative shadow ${
        color ?? "bg-gray-100"
      } ${width ?? "w-60"} ${height ?? "h-60"}`}
    >
      {children}
    </div>
  );
};

export default Card;
