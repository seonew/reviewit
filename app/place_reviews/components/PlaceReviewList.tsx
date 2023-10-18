import { PlaceReviewProps } from "@/utils/types";
import Link from "next/link";
import PlaceReviewListItem from "./PlaceReviewListItem";
import PreferenceStatSection from "@/app/components/view/PreferenceStatSection";

type Props = {
  data: PlaceReviewProps[];
};

const PlaceReviewList = ({ data }: Props) => {
  return (
    <div className="pb-10">
      <ul className="list-none my-10 mr-8">
        {data &&
          data.map((current: PlaceReviewProps, index) => {
            const { place, items } = current;
            const { stats } = items;

            return (
              <li
                key={`${place.id}_${index}`}
                className={`${stats && "mt-14 first:mt-6"} mt-7`}
              >
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
                <ul className="">
                  <PlaceReviewListItem items={items} />
                </ul>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default PlaceReviewList;
