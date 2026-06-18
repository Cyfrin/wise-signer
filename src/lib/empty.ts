// Stub module used to resolve optional dependencies (e.g. pino-pretty, pulled
// in transitively by wagmi/WalletConnect) that are never invoked in the browser
// bundle. Turbopack's resolveAlias points the unused module here.
export {};
