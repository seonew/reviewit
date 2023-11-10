import { RefObject, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import IconButton from "./IconButton";
import { MovieProps, MediaVideoProps } from "@/types";

type Props = {
  contents: MovieProps[] | MediaVideoProps[];
  limit: number;
  uListElement: RefObject<HTMLUListElement>;
};

const HorizontalScrollButton = ({ contents, limit, uListElement }: Props) => {
  const total = contents.length;
  const [startIndex, setStartIndex] = useState<number>(0);
  const endPage = Math.ceil(total / limit) - 1;

  const scrollToIndex = (index: number) => {
    const indexPage = index * limit;
    const listNode = uListElement.current;
    const divNode = listNode?.querySelectorAll("li > div")[indexPage];
    divNode?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  const onMoveBox = (item: string) => () => {
    let result = 0;

    if (item === "prev") {
      result = startIndex - 1;
    } else {
      result = startIndex + 1;
    }
    setStartIndex(result);

    scrollToIndex(result);
  };

  return (
    <>
      {startIndex > 0 && (
        <IconButton label="prev" position="left-0" onClick={onMoveBox("prev")}>
          <ChevronLeftIcon className="w-7 h-6" />
        </IconButton>
      )}
      {startIndex !== endPage && (
        <IconButton
          label="next"
          position="left-full"
          onClick={onMoveBox("next")}
        >
          <ChevronRightIcon className="w-7 h-6" />
        </IconButton>
      )}
    </>
  );
};

export default HorizontalScrollButton;
