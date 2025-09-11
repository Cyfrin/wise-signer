"use client";

import React from "react";
import Link from "next/link";

interface ToolCategory {
  title: string;
  tools: Array<{
    name: string;
    url: string;
    description?: string;
  }>;
}

const Tools = () => {
  const toolCategories: ToolCategory[] = [
    {
      title: "Calldata Decoders",
      tools: [
        {
          name: "Swiss Knife Decoder",
          url: "https://calldata.swiss-knife.xyz/decoder",
          description: "Decode Ethereum transaction calldata",
        },
        {
          name: "Deth Calldata Decoder",
          url: "https://tools.deth.net/calldata-decoder",
          description: "Ethereum calldata decoder by Deth",
        },
        {
          name: "quickcast.dev",
          url: "https://quickcast.dev/cast-calldata-decode",
          description: "Like Foundry's cast, but online",
        },
        {
          name: "Foundry Book",
          url: "https://book.getfoundry.sh/",
          description: "Documentation for Foundry, including calldata tools",
        },
      ],
    },
    {
      title: "Safe{Wallet} TX Verifiers",
      tools: [
        {
          name: "Cyfrin Safe Hash",
          url: "https://github.com/Cyfrin/safe-hash-rs",
          description:
            "Rust implementation for Safe transaction hash verification",
        },
        {
          name: "Chain Tools",
          url: "https://tools.cyfrin.io/safe-hash",
          description: "Online tool for Safe transaction hash verification",
        },
        {
          name: "Safe TX Hashes Util",
          url: "https://github.com/pcaversaccio/safe-tx-hashes-util",
          description: "Utility for Safe transaction hash verification",
        },
        {
          name: "OpenZeppelin Safe Utils",
          url: "https://safeutils.openzeppelin.com/",
          description: "Safe utilities from OpenZeppelin",
        },
      ],
    },
    {
      title: "Education/Videos",
      tools: [
        {
          name: "Verify Multi-Sig Signatures",
          url: "https://updraft.cyfrin.io/career-tracks/web3-wallet-security",
          description: "Learn how to verify multi-signature wallet signatures",
        },
      ],
    },
    {
      title: "Exploits/Hacks",
      tools: [
        {
          name: "Bybit Hack",
          url: "https://www.ic3.gov/PSA/2025/PSA250226",
          description: "IC3 Public Service Announcement on Bybit hack",
        },
        {
          name: "Address Poisoning",
          url: "https://trezor.io/support/a/address-poisoning-attacks",
          description:
            "Information about address poisoning attacks from Trezor",
        },
        {
          name: "Compound Finance Website Hack",
          url: "https://cryptoslate.com/compound-finance-confirms-website-hack-redirecting-users-to-phishing-site/",
          description: "Case study on Compound Finance website hack",
        },
        {
          name: "Security Fatigue",
          url: "https://www.nist.gov/news-events/news/2016/10/security-fatigue-can-cause-computer-users-feel-hopeless-and-act-recklessly",
          description: "NIST article on security fatigue and its consequences",
        },
        {
          name: "Password Manager Keys Leak",
          url: "https://blog.lastpass.com/posts/notice-of-recent-security-incident",
          description:
            "LastPass security incident report where thousands of private keys were leaked and funds stolen",
        },
      ],
    },
    {
      title: "Security Guides",
      tools: [
        {
          name: "How to Verify All Wallet Interactions",
          url: "/verify-interactions", // Internal link
          description:
            "A comprehensive guide on verifying transactions and signatures, including EIP-7702. Essential reading for all users.",
        },
      ],
    },
    {
      title: "Certifications",
      tools: [
        {
          name: "Qualified Web3 Signer",
          url: "https://updraft.cyfrin.io/certifications/qualified-web3-signer",
          description:
            "Certification for Web3 transaction signing best practices and security",
        },
      ],
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-blue-400">
        Wallet Security Tools & Resources
      </h1>

      {toolCategories.map((category, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-300 border-b border-zinc-700 pb-2">
            {category.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.tools.map((tool, toolIndex) => (
              <div
                key={toolIndex}
                className="border border-zinc-700 rounded-lg p-4 hover:border-blue-500 transition-colors bg-zinc-800"
              >
                <h3 className="font-medium text-lg mb-2 text-blue-400">
                  <Link
                    href={tool.url}
                    target={tool.url.startsWith("/") ? "_self" : "_blank"} // Open internal links in same tab
                    rel={tool.url.startsWith("/") ? "" : "noopener noreferrer"}
                    className="hover:text-blue-300"
                  >
                    {tool.name}
                  </Link>
                </h3>
                {tool.description && (
                  <p className="text-gray-300 text-sm">{tool.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tools;
