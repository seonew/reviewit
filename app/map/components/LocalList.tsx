import { LocalPlace } from "@/utils/types";

type Props = {
  items: LocalPlace[] | null;
};

const LocalList = ({ items }: Props) => {
  return (
    <div className="py-6">
      <ul>
        {items?.map((item) => {
          return (
            <li key={item.id} className="my-4">
              <div className="mr-5">
                <span className="font-bold text-base leading-5 ">
                  {item.name}
                </span>
                <span className="text-xs text-gray-500 mx-2">
                  {item.category}
                </span>
              </div>
              <div>
                <span className="text-sm leading-4">{item.roadAddress}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LocalList;
