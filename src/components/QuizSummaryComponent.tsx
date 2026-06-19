"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { FaXTwitter } from "react-icons/fa6";
import { FaRedo, FaArrowRight } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/components/ui/cn";

interface QuizResult {
  id: number;
  isCorrect: boolean;
}

interface QuizSummaryProps {
  onRestartQuiz: () => void;
}

const QuizSummaryComponent = ({ onRestartQuiz }: QuizSummaryProps) => {
  const [summary, setSummary] = useState({ total: 0, correct: 0 });

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!reduceMotion) fireConfetti();

    import("@/data/questions").then((module) => {
      const totalQuestions = module.questions.length;
      try {
        const resultsJSON = localStorage.getItem("quizResults");
        const results: QuizResult[] = resultsJSON ? JSON.parse(resultsJSON) : [];
        const correctAnswers = results.filter((r) => r.isCorrect).length;
        setSummary({ total: totalQuestions, correct: correctAnswers });
      } catch (error) {
        console.error("Error retrieving quiz results:", error);
        setSummary({ total: totalQuestions, correct: 0 });
      }
    });
  }, []);

  const fireConfetti = () => {
    const end = Date.now() + 2400;
    const colors = ["#46C98A", "#4C8DFF", "#E8B339", "#EDE7D9"];
    (function frame() {
      confetti({ particleCount: 2, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 2, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  const handleRestartQuiz = () => {
    localStorage.removeItem("quizResults");
    onRestartQuiz();
  };

  const pct = summary.total ? (summary.correct / summary.total) * 100 : 0;
  const tier =
    pct >= 100
      ? { label: "Flawless", color: "sign" as const, msg: "You read every single one. The owl is impressed." }
      : pct >= 80
        ? { label: "Sharp eye", color: "sign" as const, msg: "You'd catch most attacks in the wild. Close the gap on the ones you missed." }
        : pct >= 60
          ? { label: "Getting there", color: "caution" as const, msg: "The basics are solid. Keep drilling the trickier signatures." }
          : { label: "Worth another pass", color: "reject" as const, msg: "Reading transactions safely is a skill — run it back and watch the details." };

  const barColor =
    tier.color === "sign" ? "bg-sign" : tier.color === "caution" ? "bg-caution" : "bg-reject";

  const tweetText = `I scored ${summary.correct} out of ${summary.total} on the @cyfrinaudits wise-signer!\n\nTest your knowledge of crypto wallet security.\n\nhttps://wise-signer.cyfrin.io/`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 py-16">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-hairline bg-surface">
        <div className="flex flex-col items-center px-8 pt-8 text-center">
          <Image src="/wise-signer.png" alt="" width={84} height={84} />
          <Badge tone={tier.color} className="mt-4">
            Assessment complete
          </Badge>
        </div>

        <div className="px-8 py-8 text-center">
          <p className="font-mono text-6xl font-semibold tracking-tight text-bone">
            {summary.correct}
            <span className="text-muted">/{summary.total}</span>
          </p>
          <p className="field-label mt-3">transactions read correctly</p>

          <div className="mx-auto mt-6 h-2 w-full max-w-sm overflow-hidden rounded-full bg-hairline">
            <div
              className={cn("h-full rounded-full transition-all duration-700", barColor)}
              style={{ width: `${pct}%` }}
            />
          </div>

          <h2 className="mt-8 font-display text-2xl font-semibold text-bone">
            {tier.label}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-bone-dim">{tier.msg}</p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button variant="secondary" onClick={handleRestartQuiz}>
              <FaRedo size={13} /> Run it back
            </Button>
            <a
              href={tweetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-deep px-5 py-2.5 text-[0.95rem] font-medium text-white transition-colors hover:bg-brand-strong"
            >
              <FaXTwitter size={15} /> Share your score
            </a>
          </div>
        </div>

        <a
          href="https://updraft.cyfrin.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 border-t border-hairline bg-raised px-8 py-4 text-sm text-bone-dim transition-colors hover:text-bone"
        >
          Keep learning at Cyfrin Updraft <FaArrowRight size={12} />
        </a>
      </div>
    </div>
  );
};

export default QuizSummaryComponent;
