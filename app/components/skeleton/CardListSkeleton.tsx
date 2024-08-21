import Card from "@/app/components/Card";

type Props = {
  arrayRows: Array<number>;
  arrayCols?: Array<number>;
};

const CardListSkeleton = ({
  arrayRows,
  arrayCols = [0, 1, 2, 3, 4],
}: Props) => {
  return (
    // <div className="card-list">
    <div className="pb-10 min-w-800">
      <div className="pb-10 animate-pulse">
        <div className="py-5 flex w-56">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-4 bg-slate-200 rounded"></div>
          </div>
        </div>
        <ul role="list">
          {arrayRows.map((index) => (
            <li className="justify-between py-4" key={index}>
              <div className="m-0 p-0">
                <div className={`grid grid-cols-${arrayCols.length} gap-18-px`}>
                  {arrayCols.map((index) => {
                    return (
                      <Card key={index} height="h-52" color="bg-slate-200">
                        <div></div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CardListSkeleton;
