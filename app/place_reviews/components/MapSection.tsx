import useMap from "@/hooks/useMap";
import { Coordinates, KakaoMap } from "@/utils/types";
import MapKakao from "./MapKakao";

type Props = {
  currentCenter?: Coordinates;
};

const MapSection = ({ currentCenter }: Props) => {
  const { initializeMap } = useMap();

  const onLoadMap = (map: KakaoMap) => {
    initializeMap(map);
  };

  return (
    <MapKakao
      onLoad={onLoadMap}
      initialCenter={currentCenter}
      initialLevel={4}
    />
  );
};

export default MapSection;
