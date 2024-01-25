import { ReactNode } from "react";

type Props = {
  size: string;
  children?: ReactNode;
  color?: string;
};

const DefaultImage = ({ size, children, color = "bg-stone-200" }: Props) => {
  return (
    <div
      className={`flex items-center justify-center rounded ${color} ${size}`}
    >
      <span className="text-neutral-400">{children}</span>
    </div>
  );
};

export default DefaultImage;
