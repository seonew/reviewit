import { useState } from "react";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";

type Props = {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  checked?: boolean;
};

const IconButton = ({ onClick, checked }: Props) => {
  const [show, setShow] = useState(false);

  const handleClickItem = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onClick?.(event);
    setShow(!show);
  };

  return (
    <button className="absolute bottom-0 right-0 p-2" onClick={handleClickItem}>
      <span className="relative w-9 h-9 flex items-center justify-center -mr-1 -mb-1">
        {checked ?? show ? (
          <BookmarkSolidIcon className="h-6 w-6 text-ozip-blue absolute top-2/4 left-2/4 -translate-x-1/2 -translate-y-1/2" />
        ) : (
          <>
            <BookmarkIcon className="h-6 w-6 text-ozip-blue absolute top-2/4 left-2/4 -translate-x-1/2 -translate-y-1/2 z-10" />
            <BookmarkSolidIcon className="h-6 w-6 absolute top-2/4 left-2/4 -translate-x-1/2 -translate-y-1/2 opacity-90 text-white " />
          </>
        )}
      </span>
    </button>
  );
};

export default IconButton;