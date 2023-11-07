import { useCallback } from "react";
import useSWR, { mutate } from "swr";
import { Coordinates, KakaoMap } from "@/types";

export const INITIAL_CENTER: Coordinates = [37.5656, 126.9769];
export const INITIAL_LEVEL = 5;
export const MAP_KEY = "/map";

const useMap = () => {
  const { data: map } = useSWR(MAP_KEY);

  const initializeMap = useCallback((map: KakaoMap) => {
    mutate(MAP_KEY, map);
  }, []);

  const resetMapOptions = useCallback(() => {
    map.morph(new kakao.maps.LatLng(...INITIAL_CENTER), INITIAL_LEVEL);
  }, [map]);

  const getMapOptions = useCallback(() => {
    const mapCenter = map.getCenter();
    const center: Coordinates = [mapCenter.lat(), mapCenter.lng()];
    const zoom = map.getZoom();

    return { center, zoom };
  }, [map]);

  return {
    initializeMap,
    resetMapOptions,
    getMapOptions,
  };
};
export default useMap;
