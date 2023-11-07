import {
  getTotalItems,
  numberWithCommas,
  replaceBTagsWithEmptyString,
  replaceCaretWithComma,
} from "@/utils/common";
import { ProductProps } from "@/types";
import dynamic from "next/dynamic";

export default async function Page() {
  const { products, total, limit } = await getData("");
  const DynamicListPage = dynamic(() => import("./list-page"), {
    ssr: false,
  });
  return <DynamicListPage products={products} total={total} limit={limit} />;
}

async function getData(query: string) {
  try {
    const client_id = process.env.CLIENT_ID || "";
    const client_secret = process.env.CLIENT_SECRET || "";
    const shopRequestUrl = "https://openapi.naver.com/v1/search/shop?query=";
    const headers = {
      "X-Naver-Client-Id": client_id,
      "X-Naver-Client-Secret": client_secret,
    };
    query = "사람";
    const display = "&display=20";
    const start = "&start=1";

    const shopResponse = await fetch(
      `${shopRequestUrl}${encodeURI(query)}${display}${start}`,
      {
        headers,
      }
    );
    const productData = await shopResponse.json();
    const total = getTotalItems(productData.total);

    const products = productData.items;
    const productsResult: ProductProps[] = products.map(
      (product: {
        title: string;
        image: string;
        link: string;
        lprice: string;
        brand: string;
        productId: string;
        mallName: string;
        maker: string;
        productType: string;
        category1: string;
        category2: string;
        category3: string;
        category4: string;
      }) => {
        const result: ProductProps = {
          title: replaceBTagsWithEmptyString(product.title),
          brand: replaceCaretWithComma(product.brand),
          lprice: numberWithCommas(parseInt(product.lprice)),
          image: product.image,
          link: `/dashboard/products/${product.productId}`,
          mall: product.mallName,
          maker: product.maker,
          productId: product.productId,
          productType: product.productType,
          category: `${product.category1} > ${product.category2} > ${product.category3} > ${product.category4}`,
        };
        return result;
      }
    );

    return {
      products: productsResult,
      total: total,
      limit: 20,
    };
  } catch (e) {
    console.error(e);
    return {
      products: null,
      total: 0,
      limit: 10,
    };
  }
}
