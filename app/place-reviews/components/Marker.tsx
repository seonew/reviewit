import { useEffect } from "react";
import type { Coordinates, KakaoMap, LocalPlace } from "@/utils/types";

type Props = {
  map: KakaoMap;
  coordinates: Coordinates;
  onClick?: () => void;
};

const Marker = ({ map, coordinates, onClick }: Props): null => {
  useEffect(() => {
    let marker: kakao.maps.Marker | null = null;

    if (map) {
      marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(...coordinates),
        map: map,
      });
    }

    kakao.maps.event.addListener(marker, "click", () => {
      onClick?.();
    });

    return () => {
      marker?.setMap(null);
    };
  }, [coordinates, map, onClick]);
  return null;
};

export default Marker;
