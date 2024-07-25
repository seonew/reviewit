import React, { ReactNode } from "react";

type GridRowProps = {
  name: string;
  content?: string | number;
  children?: ReactNode;
};

interface Props {
  id: string;
  titleData: { title: string; originalTitle?: string; tagline?: string };
  subRowData: GridRowProps[];
}

const Contents = ({ id, titleData, subRowData }: Props) => {
  const { title, originalTitle, tagline } = titleData;

  return (
    <div className="relative ml-14 float-left w-2/3 text-white">
      <div className="break-words">
        <h3 className="text-3xl leading-10 font-bold text-ellipsis">{title}</h3>
        {originalTitle && <div>{originalTitle}</div>}
        {tagline && <div className="pt-5">{tagline}</div>}
      </div>
      <div className="pt-8 pb-10">
        {subRowData.map((row, index) => {
          if (row.children) {
            return (
              <GridRow key={`${id}${index}`} name={row.name}>
                {row.children}
              </GridRow>
            );
          }

          return (
            <GridRow
              key={`${id}${index}`}
              name={row.name}
              content={row.content}
            />
          );
        })}
      </div>
    </div>
  );
};

const GridRow = ({ name, content, children }: GridRowProps) => {
  return (
    <div className="flex">
      <div className="grow-0 w-20 movie-info-description">{name}</div>
      <div className="grow">{children ?? <div>{content}</div>}</div>
    </div>
  );
};

export default Contents;
