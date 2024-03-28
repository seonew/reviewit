import Link from "next/link";
import Image from "next/image";
import DefaultImage from "@/app/components/DefaultImage";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { ReviewProps } from "@/types";
import { DETAIL_BOOK_PATH } from "@/utils/constants";

type Props = {
  review: ReviewProps;
};

const LinkedImage = ({ review }: Props) => {
  return (
    <div className="h-20 w-14 flex-shrink-0 overflow-hidden">
      <Link href={`${DETAIL_BOOK_PATH}/${review.contentId}`}>
        {review.contentImgUrl ? (
          <Image
            className="rounded"
            src={review.contentImgUrl}
            alt={review.contentId}
            quality={75}
            width={60}
            height={80}
          />
        ) : (
          <DefaultImage size="h-20 w-14">
            <PhotoIcon className="w-8 h-8" />
          </DefaultImage>
        )}
      </Link>
    </div>
  );
};

export default LinkedImage;
