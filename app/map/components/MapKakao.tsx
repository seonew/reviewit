import Script from "next/script";
import { Coordinates, KakaoMap } from "@/utils/types";
import { INITIAL_CENTER, INITIAL_LEVEL } from "@/hooks/useMap";

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
    console.log("initializeMap====1");
    if (!kakao) return;

    console.log("initializeMap====2");
    window.kakao.maps.load(() => {
      const mapContainer = document.getElementById("map")!;
      const location = new window.kakao.maps.LatLng(...initialCenter);
      // console.log(location);
      const mapOptions = {
        center: location,
        level: initialLevel,
      };
      //새로운 맵 인스턴스 생성
      const map = new window.kakao.maps.Map(mapContainer, mapOptions);
      // mapRef.current = map;
      // console.log(mapRef.current);

      if (onLoad) {
        onLoad(map);
      }
    });
  };

  // 맵이 unmount되었을 때 맵 인스턴스 destory하기
  // useEffect(() => {
  // return () => {
  // mapRef.current?.destroy();
  // };
  // }, []);

  return (
    <>
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_CLIENT_ID}&autoload=false&libraries=services`}
        onLoad={initializeMap}
      />
      <div id={mapId} style={{ width: "100%", height: 500 }}></div>
    </>
  );
};

export default Map;
