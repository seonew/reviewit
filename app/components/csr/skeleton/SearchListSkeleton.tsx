import CardListSkeleton from "../../skeleton/CardListSkeleton";

const SearchListSkeleton = () => {
  return (
    <div className="contents-container">
      <CardListSkeleton arrayRows={[0, 1]} />
      <CardListSkeleton arrayRows={[0, 1]} />
    </div>
  );
};

export default SearchListSkeleton;
