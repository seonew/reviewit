import Link from "next/link";
import { Children, ReactNode } from "react";
import Empty from "./Empty";

type Props = {
  title: string;
  color?: string;
  children: ReactNode;
  targetUrl?: string;
  gridColsCSS?: string;
};

const CardList = ({
  title,
  color,
  children,
  targetUrl,
  gridColsCSS = "grid-cols-5",
}: Props) => {
  return (
    <div className="card-list">
      {Children.count(children) > 0 ? (
        <>
          <div className="py-5 flex items-center justify-between">
            <h2 className={`text-xl font-bold ${color ?? "text-gray-900"}`}>
              {title}
            </h2>
            {targetUrl && (
              <div className="flex items-center ml-3">
                <Link href={targetUrl}>
                  <span className="font-bold">더보기</span>
                </Link>
              </div>
            )}
          </div>
          <div className="m-0 p-0">
            <div className={`grid ${gridColsCSS} gap-18-px`}>{children}</div>
          </div>
        </>
      ) : (
        <Empty title={title} message={"추가된 아이템이 없어요 ㅜ.ㅜ"} />
      )}
    </div>
  );
};

export default CardList;
