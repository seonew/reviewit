import {
  PlaceReviewsWithKeywordDataProps,
  PlaceReviewWithKeywordProps,
} from "@/types";
import Link from "next/link";
import PlaceReviewListItem from "./PlaceReviewListItem";
import PreferenceStatSection from "@/app/components/view/PreferenceStatSection";

type Props = {
  data: PlaceReviewsWithKeywordDataProps;
};

const PlaceReviewsWithKeyword = ({
  data: PlaceReviewsWithKeywordData,
}: Props) => {
  const { data } = PlaceReviewsWithKeywordData;

  return (
    <div className="pb-10">
      <ul className="list-none my-10 mr-8">
        {data &&
          data.map((current: PlaceReviewWithKeywordProps, index) => {
            const { place, items } = current;
            const { reviews, stats } = items;

            return (
              <li key={`${place.id}_${index}`} className={`mt-16 first:mt-6`}>
                <div className="content-detail-comment-user">
                  <Link href={`${place.link}`}>
                    <span className="text-base leading-5 font-bold mr-1.5">
                      {place.name}
                    </span>
                  </Link>
                </div>
                {stats && (
                  <div className="-my-4">
                    <PreferenceStatSection stats={stats} />
                  </div>
                )}
                <div>
                  {reviews &&
                    reviews.map((review) => {
                      return (
                        <div key={review.id} className="pt-2 first:pt-0">
                          <PlaceReviewListItem review={review} />
                        </div>
                      );
                    })}
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default PlaceReviewsWithKeyword;
