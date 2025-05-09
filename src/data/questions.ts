// Import shared types
import { WalletType, TransactionDetails, FeedbackContent, FakeWebsiteType, SignatureDetails } from "@/types";

// Define question types for TypeScript
export interface BaseQuestionData {
    question: string;
    feedbackContent: FeedbackContent;
    fakeWebsiteType?: FakeWebsiteType;
    questionId?: number;
    questionContext?: string;
    otherData?: any[];
}

export interface MultiChoiceQuestionData extends BaseQuestionData {
    type: "multi";
    options: { id: string; text: string }[];
    correctAnswers: string[];
}

export interface SignOrRejectQuestionData extends BaseQuestionData {
    type: "signOrReject" | "safeWallet";
    expectedAction: "sign" | "reject";
    walletType: WalletType;
    interactionButtonText: string;
    // Wallet transaction data
    transactionOrSignatureData: TransactionDetails | SignatureDetails;
    wrongAnswerPopupContent?: string;
}

export interface SiteData {
    chainPrefix: string;
    chain: string;
    recipient: string;
    amount: string;
    wadValue: string;
    nonce: number;
    rawData: string;
    title: string;
    rawDataSize: string;
    targetContract: string;
    targetFunction: string;
    domainHash?: string;
    messageHash?: string;
    eip712Hash?: string;
}

export const SAFE_WALLET_QUESTION_START = 13

// export const ZKSYNC_AAVE_WRAPPED_TOKEN_GATEWAY_V3 = "0x9F07eEBdf3675f60dCeC65a092F1821Fb99726F3"
export const ZKSYNC_AAVE_WRAPPED_TOKEN_GATEWAY_V3 = "0xAE2b00D676130Bdf22582781BbBA8f4F21e8B0ff"
export const TREZOR_FRIEND_WALLET = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
export const TREZOR_POISONING_WALLET = "0x70997971C51812ec3A01f47e01b51d5d17dc79C8"
export const FRIEND_WALLET = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
export const YOUR_WALLET = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
export const ARBITRUM_WETH = "0x82af49447d8a07e3bd95bd0d56f35241523fbab1"
export const MULTI_SIGNATURE_WALLET = "0x4087d2046A7435911fC26DCFac1c2Db26957Ab72"
export const MULTI_SIGNATURE_SIGNER_WALLET = "0x5031f5E2ed384978dca63306dc28A68a6Fc33e81"
export const ZKSYNC_USDC_ADDRESS = "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4"
export const ETH_AAVE_POOL = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2"
export const METAMASK_DELEGATOR = "0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B"
export const ETH_USDC_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
export const NORTH_KOREA = "0x47666fab8bd0ac7003bce3f5c3585383f09486e2"


export type QuestionData = MultiChoiceQuestionData | SignOrRejectQuestionData;

