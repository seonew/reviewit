import { useEffect } from "react";
import type { Coordinates, KakaoMap, LocalPlace } from "@/utils/types";

type Props = {
  item: LocalPlace;
  map: KakaoMap;
  coordinates: Coordinates;
  onClick?: () => void;
};

const Marker = ({ map, coordinates, onClick, item }: Props): null => {
  useEffect(() => {
    let marker: kakao.maps.Marker | null = null;

    if (map) {
      marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(...coordinates),
        map: map,
      });
    }

    return () => {
      marker?.setMap(null);
    };
  }, [map]);
  return null;
};

export default Marker;
