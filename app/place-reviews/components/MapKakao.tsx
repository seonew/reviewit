import Script from "next/script";
import { Coordinates, KakaoMap } from "@/utils/types";
import { INITIAL_CENTER, INITIAL_LEVEL } from "@/hooks/useMap";
import { useEffect } from "react";

const KAKAO_MAP_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT_ID;

type Props = {
  mapId?: string;
  initialCenter?: Coordinates;
  initialLevel?: number;
  onLoad?: (map: KakaoMap) => void;
};

const Map = ({
  mapId = "map",
  initialCenter = INITIAL_CENTER,
  initialLevel = INITIAL_LEVEL,
  onLoad,
}: Props) => {
  const initializeMap = () => {
    if (!kakao) return;

    window.kakao.maps.load(() => {
      const mapContainer = document.getElementById("map")!;
      const location = new window.kakao.maps.LatLng(...initialCenter);
      const mapOptions = {
        center: location,
        level: initialLevel,
      };
      const map = new window.kakao.maps.Map(mapContainer, mapOptions);

      if (onLoad) {
        onLoad(map);
      }
    });
  };

  return (
    <>
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_CLIENT_ID}&autoload=false&libraries=services`}
        onReady={initializeMap}
      />
      <div id={mapId} style={{ width: "100%", height: 500 }}></div>
    </>
  );
};

export default Map;
