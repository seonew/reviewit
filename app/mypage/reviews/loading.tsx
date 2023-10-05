import { PhotoIcon } from "@heroicons/react/24/outline";

const Loading = () => {
  const array = [0, 1, 2, 3, 4];
  return (
    <div className="contents-container">
      <div className="pb-10 animate-pulse ">
        <div className="flex h-12 items-center mb-4">
          <div className="grid grid-cols-2 gap-5 w-52">
            <div className="h-3 bg-slate-200 rounded col-span-1"></div>
            <div className="h-3 bg-slate-200 rounded col-span-1"></div>
          </div>
        </div>
        <div className="py-5 flex w-52">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-4 bg-slate-200 rounded"></div>
          </div>
        </div>
        <ul role="list" className="divide-y divide-gray-100 break-words">
          {array.map((item, index) => (
            <li className="flex justify-between py-4" key={index}>
              <div className="rounded-md w-full mx-auto">
                <div className="flex gap-x-6">
                  <div className="flex-shrink-0 overflow-hidden ">
                    <div
                      className={`flex items-center justify-center rounded bg-slate-200 h-20 w-14`}
                    >
                      <span className="text-neutral-400">
                        <PhotoIcon className="w-8 h-8" />
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-6 py-1">
                    <div className="h-2 bg-slate-200 rounded"></div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                        <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                      </div>
                      <div className="h-2 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Loading;
