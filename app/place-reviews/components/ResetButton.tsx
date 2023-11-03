import { useBoundStore as useStore } from "@/store";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

type Props = {
  onClick?: () => void;
};

const ResetButton = ({ onClick }: Props) => {
  const handleClickReset = () => {
    onClick?.();
  };

  return (
    <button
      className="p-1.5 bg-kakao-yellow rounded-full text-xs font-semibold"
      onClick={handleClickReset}
    >
      <ArrowPathIcon className="w-5 h-5" />
    </button>
  );
};

export default ResetButton;
