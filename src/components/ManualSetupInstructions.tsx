"use client";

import { FaExternalLinkAlt, FaArrowLeft, FaCopy, FaCheckCircle } from "react-icons/fa";
import { useState } from "react";

const ManualSetupInstructions = ({ onBack }: { onBack: () => void }) => {
    const [copied, setCopied] = useState({
        slug: false,
        chainId: false,
        displayName: false,
    });

    const copyToClipboard = (text: string, field: keyof typeof copied) => {
    navigator.clipboard.writeText(text);
    setCopied(prev => ({ ...prev, [field]: true }));
    setTimeout(() => {
        setCopied(prev => ({ ...prev, [field]: false }));
    }, 2000);
};

    return (
        <div className="bg-zinc-800 p-6 rounded-lg max-w-3xl">
            <button
                onClick={onBack}
                className="text-zinc-400 hover:text-zinc-300 flex items-center gap-1 text-sm mb-6 cursor-pointer"
            >
                <FaArrowLeft size={12} />
                Back to options
            </button>

            <h2 className="text-2xl font-semibold mb-4">Manual Virtual Network Setup</h2>
            <p className="mb-6">
                Follow these instructions to manually create a Tenderly Virtual Network with the correct settings
                for this application. After setup, you'll just need to provide the RPC URL.
            </p>

            <div className="mb-8 p-4 bg-zinc-700 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Step 1: Create a Tenderly Account</h3>
                <p className="mb-4">If you don't already have a Tenderly account, you'll need to create one.</p>
                <a
                    href="https://dashboard.tenderly.co/register"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 mb-2"
                >
                    <FaExternalLinkAlt size={12} />
                    Create a Tenderly account
                </a>
            </div>

            <div className="mb-8 p-4 bg-zinc-700 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Step 2: Create a New Project</h3>
                <p className="mb-4">
                    If you don't already have a project, create a new one from your Tenderly dashboard.
                </p>
                <a
                    href="https://dashboard.tenderly.co/projects/create"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                    <FaExternalLinkAlt size={12} />
                    Create a new project
                </a>
            </div>

            <div className="mb-8 p-4 bg-zinc-700 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Step 3: Create a Virtual Network</h3>
                <p className="mb-4">
                    From your project dashboard, go to the "Networks" section and click "Create Virtual Network".
                    Use the following settings:
                </p>

                <div className="space-y-4 mt-6">
                    <div className="flex flex-col space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Network Slug:</span>
                            <button
                                onClick={() => copyToClipboard("cyfrin-wise-signer", "slug")}
                                className="flex items-center gap-1 px-2 py-1 bg-zinc-600 rounded text-xs"
                            >
                                {copied.slug ? <FaCheckCircle className="text-green-400" /> : <FaCopy />}
                                {copied.slug ? "Copied!" : "Copy"}
                            </button>
                        </div>
                        <div className="bg-zinc-800 p-2 rounded text-sm font-mono">
                            cyfrin-wise-signer
                        </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Display Name:</span>
                            <button
                                onClick={() => copyToClipboard("Wise Signer", "displayName")}
                                className="flex items-center gap-1 px-2 py-1 bg-zinc-600 rounded text-xs"
                            >
                                {copied.displayName ? <FaCheckCircle className="text-green-400" /> : <FaCopy />}
                                {copied.displayName ? "Copied!" : "Copy"}
                            </button>
                        </div>
                        <div className="bg-zinc-800 p-2 rounded text-sm font-mono">
                            Wise Signer
                        </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                        <span className="text-sm font-medium">Description:</span>
                        <div className="bg-zinc-800 p-2 rounded text-sm font-mono">
                            Forked Sepolia network for practicing signatures
                        </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                        <span className="text-sm font-medium">Network to Fork:</span>
                        <div className="bg-zinc-800 p-2 rounded text-sm font-mono">
                            Sepolia (11155111)
                        </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Chain ID:</span>
                            <button
                                onClick={() => copyToClipboard("356661", "chainId")}
                                className="flex items-center gap-1 px-2 py-1 bg-zinc-600 rounded text-xs"
                            >
                                {copied.chainId ? <FaCheckCircle className="text-green-400" /> : <FaCopy />}
                                {copied.chainId ? "Copied!" : "Copy"}
                            </button>
                        </div>
                        <div className="bg-zinc-800 p-2 rounded text-sm font-mono">
                            356661
                        </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                        <span className="text-sm font-medium">Block Number:</span>
                        <div className="bg-zinc-800 p-2 rounded text-sm font-mono">
                            latest
                        </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                        <span className="text-sm font-medium">Sync State:</span>
                        <div className="bg-zinc-800 p-2 rounded text-sm font-mono">
                            Disabled
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-8 p-4 bg-zinc-700 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Step 4: Get the RPC URL</h3>
                <p className="mb-4">
                    After creating the Virtual Network, you'll need to copy the Public RPC URL to use with this application.
                </p>
                <ol className="list-decimal ml-5 space-y-2">
                    <li>Go to your newly created Virtual Network</li>
                    <li>Find the "RPC Endpoints" section</li>
                    <li>Copy the "Public RPC" URL (it should look like https://virtual.sepolia.rpc.tenderly.co/...)</li>
                    <li>Paste this URL into the "RPC Endpoint URL" field in this application</li>
                </ol>
            </div>

            <div className="flex justify-between">
                <button
                    onClick={onBack}
                    className="px-4 py-2 bg-zinc-600 text-white rounded hover:bg-zinc-700 transition cursor-pointer"
                >
                    Back to Options
                </button>
                <a
                    href="https://dashboard.tenderly.co/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2"
                >
                    <FaExternalLinkAlt size={12} />
                    Go to Tenderly Dashboard
                </a>
            </div>
        </div>
    );
};

export default ManualSetupInstructions;