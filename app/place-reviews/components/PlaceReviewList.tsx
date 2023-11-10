import { PlaceReviewDataProps, PlaceReviewProps } from "@/types";
import Link from "next/link";
import PlaceReviewListItem from "./PlaceReviewListItem";

type Props = {
  placeReviewData: PlaceReviewDataProps;
};

const PlaceReviewList = ({ placeReviewData }: Props) => {
  const { data } = placeReviewData;

  return (
    <div className="pb-10">
      <ul className="list-none my-10 mr-8">
        {data &&
          data.map((current: PlaceReviewProps) => {
            const { place, review } = current;

            return (
              <li key={review.id} className="mt-7">
                <div className="content-detail-comment-user">
                  <Link href={`${place.link}`}>
                    <span className="text-base leading-5 font-bold mr-1.5">
                      {place.name}
                    </span>
                  </Link>
                </div>
                <PlaceReviewListItem review={review} />
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default PlaceReviewList;
