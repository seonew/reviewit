import { LocalPlace } from "@/types";
import { useBoundStore as useStore } from "@/store";

type Props = {
  item: LocalPlace;
};

const LocalListItem = ({ item }: Props) => {
  const { setCurrentPlace, setOpenModal, openModal } = useStore();

  const handleClickModal = () => {
    setCurrentPlace(item);
    setOpenModal(!openModal);
  };

  return (
    <>
      <div className="flex items-center">
        <div className="mr-3 grow">
          <span className="font-bold text-base leading-5 ">{item.name}</span>
          <span className="text-xs text-gray-500 mx-2">{item.category}</span>
          <span className="text-sm leading-6 block">{item.roadAddress}</span>
        </div>

        <button onClick={handleClickModal} className="button-xs-blue">
          리뷰 작성
        </button>
      </div>
    </>
  );
};

export default LocalListItem;
