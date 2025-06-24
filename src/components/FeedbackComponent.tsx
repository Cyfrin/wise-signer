"use client";

import { useState } from "react";
import { FaLightbulb, FaChevronLeft, FaChevronRight, FaCheck } from "react-icons/fa";
import markdownComponents from "@/components/MarkdownComponents";
import ReactMarkdown from 'react-markdown';


interface FeedbackContent {
    pages: string[];
}

interface FeedbackComponentProps {
    isCorrect: boolean;
    feedbackContent: FeedbackContent;
    initialPage?: number; // Optional prop to set which page to start on
    className?: string; // Optional additional CSS classes
}

const FeedbackComponent: React.FC<FeedbackComponentProps> = ({
    isCorrect,
    feedbackContent,
    initialPage = 1,
    className = ""
}) => {
    const [feedbackPage, setFeedbackPage] = useState(initialPage);

    // Navigation for feedback pages
    const nextFeedbackPage = () => {
        if (feedbackPage < feedbackContent.pages.length) {
            setFeedbackPage(feedbackPage + 1);
        }
    };

    const prevFeedbackPage = () => {
        if (feedbackPage > 1) {
            setFeedbackPage(feedbackPage - 1);
        }
    };


    return (
        <div className={`${isCorrect ? 'bg-green-100 border-green-500' : 'bg-red-50 border-red-200'} border rounded-lg p-6 ${className}`}>
            <div className="flex items-start">
                {isCorrect ? (
                    <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                ) : (
                    <FaLightbulb className="text-yellow-500 mt-1 flex-shrink-0" />
                )}
                <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        That's {isCorrect ? "correct" : "incorrect"}. Let's see why:
                    </h3>

                    <div className="mt-2 text-gray-700">
                        <div>
                            <ReactMarkdown components={markdownComponents}>
                                {feedbackContent.pages[feedbackPage - 1]}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>

            {/* Only show pagination if there are multiple pages */}
            {feedbackContent.pages.length > 1 && (
                <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                        Page {feedbackPage} of {feedbackContent.pages.length}
                    </span>

                    <div className="flex space-x-2">
                        {feedbackPage > 1 && (
                            <button
                                onClick={prevFeedbackPage}
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                            >
                                <FaChevronLeft />
                            </button>
                        )}

                        {feedbackPage < feedbackContent.pages.length && (
                            <button
                                onClick={nextFeedbackPage}
                                className="px-3 py-1 bg-blue-600 rounded-md text-sm text-white hover:bg-blue-700 cursor-pointer"
                            >
                                <FaChevronRight />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedbackComponent;