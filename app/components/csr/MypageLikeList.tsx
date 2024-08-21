import { LikedContent } from "@/types";
import CardList from "@/app/components/CardList";
import CardInfo from "@/app/mypage/components/CardInfo";

type Props = {
  likedMovies: LikedContent[];
  likedBooks: LikedContent[];
};

const MypageLikeList = ({ likedMovies, likedBooks }: Props) => {
  return (
    <>
      <CardList title={"My Movie List"} gridColsCSS={"grid-cols-4"}>
        {likedMovies.map((item: LikedContent) => {
          return <CardInfo key={item.id} content={item} />;
        })}
      </CardList>
      <CardList title={"My Book List"} gridColsCSS={"grid-cols-4"}>
        {likedBooks.map((item: LikedContent) => {
          return <CardInfo key={item.id} content={item} />;
        })}
      </CardList>
    </>
  );
};

export default MypageLikeList;
