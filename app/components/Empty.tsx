type Props = {
  title: string;
  color?: string;
  message: string;
};

const Empty = ({ title, color, message }: Props) => {
  return (
    <div>
      <div className="py-5 flex items-center justify-between">
        <h2 className={`text-xl font-bold ${color ?? "text-naver-green"}`}>
          {title}
        </h2>
      </div>
      <div className="h-44">
        <div className="flex justify-center items-center h-full bg-gray-100 rounded-lg">
          {message}
        </div>
      </div>
    </div>
  );
};

export default Empty;
