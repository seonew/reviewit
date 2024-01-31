import {
  getTotalItems,
  numberWithCommas,
  replaceBTagsWithEmptyString,
  replaceCaretWithComma,
} from "@/utils/common";
import { LikedContent, LikedProduct, ProductApiResponse } from "@/types";
import { NextResponse } from "next/server";
import { getUserBookmarks, getUserId } from "@/app/api/common";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const displayCount: number = parseInt(
      searchParams.get("displayCount") ?? "20"
    );
    const pageParam = searchParams.get("page") ?? "1";
    const startNumber = (parseInt(pageParam) - 1) * 20 + 1;

    const result = await getProducts(startNumber, displayCount);
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}

export const getProducts = async (
  startNumber: number,
  displayCount: number
) => {
  const client_id = process.env.CLIENT_ID ?? "";
  const client_secret = process.env.CLIENT_SECRET ?? "";
  const shopRequestUrl = "https://openapi.naver.com/v1/search/shop?query=";
  const headers = {
    "X-Naver-Client-Id": client_id,
    "X-Naver-Client-Secret": client_secret,
  };
  const query = "블루보틀";
  const display = `&display=${displayCount}`;
  const start = `&start=${startNumber}`;

  const shopResponse = await fetch(
    `${shopRequestUrl}${encodeURI(query)}${display}${start}`,
    {
      headers,
    }
  );
  const shopData = await shopResponse.json();
  const total = getTotalItems(shopData.total);

  let bookmarks: LikedContent[] | null = null;
  try {
    await getUserId();
    bookmarks = await getUserBookmarks("product");
  } catch (err) {}

  const products = shopData.items;
  const productsResult = products.map((product: ProductApiResponse) => {
    const bookmark = bookmarks?.find(
      (bookmark) => bookmark.id === product.productId
    );
    const checked = !bookmark ? false : true;

    const result: LikedProduct = {
      title: replaceBTagsWithEmptyString(product.title),
      brand: replaceCaretWithComma(product.brand),
      lprice: numberWithCommas(parseInt(product.lprice)),
      image: product.image,
      link: product.link,
      mall: product.mallName,
      maker: product.maker,
      productId: product.productId,
      productType: product.productType,
      category: `${product.category1} > ${product.category2} > ${product.category3} > ${product.category4}`,
      checked,
    };
    return result;
  });

  return {
    products: productsResult,
    total,
    limit: displayCount,
  };
};
