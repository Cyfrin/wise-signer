"use client";

import { FaTimes } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import QuestionComponent from "./QuestionComponent";
import WalletPopupComponent from "./WalletPopupComponent";
import SimulatedWebsite from "./SimulatedWebsite";
import FeedbackComponent from "./FeedbackComponent";
import ProgressComponent from "./ProgressComponent";
import { FakeWebsiteType, TransactionDetails, SignatureDetails } from "@/types";
import { Button } from "@/components/ui/Button";
import { Erc8213Note } from "@/components/Erc8213Note";
import { calldataDigest } from "@/lib/erc8213";
import React, { forwardRef } from "react";

interface QuestionResult {
    id: number;
    isCorrect: boolean;
}

// Props for the PageRenderer component
interface PageRendererProps {
    questionNumber: number;
    question: string;
    options?: { id: string; text: string }[]; // Optional for signOrReject type
    correctAnswers?: string[]; // Optional for signOrReject type
    type: "multi" | "signOrReject";
    feedbackContent: {
        pages: string[];
    };
    nextPageUrl?: string;
    prevPageUrl?: string;
    // Optional props for simulated website
    fakeWebsiteType?: FakeWebsiteType;
    questionId?: number;
    // SignOrReject specific props
    onInteractWithWallet?: () => void;
    interactionButtonText?: string;
    expectedAction?: "sign" | "reject";
    walletType?: "metamask" | "safeWallet" | "trezor";
    // Transaction details for sign/reject questions
    transactionOrSignatureDetails?: TransactionDetails | SignatureDetails;
    wrongAnswerPopupContent?: string;
    questionContext?: string;
    // Indicate if this is the last question
    isLastQuestion?: boolean;
}

