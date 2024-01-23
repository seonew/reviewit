import Image from "next/image";
import Link from "next/link";
import { LikedBook } from "@/types";
import { useBoundStore as useStore } from "@/store";
import Card from "@/app/components/Card";
import BookmarkButton from "./BookmarkButton";
import { handleClickSignIn } from "@/utils/common";

type Props = {
  book: LikedBook;
};

const BookInfo = ({ book }: Props) => {
  const { title, author, discount, image, link, checked } = book;
  const { addLikedBook, deleteLikedBook, user } = useStore();

  const handleClickItem = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!user.id && !user.name) {
      handleClickSignIn();
      return;
    }

    const isChecked = book.checked;
    if (isChecked) {
      deleteLikedBook(book.isbn);
    } else {
      addLikedBook(book);
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
          />
          <BookmarkButton onClick={handleClickItem} checked={checked} />
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
