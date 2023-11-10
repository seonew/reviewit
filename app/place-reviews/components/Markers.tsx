import useSWR from "swr";
import { MAP_KEY } from "@/hooks/useMap";
import { KakaoMap, LocalPlace } from "@/types";
import { useBoundStore as useStore } from "@/store";
import Marker from "./Marker";

type Props = {
  locals: LocalPlace[] | null;
};

const Markers = ({ locals }: Props) => {
  const { data: map } = useSWR<KakaoMap>(MAP_KEY);
  const { setSelectedMarkerId } = useStore();

  if (!map || !locals) {
    return null;
  }

  return (
    <>
      {locals.map((local) => {
        return (
          <Marker
            key={local.id}
            map={map}
            coordinates={[local.mapy, local.mapx]}
            onClick={() => setSelectedMarkerId(local.id)}
          />
        );
      })}
    </>
  );
};

export default Markers;
