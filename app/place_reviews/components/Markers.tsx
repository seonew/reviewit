import useSWR from "swr";
import { MAP_KEY } from "@/hooks/useMap";
import { KakaoMap, LocalPlace } from "@/utils/types";
import { useBoundStore as useStore } from "@/store";
import Marker from "./Marker";

type Props = {
  items: LocalPlace[] | null;
};

const Markers = ({ items }: Props) => {
  const { data: map } = useSWR<KakaoMap>(MAP_KEY);
  const { setSelectedMarkerId } = useStore();

  if (!map || !items) {
    return null;
  }

  return (
    <>
      {items.map((item) => {
        return (
          <Marker
            key={item.id}
            map={map}
            coordinates={[item.mapy, item.mapx]}
            item={item}
            onClick={() => setSelectedMarkerId(item.id)}
          />
        );
      })}
    </>
  );
};

export default Markers;
