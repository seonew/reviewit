import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, useEffect, useState } from "react";
import { XCircleIcon } from "@heroicons/react/20/solid";

type Props = {
  onSubmit: (keyword: string) => void;
  keyword?: string;
};

const HeaderSearchBox = ({ onSubmit, keyword }: Props) => {
  const [inputValue, setInputValue] = useState("");

  const handleChangeItem = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const value = inputValue.trim();
    if (value.length === 0) {
      return;
    }

    onSubmit(inputValue);
  };

  const handleClickReset = () => {
    setInputValue("");
  };

  useEffect(() => {
    setInputValue(keyword ?? "");
  }, [keyword]);

  return (
    <div className="relative flex flex-col h-full grow shrink basis-0">
      <div className="w-full flex justify-cetner">
        <div className="w-full inline-flex items-center px-3.5 h-9 border border-gray-500 rounded-sm">
          <span className="inline-block align-middle pr-1.5 text-gray-400">
            <button
              type="submit"
              onClick={handleSubmit}
              className="py-2"
              aria-label="SearchButton"
            >
              <MagnifyingGlassIcon className="w-6 h-6 stroke-2" />
            </button>
          </span>
          <input
            type="text"
            className="inline-block align-middle pr-1.5 leading-6 w-full h-8 outline-none bg-black text-white"
            onChange={handleChangeItem}
            onKeyDown={handleKeyDown}
            value={inputValue}
            aria-label="SearchInput"
          />
          <div className="flex items-center py-2 w-6 h-6">
            {inputValue !== "" && (
              <button
                type="submit"
                onClick={handleClickReset}
                className="inline-block align-middle text-gray-400"
                aria-label="ResetButton"
              >
                <XCircleIcon className="w-6 h-6 stroke-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSearchBox;
