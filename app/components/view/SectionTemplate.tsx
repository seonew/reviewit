import { ReactNode } from "react";

type Props = {
  title: string;
  children?: ReactNode;
};

const SectionTemplate = ({ title, children }: Props) => {
  return (
    <div className="content-detail-section">
      <section>
        <p className="content-detail-title-p">{title}</p>
        <div className="relative">{children}</div>
      </section>
    </div>
  );
};

export default SectionTemplate;
