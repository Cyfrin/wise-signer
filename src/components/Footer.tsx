import { FaGithub, FaXTwitter } from "react-icons/fa6";

const socialLink =
  "flex h-9 w-9 items-center justify-center rounded-lg border border-hairline text-bone-dim transition-colors hover:border-hairline-strong hover:text-bone";

const Footer = () => {
  return (
    <footer className="border-t border-hairline bg-ink">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <div className="flex items-center gap-1.5 text-sm text-muted">
          <span className="font-display font-semibold text-bone-dim">
            Wise Signer
          </span>
          <span>by</span>
          <a
            href="https://cyfrin.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-bone-dim transition-colors hover:text-bone"
          >
            Cyfrin
          </a>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://twitter.com/cyfrinaudits"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Cyfrin on X"
            className={socialLink}
          >
            <FaXTwitter size={15} />
          </a>
          <a
            href="https://github.com/cyfrin/wise-signer"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Wise Signer on GitHub"
            className={socialLink}
          >
            <FaGithub size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
