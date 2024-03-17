import React, { createContext, useContext, useReducer } from 'react';
import { isIpValid } from './utils';

// Create a new context
const HueContext = createContext();

// Provider component to wrap your app
export function HueContextProvider({ children }) {
    // Reducer function
    function hueReducer(state, newState) {
        return { ...state, ...newState };
    }

    const hueIp = localStorage.getItem('hueIp');

    const initialState = {
        hueIp,
        isIpValid: isIpValid(hueIp),
    };

    const [state, dispatch] = useReducer(hueReducer, initialState);

    const value = { state, dispatch };

    return <HueContext.Provider value={value}>{children}</HueContext.Provider>
}

// Custom hook to access the context
export default function useHueContext() {
    const hueContext = useContext(HueContext);
    if (!hueContext) {
        throw new Error('useHueContext must be used within a HueContextProvider');
    }
    return hueContext;
}