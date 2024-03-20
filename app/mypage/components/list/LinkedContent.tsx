import Link from "next/link";
import { ReviewProps } from "@/types";

type Props = {
  review: ReviewProps;
};

const LinkedContent = ({ review }: Props) => {
  return (
    <div className="flex-grow shrink-0 basis-0 w-full">
      {review.contentTitle && (
        <Link href={`/dashboard/books/${review.contentId}`}>
          <p className="pb-2 text-md font-semibold leading-6 text-gray-900">
            {review.contentTitle}
          </p>
        </Link>
      )}
      <p className="text-sm leading-6 text-gray-600">{review.content}</p>
      <div className="text-xs leading-5">
        {review.userName && (
          <p className="font-semibold text-gray-900">{review.userName}</p>
        )}
        <p className="text-gray-400">{review.updateDate}</p>
      </div>
    </div>
  );
};

export default LinkedContent;
