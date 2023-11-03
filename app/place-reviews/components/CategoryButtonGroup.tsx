import { ReactNode } from "react";

type Props = {
  onClick?: (code: string) => void;
  children?: ReactNode;
  selectedCode?: string;
};

const CategoryButtonGroup = ({ onClick, children, selectedCode }: Props) => {
  const places = [
    { name: "음식점", code: "FD6" },
    { name: "카페", code: "CE7" },
    { name: "병원", code: "HP8" },
    { name: "약국", code: "PM9" },
    { name: "문화시설", code: "CT1" },
  ];
  const initCSS = `px-2 py-1.5 text-ozip-blue rounded-full text-xs font-semibold border-2 border-ozip-blue`;
  const selectedCSS = `px-2.5 py-2 bg-ozip-blue rounded-full text-xs font-semibold text-white`;

  return (
    <div className="my-1 flex items-center">
      {places.map((place) => {
        return (
          <button
            className="pr-1"
            onClick={() => onClick?.(place.code)}
            key={place.code}
          >
            <span
              className={`${
                selectedCode === place.code ? selectedCSS : initCSS
              }`}
            >
              {place.name}
            </span>
          </button>
        );
      })}
      {children}
    </div>
  );
};

export default CategoryButtonGroup;
