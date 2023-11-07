import Image from "next/image";
import Link from "next/link";
import Card from "@/app/components/Card";
import { MovieProps } from "@/types";

const MovieInfo = ({
  item: { title, posterImage, link, releaseDate },
}: {
  item: MovieProps;
}) => {
  return (
    <div className="flex flex-col w-full min-w-0">
      {link && (
        <Link href={link}>
          <Card width="w-52" height="h-52">
            {posterImage && (
              <Image
                src={posterImage}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{
                  objectFit: "contain",
                }}
              />
            )}
          </Card>
          <div className="mt-2.5 text-sm font-normal min-w-0 break-keep break-words">
            <div className="overflow-hidden ">
              <span className="text-ozip-blue font-bold">{title}</span>
              <div className="overflow-hidden block">
                <span className="text-xs">
                  <span>{releaseDate}</span>
                </span>
              </div>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
};

export default MovieInfo;
