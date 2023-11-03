import { ReviewProps } from "@/utils/types";
import Image from "next/image";
import Link from "next/link";
import DefaultImage from "@/app/components/DefaultImage";
import { PhotoIcon } from "@heroicons/react/24/outline";

type Props = {
  title: string;
  items: ReviewProps[];
};

const LikeList = ({ title, items }: Props) => {
  return (
    <div className="pb-10">
      <div className="py-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-black">{title}</h2>
      </div>
      <ul role="list" className="divide-y divide-gray-100 break-words">
        {items.map((like: ReviewProps) => {
          return (
            <li key={like.id} className="flex justify-between py-4">
              <div className="flex gap-x-6">
                <div className="h-20 w-14 flex-shrink-0 overflow-hidden">
                  <Link href={`/dashboard/books/${like.contentId}`}>
                    {like.contentImgUrl ? (
                      <Image
                        className="rounded"
                        src={like.contentImgUrl}
                        alt={like.contentId}
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

                <div className="flex-auto ">
                  {like.contentTitle && (
                    <Link href={`/dashboard/books/${like.contentId}`}>
                      <p className="pb-2 text-md font-semibold leading-6 text-gray-900">
                        {like.contentTitle}
                      </p>
                    </Link>
                  )}
                  <p className="text-sm leading-6 text-gray-600">
                    {like.content}
                  </p>
                  <div className="text-xs leading-5">
                    {like.userName && (
                      <p className="font-semibold text-gray-900">
                        {like.userName}
                      </p>
                    )}
                    <p className="text-gray-400">{like.updateDate}</p>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LikeList;
