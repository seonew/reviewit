import CardListSkeleton from "@/app/components/skeleton/CardListSkeleton";

const MypageSkeleton = () => {
  const array = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className="contents-container">
      <div className="flex items-start">
        <div className="w-1/4 min-w-200 animate-pulse">
          {/* UserInfo */}
          <div className="relative pt-12 pb-6 w-full">
            <div className="basic-border rounded pt-10 px-9 pb-6 shadow-sm h-[350px]">
              <div className="relative flex flex-col w-full ">
                <div className="flex justify-center mx-2 mb-4">
                  <div className="rounded-full bg-slate-200 h-24 w-24"></div>
                </div>
                <div className="float-left">
                  <div className="flex flex-col">
                    <div className="space-y-5 mt-6">
                      <div className="h-3 bg-slate-200 rounded"></div>
                      <div className="h-3 bg-slate-200 rounded"></div>
                      <div className="h-3 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* // UserInfo */}
        </div>
        <div className="w-12"></div>
        <div className="w-10/12 pt-6 pl-2 overflow-hidden">
          <CardListSkeleton arrayRows={[0, 1]} arrayCols={[0, 1, 2, 3]} />
          <CardListSkeleton arrayRows={[0, 1]} arrayCols={[0, 1, 2, 3]} />
        </div>
      </div>
    </div>
  );
};

export default MypageSkeleton;