export const questions: QuestionData[] = [
    {
        "question": "What's the security trade off between using a browser wallet (ie. Metamask, Rabby, Phantom) and a hardware wallet (ie. Trezor, Ledger, Grid+)?",
        "type": "multi",
        "options": [
            { "id": "A", "text": "Browser wallets offer stronger security because they're directly connected to blockchain networks, while hardware wallets rely on physical devices that can break or be lost." },
            { "id": "B", "text": "Hardware wallets offer stronger security because they're physically separated from your computer and can operate offline most of the time, making them more resistant to malware attacks." },
            { "id": "C", "text": "Browser and hardware wallets offer identical security; the only difference is convenience and cost." },
            { "id": "D", "text": "Hardware wallets are less secure because they require trust in the manufacturer, while browser wallets are open-source and can be verified by the community." }
        ],
        "correctAnswers": ["B"],
        "feedbackContent": {
            "pages": [
                "The key security difference between browser wallets and hardware wallets is their physical separation from your computer and connection to the internet.",
                "Browser wallets (like MetaMask, Rabby, Phantom) operate directly within your internet-connected browser or computer environment. This makes them inherently vulnerable to malware, phishing attacks, and browser vulnerabilities that could compromise your private keys.",
                "Hardware wallets (like Trezor, Ledger, Grid+) offer stronger security because they're physically separated from your computer on a hardware level. While some hardware wallets can connect to the internet, they remain disconnected most of the time, significantly reducing the attack surface. This ability to operate offline makes them much more resistant to malware attacks compared to browser wallets.",
                "Option A is incorrect because browser wallets' constant connection to the internet is actually a security weakness, not a strength. While hardware devices can be lost or damaged, they typically come with recovery phrases that can restore your wallet.\n\nOption C is incorrect because there is a significant security difference between the two types of wallets - hardware wallets' physical separation and ability to remain offline provides substantially better protection against malware.\n\nOption D is incorrect because while manufacturer trust is a consideration, the security benefit of having a physically separate device that can operate offline far outweighs potential trust issues with manufacturers. Additionally, many hardware wallets are also open-source."
            ]
        }
    },
    {
        "question": "What are the benefits, and trade-offs of a multi-signature wallet (ie. Safe{Wallet}) over a hardware or a software wallet?",
        "type": "multi",
        "options": [
            { "id": "A", "text": "Multi-signature wallets enhance security by requiring multiple approvals for transactions, preventing a single compromised key from causing loss of funds." },
            { "id": "B", "text": "Multi-signature wallets only work on a single blockchain, whereas hardware and software wallets often have a private key that works across multiple chains." },
            { "id": "C", "text": "Multi-signature wallets eliminate the need for key backup procedures as the distributed nature of keys means individual key loss doesn't compromise the wallet." },
            { "id": "D", "text": "Multi-signature wallets can introduce delays in transaction processing due to the requirement for multiple parties to approve transactions." }
        ],
        "correctAnswers": ["A", "B", "D"],
        "feedbackContent": {
            "pages": [
                "Multi-signature wallets provide enhanced security through distributed control. By requiring multiple parties to approve transactions (e.g., 2-of-3 or 3-of-5 signatures), they prevent a single compromised key or malicious actor from transferring funds. This distributed security model is particularly valuable for high-value assets or organizational funds.",

                "A significant limitation of multi-signature wallets is their chain-specific implementation. Unlike hardware or software wallets where a single private key can be used across multiple blockchains, multi-sig wallets like Safe{Wallet} typically only work on a specific blockchain or ecosystem. Separate multi-sig setups would be needed for different chains.",

                "Option C is incorrect. Multi-signature wallets do NOT eliminate the need for key backup procedures. While they provide redundancy through the m-of-n signature scheme (meaning you can lose some keys and still access funds), each key holder must still properly back up their keys. If too many keys are lost and the signature threshold can no longer be met, funds could become permanently inaccessible.",

                "Multi-signature wallets introduce coordination overhead and potential delays in transaction processing. Since multiple parties need to review and approve transactions, this can slow down operational efficiency, especially when signers are in different time zones or have varying availability. This is a trade-off between security and transaction speed."
            ]
        }
    },
    {
        question: "Sign or reject this signature.",
        questionContext: `Assume your wallet address is ${YOUR_WALLET}. You want to sign into Opensea to see your NFTs. Will signing this accomplish that? If so, please sign, otherwise reject.`,
        type: "signOrReject",
        expectedAction: "reject",
        walletType: "metamask",
        interactionButtonText: "Sign in with Ethereum",
        fakeWebsiteType: "OpenSea",
        wrongAnswerPopupContent: "Oops! You allowed this site to impersonate you on Gnosis Pay!",
        feedbackContent: {
            pages: [
                "You should reject this signature! Even though you're on what appears to be OpenSea, the signature is requesting you to authenticate with app.gnosispay.com, not opensea.io.\nThis is a common phishing technique called 'domain spoofing' where the attacker presents a message that looks legitimate but actually authorizes login to a completely different website.",
                "Notice the mismatch: The website appears to be opensea.io (as shown in requestFrom), but the signature message is requesting authentication for app.gnosispay.com. This is a major red flag.\n\nIf you had signed this message, you would have authenticated to Gnosis Pay with your wallet, potentially giving attackers access to your funds or allowing them to impersonate you on that platform.\n\nAlways carefully check the actual domain in the message content before signing. The domain in the message should match the site you're actually trying to use.",
            ]
        },
        transactionOrSignatureData: {
            requestFrom: "opensea.io",
            message: `app.gnosispay.com/ wants you to sign in with your account:
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

URI: https://app.gnosispay.com
Version: 1
Chain ID: 100
Nonce: 8dc58hp767of54o1uptoe76v2r
Issued At: ${new Date().toISOString()}`
        }
    },
    {
        question: `Execute or reject this transaction.`,
        questionContext: `This transaction requires your Trezor hardware wallet. You're attempting to send your friend \`${TREZOR_FRIEND_WALLET}\` \`0.5 ETH\` on the Ethereum chain. Assume your wallet is \`${YOUR_WALLET}\` which is the #1 wallet from the standard ETH derivation path.
        
Only trust what the hardware wallet shows you. If sending this transaction will get you want you want, sign it!`,
        type: "signOrReject",
        expectedAction: "sign",
        walletType: "trezor",
        interactionButtonText: "Transfer",
        fakeWebsiteType: "SendEth",
        feedbackContent: {
            pages: [
                `It's good to sign this transaction! This appears to be a legitimate ETH transfer to your friend's address.\nEven though the website gave the wrong information, the information on the actual wallet is correct.
                
Our website told us it would send \`5 ETH\`, but the wallet populated with the correct amount. This is to show you that you cannot always trust the UI...`,
                "When evaluating a transaction, consider these key factors which were all aligned here:\n\n1. Expected action: You intended to send ETH to your friend\n2. Correct recipient: The address matches your friend's known address\n3. Reasonable amount: The amount (0.5 ETH) matches what you intended to send\n4. Appropriate network fee: The gas fees look reasonable for an ETH transfer\n5. Transaction origin: You initiated this transaction yourself from a trusted interface\n6. Hardware wallet verification: Your Trezor showed the same transaction details as the website",
                "Using a hardware wallet like Trezor provides an additional security layer, as it lets you verify transaction details on a separate secure device. Always verify that the recipient address and amount match what you expect before confirming any transaction.\n\n\nAdditionally, `m/44'/60'/0'/0/0` is the standard derivation path for Ethereum accounts.This means that the transaction is being sent from your first Ethereum account, which is what you expect.",
            ]
        },
        transactionOrSignatureData: {
            fromAccount: `${YOUR_WALLET}`,
            toAccount: `${TREZOR_FRIEND_WALLET}`,
            amount: "0.5 ETH",
            estimatedFee: {
                usd: "$4.52",
                eth: "0.00198ETH"
            },
            functionName: "",
            data: ""
        },
        otherData: ["5"],
    },
    {
        question: `Execute or reject this transaction.`,
        questionContext: `This transaction requires your trezor wallet, and it's similar to the last question! You're attempting to send your friend who has address: \`${TREZOR_FRIEND_WALLET}\` \`0.5 ETH\` on the Ethereum chain. Assume your wallet is \`${YOUR_WALLET}\` which is the #1 wallet from the standard ETH derivation path.
        
Only trust what the hardware wallet shows you. If sending this transaction will get you want you want, sign it!`,
        type: "signOrReject",
        expectedAction: "reject",
        walletType: "trezor",
        interactionButtonText: "Transfer",
        fakeWebsiteType: "SendEth",
        feedbackContent: {
            pages: [
                `This is known as an [address poisoning](https://trezor.io/support/a/address-poisoning-attacks) attack, where you're tricked into sending funds to a malicious address. The address looks REALLY close to your friend's address, but it's not! Take a look:
\`\`\`bash
${TREZOR_FRIEND_WALLET} - Friend's wallet (What the website said)
${TREZOR_POISONING_WALLET} - What showed up in our Trezor
\`\`\`
`,
                `A website can become compromised, and even though the website looks good, the data that is sent to your wallet is wrong. Always make sure to check the address is exaclty what you expect!`
            ]
        },
        wrongAnswerPopupContent: "Oh no!\n\nYou sent money to the wrong address!",

        transactionOrSignatureData: {
            fromAccount: `${YOUR_WALLET}`,
            toAccount: `${TREZOR_POISONING_WALLET}`,
            amount: "0.5 ETH",
            estimatedFee: {
                usd: "$4.52",
                eth: "0.00198ETH"
            },
            functionName: "",
            data: ""
        },
        otherData: ["0.5"],
    },
    {
        question: `Execute or reject this transaction.`,
        questionContext: `You're attempting to send your friend who has address: \`${TREZOR_FRIEND_WALLET}\` \`100 USDC.e\` (Bridged USDC) on the ZKsync Era chain. Assume your wallet is \`${YOUR_WALLET}\`.
        
Only trust what the wallet shows you. If sending this transaction will get you want you want, sign it!`,
        type: "signOrReject",
        expectedAction: "reject",
        walletType: "metamask",
        wrongAnswerPopupContent: "Oh no!\n\nYou sent $1,000 instead of $100!",
        interactionButtonText: "Transfer",
        fakeWebsiteType: "SendToken",
        feedbackContent: {
            pages: [
                `Even though the website showed \`100 USDC\`, our wallet populated with \`1000 USDC\`. This can happen if a website is compromised, or is trying to attack you! Let's review what we should look out for:

- \`Network Name\`: The network name is ZKsync Era, which is correct.
- \`to\`: The to address was ${ZKSYNC_USDC_ADDRESS}, which is the correct [USDC.e](https://www.coingecko.com/en/coins/zksync-bridged-usdc-zksync) contract on ZKsync Era that we can verify.
- \`from\`: The from address is your wallet, which is correct.

Then, we need to hit \`View details\`.

- \`Function name\`: The function name is \`transfer(address,uint256)\`, which is correct.
- \`Params #1 (address)\`: The first parameter is the address of the recipient, which is your friend's address. This is correct.
- \`Params #2 (uint256)\`: The second parameter is the amount of USDC.e to send. This is where we see the problem! The amount is \`1000000000\`, which is actually \`1,000 USDC\`. This is a problem, and we should reject this transaction!,

But how do we know this is the wrong amount?
`,

                `ERC20 tokens have a function that you can call called \`decimals()\`, which tells you how many decimals to apply to a token. \`USDC.e\` has 6 decimals, so any number we see in parameter we need to move the decimal place 6 to the left.

Do the following:                
1. Go the [ZKsync Era Explorer for USDC.e](https://explorer.zksync.io/address/0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4#contract#read-proxy)
2. Scroll down to the \`decimals\` function
3. Select it
4. Then hit \`Query\`

You'll see how many decimals the token has. All ERC20 tokens that have their code added to an explorer will have this decimals function so you can check. 

If the contract code is not available, and you cannot call the function, then you should potentially not interact with that contract!

But now that we have the decimals, we can apply this knowledge to parameter #2:

\`\`\`bash
1000000000 # This was what showed up in our metamask

# Let's move the decimal place 6 to the left
1000.000000 # Now we see the REAL amount, which is 1,000, which is too much!
\`\`\`

                `
            ]
        },
        transactionOrSignatureData: {
            networkName: "ZKsync Era",
            fromAccount: `${YOUR_WALLET}`,
            toAccount: `${ZKSYNC_USDC_ADDRESS}`,
            amount: "0 ETH",
            estimatedFee: {
                usd: "$0.02",
                eth: "0.0000198ETH"
            },
            functionName: "transfer(address,uint256)",
            params: [
                `${TREZOR_FRIEND_WALLET}`,
                "1000000000"
            ],
            data: "0xa9059cbb00000000000000000000000070997970c51812dc3a010c7d01b50e0d17dc79c8000000000000000000000000000000000000000000000000000000003b9aca00",
        },
        otherData: ["100"],
    },
    {
        question: "Execute or reject this transaction.",
        questionContext: `Assume your wallet address is ${YOUR_WALLET}. You want to deposit 1 ETH into Aave to begin gaining interest on the ZKsync Era network. Yes, use the real Aave contract address on ZKsync Era if that helps. 
        
Will signing this accomplish that? If so, please sign, otherwise reject.`,
        type: "signOrReject",
        expectedAction: "sign",
        walletType: "metamask",
        interactionButtonText: "Deposit ETH",
        fakeWebsiteType: "Aave",
        feedbackContent: {
            pages: [
                `We should always understand what we are signing. As with all transactions we should first check that the address is correct. We can see in an official [Aave GitHub repo](https://github.com/bgd-labs/aave-address-book/blob/main/src/ts/AaveV3ZkSync.ts) that the contract address ${ZKSYNC_AAVE_WRAPPED_TOKEN_GATEWAY_V3} is indeed the Aave contract on ZKsync Era. We can also check that the amount is correct, and that we are on the right network.
                
Then, we want to make sure we're calling the correct function.

This was an example of calling a function on a smart contract that is correct. The function that we called was:          
\`\`\`bash
depositETH(address,address,uint16)
\`\`\`

Where:

- \`Param #1 (address)\` - A blank address, that could be anything
- \`Param #2 (address)\` - The \`onBehalfOf\` address, which is the address that will receive the interest, we want this to be us!
- \`Param #3 (uint16)\` - The referral code, which is a number that Aave uses to track referrals. This is not important for us, and we can leave it as 0.

You can either check with the [Aave documentation](https://aave.com/docs/developers/smart-contracts/wrapped-token-gateway#write-methods-depositeth) to understand what each parameter means, or, we can go [directly to the explorer.](https://era.zksync.network/address/0xAE2b00D676130Bdf22582781BbBA8f4F21e8B0ff#code)
`, `Here, if we look into the code, we'd see the function definition in the codebase:

NOTE: You don't have to be able to read code! But you can read the \`@param\` tags, where it says \`onBehalfOf\` and \`referralCode\`:

\`\`\`javascript
/**
   * @dev deposits WETH into the reserve, using native ETH. A corresponding amount of the overlying asset (aTokens)
   * is minted.
   * @param onBehalfOf address of the user who will receive the aTokens representing the deposit
   * @param referralCode integrators are assigned a referral code and can potentially receive rewards.
   **/
  function depositETH(address, address onBehalfOf, uint16 referralCode) external payable override {
    WETH.deposit{value: msg.value}();
    POOL.deposit(address(WETH), msg.value, onBehalfOf, referralCode);
  }
\`\`\`

Now, if we assume the code is good, we can use this to verify that at least we are setting the correct parameters!
`,

            ]
        },
        transactionOrSignatureData: {
            networkName: "ZKsync Era",
            fromAccount: YOUR_WALLET,
            toAccount: ZKSYNC_AAVE_WRAPPED_TOKEN_GATEWAY_V3,
            amount: "1 ETH",
            estimatedFee: {
                usd: "$0.02",
                eth: "0.00004ETH"
            },
            functionName: "depositETH(address,address,uint16)",
            params: [
                `${YOUR_WALLET}`,
                `${YOUR_WALLET}`,
                "0"
            ],
            data: `0x474cf53d000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb922660000000000000000000000000000000000000000000000000000000000000000`,
        }
    },
    {
        question: "Execute or reject this transaction.",
        questionContext: `Here we go again! But this time, your wallet is having a hard time decoding the data. Instead of showing you the parameters like we did in the last question, it just shows you the "raw" data. A wallet can have a hard time turning this "raw" data into the easier to read parameters if the transaction data is too complicated or your wallet doesn't recognize the type of transaction. 

Assume your wallet address is ${YOUR_WALLET}. You want to deposit 1 ETH into Aave to begin gaining interest on the ZKsync Era network. Yes, use the real Aave contract address on ZKsync Era if that helps. 
        
Will signing this accomplish that? If so, please sign, otherwise reject.`,
        type: "signOrReject",
        expectedAction: "reject",
        wrongAnswerPopupContent: "Oh no!\n\nYou just deposited ETH in Aave for someone else!",
        walletType: "metamask",
        interactionButtonText: "Deposit ETH",
        fakeWebsiteType: "Aave",
        feedbackContent: {
            pages: [
                `The following were correct on this transaction:
                
1. Address: It is the correct ZKsync Era Aave contract.
2. Correct amount: The amoount of ETH is the amount you want to deposit.
3. Website: You initiated this transaction yourself from a trusted website URL.

However, the transaction calldata is not correct!
This could happen if the Aave UI is compromised. Website interfaces compromises unfourtunately are all too common.`,
                `For this transaction, the calldata was: 

\`\`\`bash
0x474cf53d000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb9226600000000000000000000000023618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f0000000000000000000000000000000000000000000000000000000000000000
\`\`\` 

For non technical people, we could put this calldata into a calldata-decoder like [swiss-knife](https://calldata.swiss-knife.xyz/decoder) or [deth tools](https://tools.deth.net/calldata-decoder).

If you've never decoded calldata before, do the following:
1. Go to [swiss-knife](https://calldata.swiss-knife.xyz/decoder)
2. Paste the data above into the website, and you'll see the parameters that this calldata represents.

You'll get something like:

\`\`\`json
{
  "function": "depositETH(address,address,uint16)",
  "params": [
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
    "0"
  ]
}
\`\`\`

Which shows that the 2nd parameter is \`0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f\`, which is not the wallet address we want!`,

                `Now using a website to decode the calldata is a nice shortcut, but we are now trusting the website to be correct! So often, we want to use our own tools. For developers, if we decode this with [foundry's cast tool](https://book.getfoundry.sh/):

\`\`\`bash
cast calldata-decode "depositETH(address,address,uint16)" 0x474cf53d000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb9226600000000000000000000000023618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f0000000000000000000000000000000000000000000000000000000000000000
\`\`\`

We get: 

\`\`\`bash
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f # Wrong!!
0
\`\`\`

The second parameter stands for \`onbehalfOf\`, meaning we are depositing ETH for someone else. It should match our wallet address, and it does not!`,
            ]
        },
        transactionOrSignatureData: {
            networkName: "ZKsync Era",
            fromAccount: YOUR_WALLET,
            toAccount: ZKSYNC_AAVE_WRAPPED_TOKEN_GATEWAY_V3,
            amount: "1 ETH",
            estimatedFee: {
                usd: "$0.02",
                eth: "0.00004ETH"
            },
            functionName: "depositETH(address,address,uint16)",
            data: "0x474cf53d000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb9226600000000000000000000000023618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f0000000000000000000000000000000000000000000000000000000000000000",
        }
    },
    {
        question: "Execute or reject this transaction.",
        questionContext: `You've grown weary of sending so many transactions, and you are excited to hear that Aave now supports EIP-7702! You are attempting to _both_ approve 100 USDC token on the Ethereum network AND supply 100 USDC on behalf of yourself to Aave.
        
If the transaction that populates does that, please sign it, otherwise reject`,
        type: "signOrReject",
        expectedAction: "sign",
        walletType: "metamask",
        interactionButtonText: "Approve & Supply USDC",
        fakeWebsiteType: "Aave2",
        feedbackContent: {
            pages: [`For EIP-7702 transactions, you set your wallet to gain the power of a smart contract, and it can be a bit confusing how to read your wallet. MetaMask automatically sets the code of our wallet to be ${METAMASK_DELEGATOR}, which means that our EOA now has the power to call functions... On itself! You're actually calling the function \`execute\` on your own address! You can think of it like you're borrowing the code from ${METAMASK_DELEGATOR} until you set your wallet back to being a "normal" EOA wallet.
                
But with this power, we can batch transactions together, like how we saw a list of transactions in our wallet. If you decode the two transactions using some of the tools we've learned, you'll see:

\`\`\`bash
#  Transaction #1
# To: ${ETH_USDC_ADDRESS}
# 0x095ea7b300000000000000000000000087870bca3f3fd6335c3f4ce8392d69350b4fa4e20000000000000000000000000000000000000000000000000000000005f5e100
{
  "function": "approve(address,uint256)",
  "params": [
    "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
    "100000000"
  ]
}

# Transaction #2
# To: ${ETH_AAVE_POOL}
# 0x617ba037000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000000000000000000000000000000000000005f5e100000000000000000000000000a5d0084a766203b463b3164dfc49d91509c12dab0000000000000000000000000000000000000000000000000000000000000000
{
  "function": "supply(address,uint256,address,uint16)",
  "params": [
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "100000000",
    "0xa5D0084A766203b463b3164DFc49D91509C12daB",
    "0"
  ]
}
\`\`\`

And we've already learned how to spot correct approval transactions. We just need to learn if the \`supply\` transaction is correct, which it is! We can learn that by going to the Aave documentation, and verifying the address and functions are correct.`]
        },
        transactionOrSignatureData: {
            networkName: "Ethereum",
            fromAccount: YOUR_WALLET,
            toAccount: YOUR_WALLET,
            amount: "0 ETH",
            estimatedFee: {
                usd: "$0.12",
                eth: "0.00124ETH"
            },
            functionName: "execute((address,uint256,bytes))",
            contracts: [ETH_USDC_ADDRESS, ETH_AAVE_POOL],
            data: [`0x095ea7b300000000000000000000000087870bca3f3fd6335c3f4ce8392d69350b4fa4e20000000000000000000000000000000000000000000000000000000005f5e100`, `0x617ba037000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000000000000000000000000000000000000005f5e100000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb922660000000000000000000000000000000000000000000000000000000000000000`],
            upgradeAccount: `${METAMASK_DELEGATOR}`,
        }
    },
    {
        question: "Execute or reject this transaction.",
        questionContext: `Whew! You've solved so many of these. You just want to send your friend 50 USDC on the Ethereum network. Assume your wallet is \`${YOUR_WALLET}\` and your friend's wallet is \`${FRIEND_WALLET}\`. And you're going to send it using an EIP-7702 transaction now that you understand it.`,
        type: "signOrReject",
        expectedAction: "reject",
        walletType: "metamask",
        interactionButtonText: "Send Tokens",
        fakeWebsiteType: "SendToken",
        wrongAnswerPopupContent: "Oh no!\nYou just gave North Korea access to all your funds and all your tokens are drained to 0!",
        feedbackContent: {
            pages: [`Most wallets don't allow this functionality, but when you upgrade your wallet to a smart contract wallet, you must be absolutely sure the contract that you're borrowing the code from is safe. In this case, ${NORTH_KOREA} was the wallet associated with the Bybit hack, and is a [North Korean Hacker controlled address](https://etherscan.io/address/0x47666fab8bd0ac7003bce3f5c3585383f09486e2).
To protect against this, you have two options:

1. Use wallets that force you to upgrade to "safer" EIP-7702 wallets (like Metamask)
2. Make sure your verify the smart contract wallet you're upgrading to.`,

                `But, remember, even if the smart contract wallet is "safe" the transactions could still be malicious. Always be diligent to check!`]
        },
        transactionOrSignatureData: {
            networkName: "Ethereum",
            fromAccount: YOUR_WALLET,
            toAccount: YOUR_WALLET,
            amount: "0 ETH",
            estimatedFee: {
                usd: "$0.12",
                eth: "0.00124ETH"
            },
            functionName: "execute((address,uint256,bytes))",
            contracts: [ETH_USDC_ADDRESS],
            data: [`0xa9059cbb000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa960450000000000000000000000000000000000000000000000000000000002faf080`],
            upgradeAccount: `${NORTH_KOREA}`,
        },
        otherData: ["50"],
    },
    {
        question: "Sign or reject this signature.",
        questionContext: `Assume your wallet address is ${YOUR_WALLET}, and you are a signer on a valid mutlisig wallet at address ${MULTI_SIGNATURE_WALLET}. You are attempting to send 1 WETH to address: ${FRIEND_WALLET} on the Arbitrum network. Please sign or reject this transaction, if doing so will bring you closer to executing.`,
        type: "signOrReject",
        expectedAction: "sign",
        walletType: "metamask",
        interactionButtonText: "Sign",
        fakeWebsiteType: "SendWethSafeWallet",
        transactionOrSignatureData: {
            networkName: "Arbitrum",
            requestFrom: "https://app.safe.global/",
            message: `{"types":{"SafeTx":[{"type":"address","name":"to"},{"type":"uint256","name":"value"},{"type":"bytes","name":"data"},{"type":"uint8","name":"operation"},{"type":"uint256","name":"safeTxGas"},{"type":"uint256","name":"baseGas"},{"type":"uint256","name":"gasPrice"},{"type":"address","name":"gasToken"},{"type":"address","name":"refundReceiver"},{"type":"uint256","name":"nonce"}],"EIP712Domain":[{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}]},"domain":{"chainId":"42161","verifyingContract":"${MULTI_SIGNATURE_WALLET}"},"primaryType":"SafeTx","message":{"to":"${ARBITRUM_WETH}","value":"0","data":"0xa9059cbb000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa960450000000000000000000000000000000000000000000000000de0b6b3a7640000","operation":"0","safeTxGas":"0","baseGas":"0","gasPrice":"0","gasToken":"0x0000000000000000000000000000000000000000","refundReceiver":"0x0000000000000000000000000000000000000000","nonce":"29"}}`
        },
        otherData: [{
            "chainPrefix": "arb",
            "chain": "arbitrum",
            "recipient": FRIEND_WALLET,
            "amount": "1",
            "wadValue": "1000000000000000000",
            "nonce": 29,
            "rawData": "0xa9059cbb000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa960450000000000000000000000000000000000000000000000000de0b6b3a7640000",
            "title": "Send tokens",
            "rawDataSize": "68 bytes",
            "targetContract": "WETH 1",
            "targetFunction": "transfer",
            "signers": "2/10"
        }],
        feedbackContent: {
            pages: [
                `It's correct to sign this transaction. This is a valid EIP-712 structured message for a multisig transaction with Safe{Wallet} (formerly Gnosis Safe) that matches your intention to send 1 WETH to your friend's address.
When reviewing multisig transactions, you should check the EIP-712 data generated in your wallet (in this case, metamask) which all aligned in this case:

\`\`\`
1. The transaction originates from a legitimate source (app.safe.global)
2. The verifyingContract matches your multisig wallet address
3. The correct network (Arbitrum) is specified in the chainId
4. The transaction data matches your intent (sending 1 WETH)
5. There are no suspicious parameters like operation, gasToken, or refundReceiver
\`\`\``,


                `The transaction data field contains encoded information that can be decoded with tools like Foundry's cast:

\`\`\`bash
cast calldata-decode "transfer(address,uint256)" 0xa9059cbb000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa960450000000000000000000000000000000000000000000000000de0b6b3a7640000
\`\`\`

This decodes to:
- Function: transfer(address,uint256)
- Address: ${FRIEND_WALLET} (your friend's address)
- Amount: 0xde0b6b3a7640000 (1000000000000000000 in decimal, which equals 1 WETH)`,

                "What's important here, is that we reviewed the safeMessage that was populated in our metamask."
            ]
        },
    },
    {
        question: "Sign or reject this signature.",
        questionContext: `Now, you'll have to verify the same transaction, but with a hardware wallet! But are you sure this one is correct?
        
Assume your wallet address is ${YOUR_WALLET}, and you are a signer on a valid mutlisig wallet at address ${MULTI_SIGNATURE_WALLET}. You are attempting to send 1 WETH to address: ${FRIEND_WALLET} on the Arbitrum network. Please sign or reject this transaction, if doing so will bring you closer to executing.`,
        type: "signOrReject",
        expectedAction: "sign",
        walletType: "trezor",
        interactionButtonText: "Sign",
        fakeWebsiteType: "SendWethSafeWallet",
        transactionOrSignatureData: {
            networkName: "Arbitrum",
            requestFrom: "https://app.safe.global/",
            message: `{"types":{"SafeTx":[{"type":"address","name":"to"},{"type":"uint256","name":"value"},{"type":"bytes","name":"data"},{"type":"uint8","name":"operation"},{"type":"uint256","name":"safeTxGas"},{"type":"uint256","name":"baseGas"},{"type":"uint256","name":"gasPrice"},{"type":"address","name":"gasToken"},{"type":"address","name":"refundReceiver"},{"type":"uint256","name":"nonce"}],"EIP712Domain":[{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}]},"domain":{"chainId":"42161","verifyingContract":"${MULTI_SIGNATURE_WALLET}"},"primaryType":"SafeTx","message":{"to":"${ARBITRUM_WETH}","value":"0","data":"0xa9059cbb000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa960450000000000000000000000000000000000000000000000000de0b6b3a7640000","operation":"0","safeTxGas":"0","baseGas":"0","gasPrice":"0","gasToken":"0x0000000000000000000000000000000000000000","refundReceiver":"0x0000000000000000000000000000000000000000","nonce":"29"}}`
        },
        otherData: [{
            "chainPrefix": "arb",
            "chain": "arbitrum",
            "recipient": FRIEND_WALLET,
            "amount": "1",
            "wadValue": "1000000000000000000",
            "nonce": 29,
            "rawData": "0xa9059cbb000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa960450000000000000000000000000000000000000000000000000de0b6b3a7640000",
            "title": "Send tokens",
            "rawDataSize": "68 bytes",
            "targetContract": "WETH 1",
            "targetFunction": "transfer",
            "signers": "2/10"
        }],
        feedbackContent: {
            pages: [
                `This is a valid EIP-712 structured message for a multisig transaction with Safe{Wallet} (formerly Gnosis Safe) that matches your intention to send 1 WETH to your friend's address.

This resembles a real hardware wallet, where most hardware wallets have the screen so small that you have to scroll through a ton of pages. This can lead to [security fatigue](https://www.nist.gov/news-events/news/2016/10/security-fatigue-can-cause-computer-users-feel-hopeless-and-act-recklessly), so it's better to use a wallet that has a domain, message, and eip-712 hash since that is much fater to check if it's correct. 

Our next question will force you to actually check the hashes 😈`,
            ]
        }
    },
    {
        question: "Sign or reject this signature.",
        questionContext: `Verifying the massive JSON data on your hardware wallet can be a nightmare, as you'll have to scroll through many many screens to see all the data, which can lead to [security fatigue](https://www.nist.gov/news-events/news/2016/10/security-fatigue-can-cause-computer-users-feel-hopeless-and-act-recklessly). So you should get good at verifying using only the domain and message hash (or, the EIP-712 hash).

Assume your wallet address is ${YOUR_WALLET}, and you are a signer on a valid mutlisig wallet at address ${MULTI_SIGNATURE_WALLET}. You are attempting to deposit 0.1 ETH to the ZKsync Aave token pool. Please sign this transaction if doing so will bring you closer to executing, otherwise reject it.

 Also assume, you have the settings of your hardware wallet set to show ONLY the Domain and Message hash, and not the entire JSON data. So when you see the \`Message\` page, you know that this is showing you the message hash and domain hash (domain separator) and not the actual JSON message.

Hint: Here is the starting JSON data that is being signed:


{
    "types": {
        "SafeTx": [
            {
                "name": "to",
                "type": "address"
            },
            {
                "name": "value",
                "type": "uint256"
            },
            {
                "name": "data",
                "type": "bytes"
            },
            {
                "name": "operation",
                "type": "uint8"
            },
            {
                "name": "safeTxGas",
                "type": "uint256"
            },
            {
                "name": "baseGas",
                "type": "uint256"
            },
            {
                "name": "gasPrice",
                "type": "uint256"
            },
            {
                "name": "gasToken",
                "type": "address"
            },
            {
                "name": "refundReceiver",
                "type": "address"
            },
            {
                "name": "nonce",
                "type": "uint256"
            }
        ],
        "EIP712Domain": [
            {
                "name": "chainId",
                "type": "uint256"
            },
            {
                "name": "verifyingContract",
                "type": "address"
            }
        ]
    },
    "domain": {
        "chainId": "0x144",
        "verifyingContract": "${MULTI_SIGNATURE_WALLET}"
    },
    "primaryType": "SafeTx",
    "message": {
        // Fill me in!
    }
}`,
        wrongAnswerPopupContent: "Oh no!\n\nYou were just hit with a similar attack to what happened to Bybit ($1.4B loss!)",
        type: "signOrReject",
        expectedAction: "reject",
        walletType: "trezor",
        interactionButtonText: "Sign",
        fakeWebsiteType: "SafeWallet",
        feedbackContent: {
            pages: [`This is an example of what could happen if the user interface is compromised. The Message and Domain hash on the website matches what is in your Trezor, but it's a malicious message and domain hash! We can actually calculate the domain and message hash ourselves a few different ways:

- [safe-hash-rs](https://github.com/Cyfrin/safe-hash-rs)
- [safe-tx-hashes-utils](https://github.com/pcaversaccio/safe-tx-hashes-util)
- [safeutils.openzeppelin.com](https://safeutils.openzeppelin.com/)

Something else to note, is that on wallets with small screens, it can be really difficult to verify pages and pages of data. The data that we are signing is much bigger here than just sending tokens, so it's often just easier to just compare the hashes of the data we are signing instead of inspecting the entire data on our wallet.`, `No matter what tool we use, the first thing we need to do is inspect/create the JSON object that is being signed. In this case, based on the data from the Safe UI, we should be signing:

\`\`\`json
{
    "types": {
        "SafeTx": [
            {
                "name": "to",
                "type": "address"
            },
            {
                "name": "value",
                "type": "uint256"
            },
            {
                "name": "data",
                "type": "bytes"
            },
            {
                "name": "operation",
                "type": "uint8"
            },
            {
                "name": "safeTxGas",
                "type": "uint256"
            },
            {
                "name": "baseGas",
                "type": "uint256"
            },
            {
                "name": "gasPrice",
                "type": "uint256"
            },
            {
                "name": "gasToken",
                "type": "address"
            },
            {
                "name": "refundReceiver",
                "type": "address"
            },
            {
                "name": "nonce",
                "type": "uint256"
            }
        ],
        "EIP712Domain": [
            {
                "name": "chainId",
                "type": "uint256"
            },
            {
                "name": "verifyingContract",
                "type": "address"
            }
        ]
    },
    "domain": {
        "chainId": "0x144",
        "verifyingContract": "${MULTI_SIGNATURE_WALLET}"
    },
        "primaryType": "SafeTx",
        "message": {
            "to": "${ZKSYNC_AAVE_WRAPPED_TOKEN_GATEWAY_V3}",
            "value": "100000000000000000",
            "data": "0x474cf53d0000000000000000000000004087d2046a7435911fc26dcfac1c2db26957ab720000000000000000000000004087d2046a7435911fc26dcfac1c2db26957ab720000000000000000000000000000000000000000000000000000000000000000",
            "operation": "0",
            "safeTxGas": "0",
            "baseGas": "0",
            "gasPrice": "0",
            "gasToken": "0x0000000000000000000000000000000000000000",
            "refundReceiver": "0x0000000000000000000000000000000000000000",
            "nonce": "1"
        }
    }
\`\`\`

And this _seems_ great, but is it? So we should be signing the hash associated with this data. But what happens if we calculate it? 
`, `If we save this to a file (\`file.json\`), and using the safe-hash-rs tool we run:

\`\`\`bash
safe-hash typed --file file.json
\`\`\`

We get an output of:

\`\`\`
+--------------+--------------------------------------------------------------------+
| EIP 712 Hash | 0x452952ca0a93e9a05d3c138dff85dffc061f196a7b428945aadc70f92687a75d |
+--------------+--------------------------------------------------------------------+
| Domain Hash  | 0xe0392d263ff13e09757bfce9b182ead6ceabd9d1b404aa7df77e65b304969130 |
+--------------+--------------------------------------------------------------------+
| Message Hash | 0xfac0c15391856b749f37c979c6068dac6e6264b182501425aaff9dac190a2daa |
+--------------+--------------------------------------------------------------------+
\`\`\`

This is different that what we saw in our Trezor wallet!!`, `It turned out, in this case, the Safe UI was compromised, and it showed us an evil hash, and sent our wallet the evil hash. They had turned the \`operation\` from a \`0\` to a \`1\`, which changed our transaction from a \`call\` to a \`delegateCall\`.

If you update your \`file.json\` to have the \`operation\` as a \`1\`, and run the same command, you will get the same hash as our Trezor wallet.`
            ]
        },
        otherData: [{
            "chainPrefix": "zks",
            "chain": "zksync",
            "recipient": ZKSYNC_AAVE_WRAPPED_TOKEN_GATEWAY_V3,
            "amount": "0.1",
            "wadValue": "100000000000000000",
            "nonce": 1,
            "rawData": "0x474cf53d0000000000000000000000004087d2046a7435911fc26dcfac1c2db26957ab720000000000000000000000004087d2046a7435911fc26dcfac1c2db26957ab720000000000000000000000000000000000000000000000000000000000000000",
            "title": "Aave",
            "rawDataSize": "NONE",
            "targetContract": "WrappedTokenGatewayV3",
            "targetFunction": "depositETH",
            "domainHash": "0xe0392d263ff13e09757bfce9b182ead6ceabd9d1b404aa7df77e65b304969130",
            "messageHash": "0x02def9296d874a88cd65d1adfdb9c220a186f812113ae9a6080836932e3df670",
            "eip712Hash": "0x87414b6a2a5c6664ddbc9b79392a2fd4ac5a294a6b807b70b28641b3b8af297b",
            "signers": "2/10"
        }],
        transactionOrSignatureData: {
            networkName: "ZKsync Era",
            requestFrom: "https://app.safe.global/",
            message: `Domain Hash: 0xe0392d263ff13e09757bfce9b182ead6ceabd9d1b404aa7df77e65b304969130\n\nMessage Hash: 0xb2498e7f8d82ce5d628accdcc7d7bb245557a93f420c3b8baeab1df0c11d0886`
        }
    },
    {

        question: "Sign or reject this signature.",
        questionContext: `Now, can you sign a safe transaction where the signer is another safe? Let's find out...

We are attempting to send 0.01 WETH from our multi-sig wallet ${MULTI_SIGNATURE_WALLET} to ${FRIEND_WALLET} on the Arbitrum network. Assume the Safe Wallet version is 1.4.1. Our main signer is another safe wallet at address ${MULTI_SIGNATURE_SIGNER_WALLET}.

Please sign this transaction if doing so will bring you closer to executing, otherwise reject it. `,
        type: "signOrReject",
        expectedAction: "sign",
        walletType: "safeWallet",
        interactionButtonText: "sign",
        fakeWebsiteType: "SafeWallet",
        transactionOrSignatureData: {
            networkName: "Arbitrum",
            requestFrom: "https://app.safe.global/",
            message: `{
    "types": {
        "SafeTx": [
            {
                "name": "to",
                "type": "address"
            },
            {
                "name": "value",
                "type": "uint256"
            },
            {
                "name": "data",
                "type": "bytes"
            },
            {
                "name": "operation",
                "type": "uint8"
            },
            {
                "name": "safeTxGas",
                "type": "uint256"
            },
            {
                "name": "baseGas",
                "type": "uint256"
            },
            {
                "name": "gasPrice",
                "type": "uint256"
            },
            {
                "name": "gasToken",
                "type": "address"
            },
            {
                "name": "refundReceiver",
                "type": "address"
            },
            {
                "name": "nonce",
                "type": "uint256"
            }
        ],
        "EIP712Domain": [
            {
                "name": "chainId",
                "type": "uint256"
            },
            {
                "name": "verifyingContract",
                "type": "address"
            }
        ]
    },
    "domain": {
        "chainId": "0xa4b1",
        "verifyingContract": "${MULTI_SIGNATURE_SIGNER_WALLET}"
    },
    "primaryType": "SafeTx",
    "message": {
        "to": "${MULTI_SIGNATURE_WALLET}",
        "value": "0",
        "data": "0xd4d9bdcd46fcaf713a45a85097ddb1b9e0fbcc247e822d2032c8f69e73685c7d8f507fa0", 
        "operation": "0",
        "safeTxGas": "0",
        "baseGas": "0",
        "gasPrice": "0",
        "gasToken": "0x0000000000000000000000000000000000000000",
        "refundReceiver": "0x0000000000000000000000000000000000000000",
        "nonce": "5"
        }
    }`
        },
        // safe-hash tx --safe-address ${MULTI_SIGNATURE_WALLET} --nonce 3 --safe-version 1.4.1 --chain arbitrum --to 0x82af49447d8a07e3bd95bd0d56f35241523fbab1 --data 0xa9059cbb000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045000000000000000000000000000000000000000000000000002386f26fc10000  --offline
        otherData: [{
            "chainPrefix": "arb",
            "chain": "arbitrum",
            "recipient": ARBITRUM_WETH,
            "amount": "0.01",
            "wadValue": "10000000000000000",
            "nonce": 3,
            "rawData": "0xa9059cbb000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045000000000000000000000000000000000000000000000000002386f26fc10000",
            "title": "Send tokens",
            "rawDataSize": "68 bytes",
            "targetContract": "WETH 1",
            "targetFunction": "transfer",
            "domainHash": "0x886981c7ac254ace571077f0a055e84e72dac298c286f3b83638eaa308820d082",
            "messageHash": "0xa95cd534867e78aa5866b22e278984004eca36cff555462c50be402f7b292832",
            "eip712Hash": "0x46fcaf713a45a85097ddb1b9e0fbcc247e822d2032c8f69e73685c7d8f507fa0",
            "signers": "2/10"
        },
        {
            "chainPrefix": "arb",
            "chain": "arbitrum",
            "recipient": FRIEND_WALLET,
            "amount": "0.01",
            "wadValue": "10000000000000000",
            "nonce": 5,
            "rawData": "0xd4d9bdcd46fcaf713a45a85097ddb1b9e0fbcc247e822d2032c8f69e73685c7d8f507fa0",
            "title": "Nested transaction:",
            "rawDataSize": "68 bytes",
            "targetContract": MULTI_SIGNATURE_WALLET,
            "targetFunction": "approveHash",
            "domainHash": "0x3269807350d9dc0089b20781ce2f4ca71614ada2a1a116d0c79a6d801e033f8d",
            "messageHash": "0x870f0b85c95ffc9657a8ba0b4fbdc43d4cca1ed8400290ab97b19b5befe51e49",
            "eip712Hash": "0xde604d0d4e6cdb1cf39e8ff1b8c3ece230c2ec921b2538d6bbdb9cae54534c06",
            "signers": "1/4"
        }],
        feedbackContent: {
            pages: [
                `This is a valid nested Safe transaction signature, and we should sign it. You're signing a transaction from one Safe wallet that will be used to sign another Safe transaction. Whenever a Safe{Wallet} is a signer of another Safe{Wallet}, the signing wallet calls the \`approveHash(bytes32)\` function on the original Safe{Wallet}. Knowing this, there are a few ways we can verify this.
                
Using [safe-hash](https://github.com/Cyfrin/safe-hash-rs) we could either try:

\`\`\`
1. --nested-safe-address
2. Manually calculate both hashes 
\`\`\`

Let's start with the easiest way`, `If we did the following:

\`\`\`bash
safe-hash tx --safe-address ${MULTI_SIGNATURE_WALLET} --nonce 3 --safe-version 1.4.1 --chain arbitrum --to 0x82af49447d8a07e3bd95bd0d56f35241523fbab1 --data 0xa9059cbb000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045000000000000000000000000000000000000000000000000002386f26fc10000  --offline --nested-safe-address ${MULTI_SIGNATURE_SIGNER_WALLET} --nested-safe-nonce 5
\`\`\`

This would output all of the information we need to verify the transaction!


\`\`\`
Main transaction
Domain Hash:             886981c7ac254ace571077f0a055e84e72dac298c286f3b83638eaa308820d08
Message Hash:            a95cd534867e78aa5866b22e278984004eca36cff555462c50be402f7b292832
Safe Transaction Hash:   46fcaf713a45a85097ddb1b9e0fbcc247e822d2032c8f69e73685c7d8f507fa0
Verify the above value as the Safe Tx Hash when signing the message from the ledger.

Nested transaction
Domain Hash:             3269807350d9dc0089b20781ce2f4ca71614ada2a1a116d0c79a6d801e033f8d
Message Hash:            870f0b85c95ffc9657a8ba0b4fbdc43d4cca1ed8400290ab97b19b5befe51e49
Safe Transaction Hash:   de604d0d4e6cdb1cf39e8ff1b8c3ece230c2ec921b2538d6bbdb9cae54534c06
\`\`\`

The \`Nested Transaction\` is what we are signing, so if our wallet gives us any of the Domain, Message, or EIP-712 hashes, we can verify that they are correct. If the wallet doesn't give us the hashes, and instead gives us the JSON data, we can verify the data to the \`approveHash\` function. The data of our JSON should be "0xd4d9bdcd" plus the \`Safe Transaction Hash\` of the main transaction, in which case our JSON was!

We want to use "0xd4d9bdcd" because that's the result of \`cast sig "approveHash(bytes32)"\`.
`,

                `If we are having a hard time, we could manually calcuate these ourselves, first by getting the safe TX hash of the main transaction:
                
\`\`\`bash
safe-hash tx --safe-address ${MULTI_SIGNATURE_WALLET} --nonce 3 --safe-version 1.4.1 --chain arbitrum --to 0x82af49447d8a07e3bd95bd0d56f35241523fbab1 --data 0xa9059cbb000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045000000000000000000000000000000000000000000000000002386f26fc10000  --offline

####### Results in
# Main transaction
# Domain Hash:             886981c7ac254ace571077f0a055e84e72dac298c286f3b83638eaa308820d08
# Message Hash:            a95cd534867e78aa5866b22e278984004eca36cff555462c50be402f7b292832
# Safe Transaction Hash:   46fcaf713a45a85097ddb1b9e0fbcc247e822d2032c8f69e73685c7d8f507fa0
\`\`\`

And using the output to the nested safe:

\`\`\`bash
safe-hash tx --safe-address ${MULTI_SIGNATURE_SIGNER_WALLET} --nonce 5 --safe-version 1.4.1 --chain arbitrum --to ${MULTI_SIGNATURE_WALLET} --data 0xd4d9bdcd46fcaf713a45a85097ddb1b9e0fbcc247e822d2032c8f69e73685c7d8f507fa0  --offline

####### Results in
# Main transaction
# Domain Hash:             3269807350d9dc0089b20781ce2f4ca71614ada2a1a116d0c79a6d801e033f8d
# Message Hash:            870f0b85c95ffc9657a8ba0b4fbdc43d4cca1ed8400290ab97b19b5befe51e49
# Safe Transaction Hash:   de604d0d4e6cdb1cf39e8ff1b8c3ece230c2ec921b2538d6bbdb9cae54534c06
\`\`\`
`

            ]
        }
    },
    {
        question: "Execute or reject this transaction.",
        questionContext: `And now, we tie it all together! Will this transaction execute? Sign if you think so... Otherwise reject it. This is the same transaction from a previous one Except this time, we are executing it.

Assume your wallet address is ${YOUR_WALLET}, and you are a signer on a valid mutlisig wallet at address ${MULTI_SIGNATURE_WALLET}. You are attempting to deposit 0.1 ETH to the ZKsync Aave token pool. Please execute this transaction if you think it will not revert based on the calldata.`,
        type: "signOrReject",
        expectedAction: "reject",
        walletType: "metamask",
        interactionButtonText: "Sign & Execute",
        fakeWebsiteType: "SafeWallet",
        transactionOrSignatureData: {
            networkName: "ZKsync Era",
            fromAccount: YOUR_WALLET,
            toAccount: MULTI_SIGNATURE_WALLET,
            amount: "1 ETH",
            estimatedFee: {
                usd: "$0.02",
                eth: "0.00004ETH"
            },
            functionName: "execTransaction(address,uint256,bytes,uint8,uint256,uint256,uint256,address,address,bytes)",
            data: "0x6a7612020000000000000000000000004087d2046A7435911fC26DCFac1c2Db26957Ab720000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001e00000000000000000000000000000000000000000000000000000000000000064474cf53d0000000000000000000000004087d2046a7435911fc26dcfac1c2db26957ab720000000000000000000000004087d2046a7435911fc26dcfac1c2db26957ab720000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000035277d26a45add5775f21256159f089769892cea5b0000000000000000000000000000000000000000000000000000000000000000010000000000000000000000",
        },
        otherData: [{
            "chainPrefix": "zks",
            "chain": "zksync",
            "recipient": ZKSYNC_AAVE_WRAPPED_TOKEN_GATEWAY_V3,
            "amount": "0.1",
            "wadValue": "100000000000000000",
            "nonce": 1,
            "rawData": "0x474cf53d0000000000000000000000009f07eebdf3675f60dcec65a092f1821fb99726f3000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb922660000000000000000000000000000000000000000000000000000000000000000",
            "title": "Aave",
            "rawDataSize": "NONE",
            "targetContract": "WrappedTokenGatewayV3",
            "targetFunction": "depositETH",
            "domainHash": "0x6b7b2f6fc32adea40689c72912cf0fd00f9a2455204e0a2edfd9e5684b64db1b",
            "messageHash": "0xe0392d263ff13e09757bfce9b182ead6ceabd9d1b404aa7df77e65b304969130",
            "eip712Hash": "0xdcab1ef0579aa50678fcb3a1e815b6e7fa271ad33db76832199632fa61c47bf4",
            "signers": "1/3"
        }],
        feedbackContent: {
            pages: [
                `This transaction was so close! But it would not go through. The good thing about this one, is that it's not too dangerous if you got this one wrong. The signature is just incorrect, and the transaction would have reverted. 
                
When you execute a transaction, and you are the last signer, Safe{Wallet} contracts allow you to not actually sign the final transaction. Instead, as your last parameter, you input your address and the Safe{Wallet} will check that whoever sent the transaction is the last signer.`,
                `For example, if you take the calldata and deconstruct it:

\`\`\`bash
cast calldata-decode "execTransaction(address,uint256,bytes,uint8,uint256,uint256,uint256,address,address,bytes)" 0x6a7612020000000000000000000000004087d2046A7435911fC26DCFac1c2Db26957Ab720000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001e00000000000000000000000000000000000000000000000000000000000000064474cf53d0000000000000000000000004087d2046a7435911fc26dcfac1c2db26957ab720000000000000000000000004087d2046a7435911fc26dcfac1c2db26957ab720000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000035277d26a45add5775f21256159f089769892cea5b0000000000000000000000000000000000000000000000000000000000000000010000000000000000000000

### Results
# ${MULTI_SIGNATURE_WALLET}
# 0
# 0x474cf53d0000000000000000000000004087d2046a7435911fc26dcfac1c2db26957ab720000000000000000000000004087d2046a7435911fc26dcfac1c2db26957ab720000000000000000000000000000000000000000000000000000000000000000
# 0
# 0
# 0
# 0
# 0x0000000000000000000000000000000000000000
# 0x0000000000000000000000000000000000000000
# 0x277d26a45add5775f21256159f089769892cea5b000000000000000000000000000000000000000000000000000000000000000001 # Look here!
\`\`\`

The last parameter is populated with the signatures. However, the last signer can just be the address of the signer, but we see the wrong address here! It would be correct if it was:

\`\`\`bash
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266000000000000000000000000000000000000000000000000000000000000000001
\`\`\`
`
            ]
        }
    }
];

// Helper function to get a specific question by ID
// Helper function to get a specific question by ID
export function getQuestionById(id: number): QuestionData | undefined {
    if (id < 1 || id > questions.length) {
        return undefined;
    }
    return questions[id - 1];
}

// Helper function to get next question ID
export function getNextQuestionId(currentId: number): number | null {
    if (currentId < 1 || currentId >= questions.length) {
        return null;
    }
    return currentId + 1;
}

// Helper function to get previous question ID
export function getPrevQuestionId(currentId: number): number | null {
    if (currentId <= 1 || currentId > questions.length) {
        return null;
    }
    return currentId - 1;
}