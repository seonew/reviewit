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

  const handleClick = (code: string) => () => {
    onClick?.(code);
  };

  return (
    <div className="my-1 flex items-center">
      {places.map((place) => {
        return (
          <button
            key={place.code}
            className="pr-1"
            onClick={handleClick(place.code)}
          >
            <span
              className={`${
                selectedCode === place.code
                  ? "category-button-active"
                  : "category-button"
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
