type Props = {
  onClick: (item: boolean) => void;
};

const PreferenceSection = ({ onClick }: Props) => {
  const handleSubmitLike = (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = !!parseInt(e.target.value);
    onClick(result);
  };

  return (
    <div className="px-9">
      <legend className="text-sm font-semibold leading-6 text-gray-900">
        콘텐츠에 대한 선호도를 선택해 주세요.
      </legend>
      <div className="mt-3 mb-5 flex items-center">
        <div className="flex items-center gap-x-2 mr-8">
          <input
            id="like"
            name="like-section"
            type="radio"
            defaultChecked
            value={1}
            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
            onChange={handleSubmitLike}
          />
          <label
            htmlFor="like"
            className="block text-sm font-medium leading-4 text-gray-900"
          >
            좋아요
          </label>
        </div>
        <div className="flex items-center gap-x-2">
          <input
            id="dis-like"
            name="like-section"
            type="radio"
            value={0}
            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
            onChange={handleSubmitLike}
          />
          <label
            htmlFor="dis-like"
            className="block text-sm font-medium leading-4 text-gray-900"
          >
            싫어요
          </label>
        </div>
      </div>
    </div>
  );
};

export default PreferenceSection;
