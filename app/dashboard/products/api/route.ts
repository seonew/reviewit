import {
  getTotalItems,
  numberWithCommas,
  replaceBTagsWithEmptyString,
  replaceCaretWithComma,
} from "@/utils/common";
import { ProductProps } from "@/utils/types";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get("page") ?? "1";
    let startNumber = (parseInt(pageParam) - 1) * 20 + 1;

    const client_id = process.env.CLIENT_ID || "";
    const client_secret = process.env.CLIENT_SECRET || "";
    const shopRequestUrl = "https://openapi.naver.com/v1/search/shop?query=";
    const headers = {
      "X-Naver-Client-Id": client_id,
      "X-Naver-Client-Secret": client_secret,
    };
    const query = "사람";
    const display = "&display=20";
    const start = `&start=${startNumber}`;

    const shopResponse = await fetch(
      `${shopRequestUrl}${encodeURI(query)}${display}${start}`,
      {
        headers,
      }
    );
    const shopData = await shopResponse.json();
    const total = getTotalItems(shopData.total);

    const products = shopData.items;
    const productsResult = products.map((product: ProductProps) => {
      const result: ProductProps = {
        title: replaceBTagsWithEmptyString(product.title),
        brand: replaceCaretWithComma(product.brand),
        lprice: numberWithCommas(parseInt(product.lprice)),
        image: product.image,
        link: product.link,
        productId: product.productId,
      };
      return result;
    });

    const result = {
      products: productsResult,
      total,
      limit: 20,
    };

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
