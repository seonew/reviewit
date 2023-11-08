import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  height?: string;
  color?: string;
};

const Card = ({ children, height = "h-60", color }: Props) => {
  return (
    <div
      className={`flex items-center justify-center rounded-lg w-full relative shadow ${
        color ?? "bg-gray-100"
      } ${height}`}
    >
      {children}
    </div>
  );
};

export default Card;
