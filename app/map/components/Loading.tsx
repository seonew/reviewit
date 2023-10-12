const Loading = () => {
  const array = [0, 1, 2, 3, 4];
  return (
    <div className="relative top-8">
      <div className="pb-10 animate-pulse">
        <div className="pb-5">
          <div className="flex items-center mb-4">
            <div className="w-full h-10 bg-slate-200 rounded"></div>
          </div>
          <div className="w-full h-96 bg-slate-200 rounded"></div>
        </div>

        <ul role="list" className="divide-y divide-gray-100 break-words">
          {array.map((item, index) => (
            <li className="flex justify-between py-4" key={index}>
              <div className="rounded-md w-full mx-auto">
                <div className="flex gap-x-6">
                  <div className="flex-1 space-y-6 py-1">
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-3 bg-slate-200 rounded col-span-2"></div>
                        <div className="h-3 bg-slate-200 rounded col-span-1"></div>
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
