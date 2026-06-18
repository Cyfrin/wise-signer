"use client";

import { useEffect, useState } from 'react';
import { questions } from '@/data/questions';
import { cn } from '@/components/ui/cn';

interface ProgressComponentProps {
    currentQuestion: number;
}

interface QuestionResult {
    id: number;
    isCorrect: boolean;
}

const ProgressComponent = ({ currentQuestion }: ProgressComponentProps) => {
    const totalQuestions = questions.length;
    const [quizResults, setQuizResults] = useState<QuestionResult[]>([]);

    useEffect(() => {
        try {
            const resultsJSON = localStorage.getItem('quizResults');
            if (resultsJSON) {
                setQuizResults(JSON.parse(resultsJSON));
            }
        } catch (error) {
            console.error("Error loading quiz results:", error);
        }
    }, [currentQuestion]);

    const answered = quizResults.length;
    const correct = quizResults.filter(r => r.isCorrect).length;

    return (
        <div className="mx-auto max-w-4xl px-6 pt-8">
            <div className="mb-2.5 flex items-end justify-between">
                <span className="field-label">
                    Question{" "}
                    <span className="text-bone">
                        {String(currentQuestion).padStart(2, "0")}
                    </span>{" "}
                    / {totalQuestions}
                </span>
                <span className="field-label">
                    <span className="text-sign">{correct}</span> correct ·{" "}
                    {answered} answered
                </span>
            </div>

            <div className="flex w-full gap-1" aria-hidden="true">
                {questions.map((_, index) => {
                    const questionId = index + 1;
                    const result = quizResults.find(r => r.id === questionId);
                    const isCurrent = questionId === currentQuestion;

                    return (
                        <div
                            key={questionId}
                            className={cn(
                                "h-1.5 flex-1 rounded-full transition-colors",
                                result
                                    ? result.isCorrect
                                        ? "bg-sign"
                                        : "bg-reject"
                                    : isCurrent
                                        ? "bg-brand"
                                        : "bg-hairline",
                                isCurrent && !result && "ring-2 ring-brand/30",
                            )}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default ProgressComponent;
