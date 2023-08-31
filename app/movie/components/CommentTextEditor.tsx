import {
  ChangeEvent,
  ClipboardEvent,
  MouseEvent,
  useRef,
  useState,
} from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";

type Props = {
  onClick?: (item: string) => void;
};

const CommentTextEditor = ({ onClick }: Props) => {
  const editableDiv = useRef<HTMLDivElement>(null);
  const [isInput, setIsInput] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const clipboardData = e.clipboardData?.getData("text");
    if (!clipboardData) {
      return;
    }

    const selection = window.getSelection();
    if (!selection) {
      return;
    }
    if (selection && !selection.rangeCount) {
      return;
    }
    selection.deleteFromDocument();
    selection.getRangeAt(0).insertNode(document.createTextNode(clipboardData));
    selection.collapseToEnd();

    const current = e.currentTarget.textContent;
    changeIsInput(current);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e: ChangeEvent<HTMLDivElement>) => {
    const current = e.currentTarget.textContent;
    changeIsInput(current);
  };

  const handleSubmit = (e: MouseEvent) => {
    e.preventDefault();
    const review = editableDiv.current?.textContent;

    if (review) {
      onClick?.(review);

      editableDiv.current.innerText = "";
      setIsInput(false);
      setIsFocused(false);
    }
  };

  const changeIsInput = (current: string | null) => {
    const length = current?.trim().length;
    if (!current || length === 0) {
      setIsInput(false);
    } else {
      setIsInput(true);
    }
  };

  return (
    <div className="mt-2 mb-10 pl-9 items-center flex">
      <div className="relative flex items-center">
        <UserCircleIcon className="content-detail-comment-user-icon text-gray-300 top-2" />
        <div
          className={`basic-border block rounded py-1.5 box-border ${
            isFocused && "border-ozip-blue"
          }`}
        >
          <div className="inline-flex rounded border-0 items-start w-full px-3.5 text-sm">
            <div
              ref={editableDiv}
              contentEditable="true"
              className="inline-block p-0 text-black w-1100 grow shrink-0 basis-0 outline-none break-words"
              onPaste={handlePaste}
              onInput={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <div className="ml-2 flex items-center py-2 px-0 font-semibold">
              <button
                type="submit"
                onClick={handleSubmit}
                className="disabled:text-gray-300 disabled:font-normal text-ozip-blue"
                disabled={isInput ? false : true}
              >
                입력
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentTextEditor;
