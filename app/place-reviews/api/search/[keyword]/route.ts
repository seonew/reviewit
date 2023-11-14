import { replaceBTagsWithEmptyString } from "@/utils/common";
import { NotFoundContentError } from "@/utils/error";
import { LocalPlace } from "@/types";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { keyword: string } }
) {
  try {
    const query = params.keyword;
    const requestData = await request.json();
    const { lat, lng } = requestData;

    if (!query) {
      throw new NotFoundContentError();
    }

    const client_id = process.env.NEXT_PUBLIC_KAKAO_API_CLIENT_ID ?? "";
    const requestUrl = "https://dapi.kakao.com/v2/local/search/keyword.json";
    const headers = {
      Authorization: `KakaoAK ${client_id}`,
    };
    const SIZE = 10;
    const CATEGORY_CODE = "FD6,CE7";
    const RADIUS = 20000;
    const paramsQuery = `?y=${lat}&x=${lng}&size=${SIZE}&category_group_code=${CATEGORY_CODE}&query=`;

    const response = await fetch(
      `${requestUrl}${paramsQuery}${encodeURI(query)}`,
      {
        headers,
      }
    );
    const data = await response.json();
    const items = data.documents;

    const markers = items.map(
      (marker: {
        place_name: string;
        category_name: string;
        id: string;
        phone: string;
        place_url: string;
        address_name: string;
        road_address_name: string;
        x: string;
        y: string;
      }) => {
        const result: LocalPlace = {
          id: marker.id,
          name: replaceBTagsWithEmptyString(marker.place_name),
          address: marker.address_name,
          category: marker.category_name,
          link: marker.place_url,
          mapx: parseFloat(marker.x),
          mapy: parseFloat(marker.y),
          roadAddress: marker.road_address_name,
          telephone: marker.phone,
        };
        return result;
      }
    );

    return NextResponse.json(markers);
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ error: "Internal Server Error", status: 500 });
}
