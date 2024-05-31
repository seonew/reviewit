import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { validateContentEditable } from "@/utils/common";
import { useBoundStore as useStore } from "@/store";

type Props = {
  content?: string;
  onClick?: (item: string) => void;
};

const CommentTextEditor = ({ content, onClick }: Props) => {
  const { setAlertModalData, checkLoginStatus } = useStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isInput, setIsInput] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(false);

  const handleFocus = () => {
    setIsReadOnly(false);
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = async (e: ChangeEvent<HTMLTextAreaElement>) => {
    const isLogin = await checkLoginStatus();
    if (!isLogin) {
      setIsReadOnly(true);
      return;
    }

    const current = e.target.value;
    changeIsInput(current);
  };

  const handleSubmit = (e: MouseEvent) => {
    e.preventDefault();
    const review = textareaRef.current?.value;

    if (review) {
      const result = validateContentEditable(review);
      if (result !== null) {
        setAlertModalData(true, result, handleFocus);
        return;
      }

      onClick?.(review);

      if (textareaRef.current) {
        textareaRef.current.value = "";
      }
      setIsInput(false);
      setIsFocused(false);
      setCharCount(0);
    }
  };

  const changeIsInput = (current: string | null) => {
    const length = current?.trim().length;
    if (!current || length === 0) {
      setIsInput(false);
    } else {
      setIsInput(true);
    }

    if (current && length) {
      setCharCount(current.length);
    } else {
      setCharCount(0);
    }
  };

  useEffect(() => {
    const current = textareaRef.current;
    if (content !== undefined && current !== null && current !== undefined) {
      current.value = content;
      setCharCount(content.length);
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
            <textarea
              ref={textareaRef}
              className="comment-editor-contents-editable"
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              readOnly={isReadOnly}
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
          {charCount > 0 && (
            <div
              className={`relative bottom-0 right-12 text-right text-xs ${
                charCount > 400 ? "text-red-600" : "text-gray-600"
              }`}
            >
              <span className="text-right">{charCount}/400</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentTextEditor;
