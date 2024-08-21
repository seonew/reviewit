import CardListSkeleton from "@/app/components/skeleton/CardListSkeleton";

const MainSkeleton = () => {
  const array = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className="contents-container">
      <div className="relative h-[500px] min-w-1024 my-10 animate-pulse">
        <div className="absolute left-0 right-0 bottom-0 flex flex-col justify-end h-[160px] w-[800px] px-10 pb-10 z-10">
          <div className="text-white text-3xl leading-10 font-bold text-ellipsis pb-4">
            <div className="grid grid-cols-6 gap-4">
              <div className="h-8 bg-slate-300 rounded col-span-5"></div>
            </div>
          </div>
          <div className="text-white text-sm leading-5 text-ellipsis break-keep">
            <div className="grid grid-cols-6 gap-4">
              <div className="h-2 bg-slate-300 rounded col-span-5"></div>
              <div className="h-2 bg-slate-300 rounded col-span-5"></div>
            </div>
          </div>
        </div>
        <div className="absolute bg-slate-200 w-full h-full bottom-0 rounded"></div>
      </div>
      <CardListSkeleton arrayRows={array} />
    </div>
  );
};

export default MainSkeleton;
