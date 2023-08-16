"use client"

import useGetSongById from "@/hooks/useGetSongById"
import useLoadSongUrl from "@/hooks/useLoadSongUrl"
import usePlayer from "@/hooks/usePlayer"
import { url } from "inspector"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { Reverb, Player as TonePlayer } from "tone"

const PlayerContent = dynamic(
    () => import("./PlayerContent"),
    { ssr: false }
  )

export function Player() {
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

    if (!song || !songUrl || !player.activeId) {
        return null
    }

    return (
        <div className="fixed bottom-0 bg-black w-full py-2 h-[80px] px-4">
            <PlayerContent key={songUrl} songUrl={songUrl} song={song} audioPlayer={tonePlayer} audioReverb={toneReverb} />
        </div>
    )
}