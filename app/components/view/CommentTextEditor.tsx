import {
  ChangeEvent,
  ClipboardEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";

type Props = {
  content?: string;
  onClick?: (item: string) => void;
};

const CommentTextEditor = ({ content, onClick }: Props) => {
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
    if (!current ?? length === 0) {
      setIsInput(false);
    } else {
      setIsInput(true);
    }
  };

  useEffect(() => {
    const current = editableDiv.current;
    if (content !== undefined && current !== null && current !== undefined) {
      current.innerHTML = content;
    }
  }, [content]);

  return (
    <div className="comment-editor-container">
      <div className="comment-editor-container-div">
        <UserCircleIcon className="content-detail-comment-user-icon text-gray-300 top-2" />
        <div
          className={`comment-editor-contents-border ${
            isFocused ? "border-ozip-blue" : ""
          }`}
        >
          <div className="comment-editor-contents">
            <div
              ref={editableDiv}
              contentEditable="true"
              className="comment-editor-contents-editable"
              onPaste={handlePaste}
              onInput={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <div className="comment-editor-contents-button-container">
              <button
                type="submit"
                onClick={handleSubmit}
                className="comment-editor-contents-button"
                disabled={!!!isInput}
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
