import Link from "next/link";
import { ReactNode } from "react";
import Empty from "./Empty";

type Props = {
  title: string;
  color?: string;
  children: ReactNode;
  targetUrl?: string;
};

const CardList = ({ title, color, children, targetUrl }: Props) => {
  return (
    <div className="card-list">
      {(children as Array<ReactNode>).length > 0 ? (
        <>
          <div className="py-5 flex items-center justify-between">
            <h2 className={`text-xl font-bold ${color ?? "text-naver-green"}`}>
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
            <div className="grid grid-cols-5 gap-18-px">{children}</div>
          </div>
        </>
      ) : (
        <Empty title={title} message={"추가된 아이템이 없어요 ㅜ.ㅜ"} />
      )}
    </div>
  );
};

export default CardList;
