// src/context/NetworkContext.tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';

// Network info interface
export interface NetworkInfo {
    rpcUrl: string;
    adminRpcUrl?: string;
    chainId: string;
    networkId?: string;
    name: string;
}

// Context interface
export interface NetworkContextType {
    networkInfo: NetworkInfo | null;
    isLoading: boolean;
    error: string | null;
}

// Create the context
export const NetworkContext = createContext<NetworkContextType>({
    networkInfo: null,
    isLoading: true,
    error: null
});

// Custom hook to use the network context
export const useNetwork = () => useContext(NetworkContext);

// A simple provider component
interface NetworkContextProviderProps {
    children: ReactNode;
    value: NetworkContextType;
}

export const NetworkContextProvider: React.FC<NetworkContextProviderProps> = ({
    children,
    value
}) => {
    return (
        <NetworkContext.Provider value={value}>
            {children}
        </NetworkContext.Provider>
    );
};
