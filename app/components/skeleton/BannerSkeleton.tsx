import DefaultImage from "@/app/components/DefaultImage";

const BannerSkeleton = () => {
  const array = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="banner-container ">
      <div className="relative pt-24 ml-16 z-10 animate-pulse">
        <div className="float-left w-52 h-80">
          <DefaultImage size="w-52 h-80" />
        </div>
      </div>
      <div className="relative ml-14 float-left w-2/3 animate-pulse">
        <div className="flex-1 space-y-6 py-1">
          <div className="grid grid-cols-6 gap-4">
            <div className="h-8 bg-slate-200 rounded col-span-4"></div>
          </div>
          <div className="grid grid-cols-6 gap-4 ">
            <div className="h-2 bg-slate-200 rounded col-span-4"></div>
          </div>
          <div className="grid grid-cols-6 gap-4 ">
            <div className="h-2.5 bg-slate-200 rounded col-span-4"></div>
          </div>

          <div className="space-y-3">
            {array.map((_, index) => (
              <div className="grid grid-cols-6 gap-4 py-0.5" key={index}>
                <div className="h-2.5 bg-slate-200 rounded col-span-1"></div>
                <div className="h-2.5 bg-slate-200 rounded col-span-3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="banner-background opacity-50"></div>
    </div>
  );
};

export default BannerSkeleton;
