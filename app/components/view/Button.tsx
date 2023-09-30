import { ReactNode } from "react";

type Props = {
  label: string;
  position: string;
  children: ReactNode;
  onClick?: (label: string) => void;
};
const Button = ({ label, position, children, onClick }: Props) => {
  const handleClick = (label: string) => () => {
    onClick?.(label);
  };

  return (
    <div
      className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 ${position}`}
    >
      <button
        type="button"
        aria-label={label}
        className="w-11 h-11 text-base font-black text-center bg-white text-black flex items-center justify-center rounded-full shadow-md m-0 p-0"
        onClick={handleClick(label)}
      >
        <span className="inline-block text-xl">{children}</span>
      </button>
    </div>
  );
};

export default Button;
