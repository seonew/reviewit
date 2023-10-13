import { LocalPlace } from "@/utils/types";
import { useBoundStore as useStore } from "@/store";
import LocalListItem from "./LocalListItem";

type Props = {
  items: LocalPlace[] | null;
  onClick?: () => void;
};

const LocalList = ({ items, onClick }: Props) => {
  const { selectedMarkerId } = useStore();

  return (
    <div className="py-6">
      <ul>
        {items?.map((item) => {
          return (
            <li
              key={item.id}
              className={`my-4 ${
                selectedMarkerId === item.id && "text-ozip-blue"
              }`}
            >
              <LocalListItem item={item} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LocalList;
