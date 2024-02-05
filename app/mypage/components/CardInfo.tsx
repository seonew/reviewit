import Link from "next/link";
import Image from "next/image";
import { useBoundStore as useStore } from "@/store";
import { LikedContent } from "@/types";
import Card from "@/app/components/Card";
import BookmarkButton from "@/app/components/BookmarkButton";

type Props = { content: LikedContent };

const CardInfo = ({ content }: Props) => {
  const { imgUrl: image, title, id, link, type } = content;
  const { deleteLikedBook, deleteLikedProduct } = useStore();

  const handleClickItem = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (type === "book") {
      deleteLikedBook(id);
    } else if (type === "product") {
      deleteLikedProduct(id);
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
            priority
          />
          <BookmarkButton onClick={handleClickItem} checked={true} />
        </Card>
        <div className="mt-2.5 text-sm font-normal min-w-0 break-keep break-words">
          <div className="overflow-hidden ">
            <span className="text-ozip-blue font-bold">{title}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CardInfo;
