"use client";

import { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaCheck, FaTimes } from "react-icons/fa";
import markdownComponents from "@/components/MarkdownComponents";
import ReactMarkdown from "react-markdown";
import { cn } from "@/components/ui/cn";

interface FeedbackContent {
  pages: string[];
}

interface FeedbackComponentProps {
  isCorrect: boolean;
  feedbackContent: FeedbackContent;
  initialPage?: number;
  className?: string;
}

const FeedbackComponent: React.FC<FeedbackComponentProps> = ({
  isCorrect,
  feedbackContent,
  initialPage = 1,
  className = "",
}) => {
  const [feedbackPage, setFeedbackPage] = useState(initialPage);
  const totalPages = feedbackContent.pages.length;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-surface",
        isCorrect ? "border-sign/40" : "border-reject/40",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 border-b px-6 py-4",
          isCorrect
            ? "border-sign/20 bg-sign/10"
            : "border-reject/20 bg-reject/10",
        )}
      >
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
            isCorrect ? "bg-sign/15 text-sign" : "bg-reject/15 text-reject",
          )}
        >
          {isCorrect ? <FaCheck size={15} /> : <FaTimes size={15} />}
        </span>
        <div>
          <h3
            className={cn(
              "font-display text-base font-semibold",
              isCorrect ? "text-sign" : "text-reject",
            )}
          >
            {isCorrect ? "Correct" : "Not quite"}
          </h3>
          <p className="text-xs text-muted">Here&apos;s what to notice</p>
        </div>
      </div>

      <div className="px-6 py-5">
        <ReactMarkdown components={markdownComponents}>
          {feedbackContent.pages[feedbackPage - 1]}
        </ReactMarkdown>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-hairline px-6 py-3">
          <span className="field-label">
            {feedbackPage} / {totalPages}
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => setFeedbackPage((p) => Math.max(1, p - 1))}
              disabled={feedbackPage === 1}
              aria-label="Previous page"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-hairline text-bone-dim transition-colors hover:bg-raised hover:text-bone disabled:pointer-events-none disabled:opacity-40"
            >
              <FaChevronLeft size={12} />
            </button>
            <button
              onClick={() => setFeedbackPage((p) => Math.min(totalPages, p + 1))}
              disabled={feedbackPage === totalPages}
              aria-label="Next page"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-hairline text-bone-dim transition-colors hover:bg-raised hover:text-bone disabled:pointer-events-none disabled:opacity-40"
            >
              <FaChevronRight size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackComponent;
