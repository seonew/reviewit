import Image from "next/image";
import Link from "next/link";
import { LikedBook } from "@/utils/types";
import Card from "@/components/Card";
import IconButton from "./IconButton";
import useStore from "@/store";

const BookInfo = ({ item }: { item: LikedBook }) => {
  const { title, author, discount, image, link, checked } = item;
  const { updateLikedBooks, updateCheckedToTopBooks } = useStore();

  const handleClickItem = () => {
    updateLikedBooks(item);
    updateCheckedToTopBooks(item);
  };

  return (
    <div className="flex flex-col w-full min-w-0">
      <Link href={link}>
        <Card width="w-52" height="h-52">
          <Image
            src={image}
            alt={title}
            quality={80}
            fill
            sizes="(max-width: 768px) 100vw"
            style={{
              objectFit: "contain",
            }}
          />
          <IconButton onClick={handleClickItem} checked={checked} />
        </Card>
        <div className="mt-2.5 text-sm font-normal min-w-0 break-keep break-words">
          <div className="overflow-hidden ">
            <span className="text-ozip-blue font-bold">{title}</span>
            <div className="overflow-hidden block">
              <span className="mr-1">{author}</span>
              <span className="text-xs">{discount}원</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BookInfo;
