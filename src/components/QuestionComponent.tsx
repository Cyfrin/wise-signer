"use client";

import { useState, useEffect, forwardRef } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaRedo,
  FaCheck,
  FaTimes,
  FaArrowDown,
} from "react-icons/fa";
import FeedbackComponent from "./FeedbackComponent";
import ReactMarkdown from "react-markdown";
import markdownComponents from "@/components/MarkdownComponents";
import { Button } from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";

interface Option {
  id: string;
  text: string;
}

interface FeedbackContent {
  pages: string[];
}

interface QuestionProps {
  question: string;
  options?: Option[];
  correctAnswers?: string[];
  type: "multi" | "signOrReject";
  feedbackContent: FeedbackContent;
  onNextQuestion?: () => void;
  onPrevQuestion?: () => void;
  showNavigationButtons?: boolean;
  onInteractWithWallet?: () => void;
  expectedAction?: "sign" | "reject";
  wrongAnswerPopupContent?: string;
  questionContext?: string;
  hasAnswered?: boolean;
  isCorrect?: boolean;
  onCheckAnswer?: (isCorrect: boolean) => void;
  showFeedback?: boolean;
  onRetry?: () => void;
  feedbackRef?: React.Ref<HTMLDivElement>;
}

const QuestionComponent = forwardRef<HTMLDivElement, QuestionProps>(
  (
    {
      question,
      options = [],
      correctAnswers = [],
      type,
      feedbackContent,
      onNextQuestion,
      onPrevQuestion,
      showNavigationButtons = true,
      onInteractWithWallet,
      questionContext,
      hasAnswered: externalHasAnswered,
      isCorrect: externalIsCorrect,
      onCheckAnswer,
      showFeedback: externalShowFeedback,
      onRetry,
      feedbackRef,
    },
    _ref,
  ) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [internalShowFeedback, setInternalShowFeedback] = useState(false);
    const hasAnswered = externalHasAnswered ?? false;
    const isCorrect = externalIsCorrect ?? false;
    const showFeedback = externalShowFeedback ?? internalShowFeedback;

    useEffect(() => {
      setSelectedOptions([]);
      setInternalShowFeedback(false);
    }, [question]);

    const toggleOption = (optionId: string) => {
      if (hasAnswered && !onRetry) return;
      setSelectedOptions((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId],
      );
    };

    const checkAnswer = () => {
      if (type === "signOrReject") {
        onInteractWithWallet?.();
        return;
      }
      const isEqual =
        selectedOptions.length === correctAnswers.length &&
        correctAnswers.every((item) => selectedOptions.includes(item));
      onCheckAnswer?.(isEqual);
      setInternalShowFeedback(true);
    };

    const handleRetry = () => {
      setSelectedOptions([]);
      onRetry?.();
    };

    const optionState = (optionId: string) => {
      const selected = selectedOptions.includes(optionId);
      const isAnswer = correctAnswers.includes(optionId);

      if (!hasAnswered) {
        return {
          box: selected
            ? "border-brand bg-brand/10 text-bone"
            : "border-hairline bg-surface text-bone-dim hover:border-hairline-strong hover:bg-raised",
          marker: selected
            ? "border-brand bg-brand text-white"
            : "border-hairline-strong text-transparent",
          icon: selected ? <FaCheck size={10} /> : null,
        };
      }
      if (isAnswer && selected)
        return {
          box: "border-sign bg-sign/10 text-bone",
          marker: "border-sign bg-sign text-ink",
          icon: <FaCheck size={10} />,
        };
      if (isAnswer && !selected)
        return {
          box: "border-sign/40 bg-sign/5 text-bone-dim",
          marker: "border-sign/50 text-sign",
          icon: <FaCheck size={10} />,
        };
      if (!isAnswer && selected)
        return {
          box: "border-reject bg-reject/10 text-bone",
          marker: "border-reject bg-reject text-white",
          icon: <FaTimes size={10} />,
        };
      return {
        box: "border-hairline bg-surface text-faint",
        marker: "border-hairline text-transparent",
        icon: null,
      };
    };

    return (
      <div className="mx-auto max-w-4xl px-6 py-8">
        <h1 className="font-display text-2xl font-semibold leading-snug text-bone">
          {question}
        </h1>

        {questionContext && (
          <div className="mt-4">
            <ReactMarkdown components={markdownComponents}>
              {questionContext}
            </ReactMarkdown>
          </div>
        )}

        {type === "signOrReject" && !hasAnswered && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-hairline bg-surface px-4 py-3 text-sm text-muted">
            <FaArrowDown size={13} className="shrink-0 text-brand" />
            Inspect the site below, then make your call in the wallet popup.
          </div>
        )}

        {type !== "signOrReject" && (
          <>
            <p className="field-label mt-8 mb-3">Select all that apply</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {options.map((option) => {
                const s = optionState(option.id);
                return (
                  <button
                    key={option.id}
                    onClick={() => toggleOption(option.id)}
                    disabled={hasAnswered && !onRetry}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border p-4 text-left text-sm leading-relaxed transition-colors",
                      !hasAnswered && "cursor-pointer",
                      s.box,
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                        s.marker,
                      )}
                    >
                      {s.icon}
                    </span>
                    <span className="flex-1">
                      <span className="mr-2 font-mono text-xs text-muted">
                        {option.id}
                      </span>
                      {option.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {showNavigationButtons && (
          <div className="mt-8 flex items-center justify-between gap-4">
            <div>
              {onPrevQuestion && (
                <Button variant="secondary" onClick={onPrevQuestion}>
                  <FaChevronLeft size={12} /> Previous
                </Button>
              )}
            </div>

            <div className="flex gap-3">
              {hasAnswered && onRetry && (
                <Button variant="ghost" onClick={handleRetry}>
                  <FaRedo size={12} /> Try again
                </Button>
              )}

              {!hasAnswered && type !== "signOrReject" && (
                <Button
                  variant="primary"
                  onClick={checkAnswer}
                  disabled={selectedOptions.length === 0}
                >
                  Check answer
                </Button>
              )}

              {hasAnswered && onNextQuestion && (
                <Button variant="primary" onClick={onNextQuestion}>
                  Next <FaChevronRight size={12} />
                </Button>
              )}
            </div>
          </div>
        )}

        {type !== "signOrReject" && showFeedback && (
          <div ref={feedbackRef} className="mt-8">
            <FeedbackComponent
              isCorrect={isCorrect}
              feedbackContent={feedbackContent}
            />
          </div>
        )}
      </div>
    );
  },
);

QuestionComponent.displayName = "QuestionComponent";

export default QuestionComponent;
