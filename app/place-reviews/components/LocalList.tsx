import { LocalPlace } from "@/types";
import { useBoundStore as useStore } from "@/store";
import LocalListItem from "./LocalListItem";

type Props = {
  locals: LocalPlace[] | null;
};

const LocalList = ({ locals }: Props) => {
  const { selectedMarkerId } = useStore();

  return (
    <div className="pb-4">
      <ul>
        {locals?.map((local) => {
          return (
            <li
              key={local.id}
              className={`my-4 ${
                selectedMarkerId === local.id && "text-ozip-blue"
              }`}
            >
              <LocalListItem place={local} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LocalList;