const PageRenderer = forwardRef((props: PageRendererProps, ref) => {
    const [showWalletPopup, setShowWalletPopup] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [showWrongAnswerPopup, setShowWrongAnswerPopup] = useState(false);
    const router = useRouter();

    // Refs for scrolling to feedback
    const feedbackRef = useRef<HTMLDivElement | null>(null);
    const questionComponentRef = useRef(null);

    // Extract common props
    const {
        questionNumber,
        question,
        type,
        feedbackContent,
        prevPageUrl,
        nextPageUrl,
        questionContext,
        isLastQuestion
    } = props;

    // Extract type-specific props
    const options = type === 'multi' ? props.options : [];
    const correctAnswers = type === 'multi' ? props.correctAnswers : [];
    const wrongAnswerPopupContent = 'wrongAnswerPopupContent' in props ? props.wrongAnswerPopupContent : undefined;
    const expectedAction = type === 'signOrReject' ? props.expectedAction : undefined;
    const walletType = type === 'signOrReject' ? props.walletType : undefined;
    const transactionOrSignatureDetails = type === 'signOrReject' ? props.transactionOrSignatureDetails : undefined;
    const fakeWebsiteType = 'fakeWebsiteType' in props ? props.fakeWebsiteType : undefined;
    const questionId = 'questionId' in props ? props.questionId : undefined;

    // ERC-8213 calldata digest, shown after answering transaction questions.
    const txCalldata =
        transactionOrSignatureDetails &&
        "data" in transactionOrSignatureDetails &&
        typeof transactionOrSignatureDetails.data === "string" &&
        transactionOrSignatureDetails.data.startsWith("0x") &&
        transactionOrSignatureDetails.data.length > 2
            ? (transactionOrSignatureDetails.data as `0x${string}`)
            : null;

    // Check localStorage and reset feedback when questionNumber changes
    useEffect(() => {
        checkQuestionAnsweredStatus();
        // Always reset feedback visibility when navigating to a new question.
        // This ensures that feedback from a previous question isn't shown
        // when loading a new question or returning to an already answered one.
        // Feedback is only shown after an explicit user action (e.g., answering).
        setShowFeedback(false);
    }, [questionNumber]);

    // Dismiss the wrong-answer popup with Escape
    useEffect(() => {
        if (!showWrongAnswerPopup) return;
        const onKey = (e: KeyboardEvent) =>
            e.key === "Escape" && setShowWrongAnswerPopup(false);
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [showWrongAnswerPopup]);

    // Scroll to feedback when it appears
    useEffect(() => {
        if (showFeedback && feedbackRef.current) {
            // Add a small delay to ensure DOM is updated
            setTimeout(() => {
                feedbackRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }, [showFeedback]);

    // Function to check if the current question has been answered
    const checkQuestionAnsweredStatus = () => {
        try {
            const existingResultsJSON = localStorage.getItem('quizResults');
            if (!existingResultsJSON) {
                // If no results yet, ensure states are reset for a fresh question
                setHasAnswered(false);
                setIsCorrect(false);
                return;
            }

            const results: QuestionResult[] = JSON.parse(existingResultsJSON);
            const existingResult = results.find(result => result.id === questionNumber);

            if (existingResult) {
                setHasAnswered(true);
                setIsCorrect(existingResult.isCorrect);
                // Feedback visibility is handled by the useEffect hook
            } else {
                // Reset states if no answer found for this specific question
                setHasAnswered(false);
                setIsCorrect(false);
            }
        } catch (error) {
            console.error("Error checking question status:", error);
        }
    };

    const handlePrevQuestion = () => {
        if (prevPageUrl) {
            // No longer reset feedback here
            router.push(prevPageUrl);
        }
    };

    const handleNextQuestion = () => {
        if (isLastQuestion) {
            router.push('/simulated/quiz-summary');
        } else if (nextPageUrl) {
            // No longer reset feedback here
            router.push(nextPageUrl);
        }
    };

    const handleSignInClick = () => {
        setShowWalletPopup(true);
    };

    const saveQuestionResult = (id: number, correct: boolean) => { // Renamed parameter to avoid shadowing
        try {
            const existingResultsJSON = localStorage.getItem('quizResults');
            let results: QuestionResult[] = existingResultsJSON ? JSON.parse(existingResultsJSON) : [];
            const existingResultIndex = results.findIndex(result => result.id === id);

            if (existingResultIndex >= 0) {
                results[existingResultIndex].isCorrect = correct;
            } else {
                results.push({ id, isCorrect: correct });
            }
            localStorage.setItem('quizResults', JSON.stringify(results));
        } catch (error) {
            console.error("Error saving quiz results to localStorage:", error);
        }
    };

    const handleWalletAction = (action: "sign" | "reject") => {
        setShowWalletPopup(false);

        if (type === "signOrReject" && expectedAction) {
            const isActionCorrect = action === expectedAction;
            setIsCorrect(isActionCorrect);
            setShowFeedback(true); // Show feedback after the wallet action
            setHasAnswered(true);
            saveQuestionResult(questionNumber, isActionCorrect);

            if (!isActionCorrect && wrongAnswerPopupContent) {
                setShowWrongAnswerPopup(true);
            }
        }
    };

    const handleRetry = () => {
        setShowFeedback(false);
        setHasAnswered(false);
        setIsCorrect(false);
        // Note: This does not clear the localStorage result, allowing users to retry for UI feedback
        // but their last saved answer remains unless they answer correctly again.
    };

    return (
        <div className="relative min-h-screen bg-ink pb-20">
            <div className="w-full">
                <ProgressComponent currentQuestion={questionNumber} />

                <QuestionComponent
                    ref={questionComponentRef}
                    question={question}
                    options={options}
                    correctAnswers={correctAnswers}
                    type={type}
                    feedbackContent={feedbackContent}
                    onPrevQuestion={prevPageUrl ? handlePrevQuestion : undefined}
                    onNextQuestion={handleNextQuestion}
                    questionContext={questionContext}
                    onInteractWithWallet={type === "signOrReject" ? handleSignInClick : undefined}
                    hasAnswered={hasAnswered}
                    isCorrect={isCorrect}
                    showFeedback={showFeedback}
                    onRetry={handleRetry}
                    onCheckAnswer={(isAnswerCorrect) => {
                        setIsCorrect(isAnswerCorrect);
                        setShowFeedback(true);
                        setHasAnswered(true);
                        saveQuestionResult(questionNumber, isAnswerCorrect);
                    }}
                    feedbackRef={feedbackRef}
                />

                {type === "signOrReject" && showFeedback && (
                    <div ref={feedbackRef} className="mx-auto mt-8 max-w-4xl px-6">
                        <FeedbackComponent
                            isCorrect={isCorrect}
                            feedbackContent={feedbackContent}
                        />
                        {txCalldata && (
                            <Erc8213Note
                                label="Calldata Digest"
                                digest={calldataDigest(txCalldata)}
                            />
                        )}
                    </div>
                )}

                {fakeWebsiteType && questionId && (
                    <SimulatedWebsite
                        fakeWebsiteType={fakeWebsiteType}
                        questionId={questionId}
                        primaryButtonText={props.interactionButtonText || "Sign in with Ethereum"}
                        onPrimaryButtonClick={handleSignInClick}
                        buttonDisabled={false}
                    />
                )}
            </div>

            {showWalletPopup && type === "signOrReject" && transactionOrSignatureDetails && (
                <WalletPopupComponent
                    isOpen={showWalletPopup}
                    walletType={walletType!}
                    onClose={() => setShowWalletPopup(false)}
                    onConfirm={() => handleWalletAction("sign")}
                    onReject={() => handleWalletAction("reject")}
                    transactionOrSignatureDetails={transactionOrSignatureDetails}
                />
            )}

            {showWalletPopup && type !== "signOrReject" && transactionOrSignatureDetails && (
                <WalletPopupComponent
                    isOpen={showWalletPopup}
                    walletType="metamask" // Default or pass as prop if needed for non-signOrReject
                    onClose={() => setShowWalletPopup(false)}
                    onConfirm={() => {
                        console.log("Transaction confirmed for non-signOrReject");
                        setShowWalletPopup(false);
                    }}
                    onReject={() => {
                        console.log("Transaction rejected for non-signOrReject");
                        setShowWalletPopup(false);
                    }}
                    transactionOrSignatureDetails={transactionOrSignatureDetails}
                />
            )}

            {showWrongAnswerPopup && wrongAnswerPopupContent && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setShowWrongAnswerPopup(false)}
                >
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                    <div
                        className="relative z-10 w-full max-w-md overflow-hidden rounded-xl border border-reject/40 bg-surface shadow-2xl shadow-black/50"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start gap-3 border-b border-reject/20 bg-reject/10 px-6 py-4">
                            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-reject/15 text-reject">
                                <FaTimes size={15} />
                            </span>
                            <div>
                                <p className="font-display font-semibold text-reject">
                                    You signed something you shouldn&apos;t have
                                </p>
                                <p className="mt-1 text-sm leading-relaxed text-bone-dim">
                                    {wrongAnswerPopupContent}
                                </p>
                            </div>
                        </div>
                        <div className="p-4">
                            <Button
                                variant="reject"
                                onClick={() => setShowWrongAnswerPopup(false)}
                                className="w-full"
                            >
                                I understand
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

PageRenderer.displayName = "PageRenderer";

export default PageRenderer;