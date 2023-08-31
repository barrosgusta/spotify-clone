"use client"

import { ReactNode, createContext, useState } from "react";

export const PlayerSettingsContext = createContext({
    volume: -3,
    setVolume: (volume: number) => {},
    playbackRate: 1,
    setPlaybackRate: (playbackRate: number) => {},
    lastPlaybackRate: 1,
    setLastPlaybackRate: (lastPlaybackRate: number) => {},
    reverbWetness: 0,
    setReverbWetness: (reverbWetness: number) => {}
});

export function PlayerSettingsProvider({ children }: { children: ReactNode } ) {
    const [volume, setVolume] = useState(-3)
    const [playbackRate, setPlaybackRate] = useState(1)
    const [lastPlaybackRate, setLastPlaybackRate] = useState(1)
    const [reverbWetness, setReverbWetness] = useState(0)

    return (
        <PlayerSettingsContext.Provider 
            value={{
                volume,
                setVolume,
                playbackRate,
                setPlaybackRate,
                lastPlaybackRate,
                setLastPlaybackRate,
                reverbWetness,
                setReverbWetness
                }}
            >
            {children}
        </PlayerSettingsContext.Provider>
    )
}