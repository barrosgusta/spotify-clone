"use client"

import useGetSongById from "@/hooks/useGetSongById"
import useLoadSongUrl from "@/hooks/useLoadSongUrl"
import usePlayer from "@/hooks/usePlayer"
import { useContext, useEffect, useState } from "react"
import { Reverb, Player as TonePlayer } from "tone"
import PlayerContent from "./PlayerContent"
import { PlayerSettingsContext } from "@/app/providers/PlayerSettingsProvider"

export type PlayerWithSettings = {
    volume: number;
    playbackRate: number;
    lastPlaybackRate: number;
    reverbWetness: number;
    setVolume: (volume: number) => void;
    setPlaybackRate: (playbackRate: number) => void;
    setLastPlaybackRate: (lastPlaybackRate: number) => void;
    setReverbWetness: (reverbWetness: number) => void;
    player: TonePlayer | undefined;
    reverb: Reverb | undefined;
};

export function Player() {
    const PlayerSettings = useContext(PlayerSettingsContext); 

    const player = usePlayer()
    const { song } = useGetSongById(player.activeId)
    const [tonePlayer, setTonePlayer] = useState<TonePlayer | undefined>(undefined)
    const [toneReverb, setToneReverb] = useState<Reverb | undefined>(undefined)

    const songUrl = useLoadSongUrl(song!) 

    useEffect(() => {
        tonePlayer !== undefined && tonePlayer?.dispose()
        toneReverb !== undefined && toneReverb?.dispose()

        setTonePlayer(new TonePlayer().toDestination())
        setToneReverb(new Reverb({decay: 5, wet: 0}).toDestination())
    }, [songUrl])

    const playerWithSettings = {
        volume: PlayerSettings.volume,
        playbackRate: PlayerSettings.playbackRate,
        lastPlaybackRate: PlayerSettings.lastPlaybackRate,
        reverbWetness: PlayerSettings.reverbWetness,
        setVolume: PlayerSettings.setVolume,
        setPlaybackRate: PlayerSettings.setPlaybackRate,
        setLastPlaybackRate: PlayerSettings.setLastPlaybackRate,
        setReverbWetness: PlayerSettings.setReverbWetness,
        player: tonePlayer,
        reverb: toneReverb
    }

    if (!song || !songUrl || !player.activeId) {
        return null
    }

    return (
        <div className="fixed bottom-0 bg-black w-full py-2 h-24 px-4">
            <PlayerContent key={songUrl} songUrl={songUrl} song={song} playerWithSettings={playerWithSettings} /* audioPlayer={tonePlayer} audioReverb={toneReverb} */ />
        </div>
    )
}