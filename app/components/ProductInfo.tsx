import Image from "next/image";
import Link from "next/link";
import { LikedProduct } from "@/types";
import { useBoundStore as useStore } from "@/store";
import Card from "@/app/components/Card";
import BookmarkButton from "./BookmarkButton";
import { handleClickSignIn } from "@/utils/common";

type Props = {
  product: LikedProduct;
};

const ProductInfo = ({ product }: Props) => {
  const { title, image, link, lprice, brand, checked } = product;
  const { addLikedProduct, deleteLikedProduct, user } = useStore();

  const handleClickItem = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!user.id && !user.name) {
      handleClickSignIn();
      return;
    }

    const isChecked = product.checked;
    if (isChecked) {
      deleteLikedProduct(product.productId);
    } else {
      addLikedProduct(product);
    }
    e.stopPropagation();
  };

  return (
    <div className="flex flex-col w-full min-w-0">
      <Link href={link}>
        <Card height="h-52">
          <Image
            src={image}
            alt={title}
            quality={80}
            fill
            sizes="(max-width: 768px) 100vw"
            style={{
              objectFit: "contain",
            }}
            className="p-4"
          />
          <BookmarkButton onClick={handleClickItem} checked={checked} />
        </Card>
        <div className="mt-2.5 text-sm font-normal min-w-0 break-keep break-words">
          <div className="overflow-hidden ">
            <span className="text-kakao-yellow font-bold">{title}</span>
            <div className="overflow-hidden block">
              {brand && <span className="mr-1">{brand}</span>}
              <span className="text-xs">{lprice}원</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductInfo;
