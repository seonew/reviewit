import { ReactNode } from "react";

type Props = {
  size: string;
  children?: ReactNode;
};

const DefaultImage = ({ size, children }: Props) => {
  return (
    <div
      className={`flex items-center justify-center rounded bg-stone-200 ${size}`}
    >
      <span className="text-neutral-400">{children}</span>
    </div>
  );
};

export default DefaultImage;
