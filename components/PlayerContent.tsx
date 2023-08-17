"use client"

import { Song } from "@/types";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { LikeButton } from "./LikeButton";
import { MediaItem } from "./MediaItem";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import Slider from "./Slider";
import usePlayer from "@/hooks/usePlayer";
import { use, useEffect, useState } from "react";
import { Player, Reverb } from "tone";
import { set } from "react-hook-form";
import { get } from "http";
import useInterval from "@/hooks/useInterval";

interface PlayerContentProps {
    song: Song;
    songUrl: string;
    audioPlayer?: Player;
    audioReverb?: Reverb;
}

export default function PlayerContent({ song, songUrl, audioPlayer, audioReverb }: PlayerContentProps) {
    const player = usePlayer()
    const [volume, setVolume] = useState(1)
    const [playbackRate, setPlaybackRate] = useState(1)
    const [progress, setProgress] = useState(0)
    const [progressMinutesSeconds, setProgressMinutesSeconds] = useState("0:00")
    const [duration, setDuration] = useState(0)
    const [durationMinutesSeconds, setDurationMinutesSeconds] = useState("0:00")
    const [audioReverbWetness, setRevertWetness] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)

    const Icon = isPlaying ? BsPauseFill : BsPlayFill
    const VolumeIcon = volume === -69 ? HiSpeakerXMark : HiSpeakerWave

    function getMinutesSeconds(seconds: number) {
        let durationMinutes = 0 
        let durationSeconds = 0
        durationMinutes = seconds
        setDuration(seconds)
        durationMinutes = durationMinutes / 60
        durationSeconds = (durationMinutes - Math.trunc(durationMinutes))
        durationSeconds = Math.trunc(durationSeconds * 60) 
        durationMinutes = Math.trunc(durationMinutes)
        return (`${durationMinutes}:${durationSeconds < 10 ? `0${durationSeconds}` : durationSeconds}`)
    } 

    useEffect(() => {
        async function loadSong() {
            if (audioPlayer !== undefined) {
                await audioPlayer.load(songUrl)
                audioPlayer.start()
                setIsPlaying(true)
                setDuration(audioPlayer.buffer.duration)
                setDurationMinutesSeconds(getMinutesSeconds(audioPlayer.buffer.duration))
                console.log("Song loaded")
            }
        }

        loadSong()
    }, [songUrl, audioPlayer])

    const onPlayNext = () => {
        if (player.ids.length === 0) {
            return
        }

        const currentIndex = player.ids.findIndex((id) => id === player.activeId)
        const nextSong = player.ids[currentIndex + 1]

        if (!nextSong) {
            return player.setId(player.ids[0])
        }

        player.setId(nextSong)
    }

    const onPlayPrev = () => {
        if (player.ids.length === 0) {
            return
        }

        const currentIndex = player.ids.findIndex((id) => id === player.activeId)
        const prevSong = player.ids[currentIndex - 1]

        if (!prevSong) {
            return player.setId(player.ids[player.ids.length - 1])
        }

        player.setId(prevSong)
    }

    useEffect(() => {
        if (audioPlayer !== undefined) {
            audioReverb !== undefined && audioPlayer.connect(audioReverb)
        }
    }, [audioReverb])

    useEffect(() => {
        if (audioPlayer !== undefined) {
            audioPlayer.volume.value = volume
        }
    }, [volume])

    useEffect(() => {
        if (audioPlayer !== undefined) {
            audioPlayer.playbackRate = playbackRate
        }
    }, [playbackRate])

    useEffect(() => {
        if (audioReverb !== undefined) {
            audioReverb.wet.value = audioReverbWetness
        }
    }, [audioReverbWetness])

    useInterval(() => {
        if ((audioPlayer !== undefined) && (audioPlayer.loaded) && (progress <= duration)) {
            setProgress(progress + playbackRate)
            let progressMinutes = 0
            let progressSeconds = 0
            progressMinutes = progress / 60
            progressSeconds = (progressMinutes - Math.trunc(progressMinutes))
            progressSeconds = Math.trunc(progressSeconds * 60)
            progressMinutes = Math.trunc(progressMinutes)
            setProgressMinutesSeconds(`${progressMinutes}:${progressSeconds < 10 ? `0${progressSeconds}` : progressSeconds}`)
        } 
        
        if ((audioPlayer !== undefined) && (audioPlayer.loaded) && (progress >= duration)) {
            onPlayNext()
        }
    }, 1000)

    
    const handlePlay = () => {
        if (!isPlaying) {
            setPlaybackRate(1)
            if (audioPlayer !== undefined) {
                audioPlayer.playbackRate = playbackRate;
            }
            setIsPlaying(true)
        } else {
            setPlaybackRate(0)
            if (audioPlayer !== undefined) {
                audioPlayer.playbackRate = playbackRate;
            }
            setIsPlaying(false)
        }
    }

    const handleProgressChange = (value: number) => {
        if (audioPlayer !== undefined) {
            audioPlayer.seek(value)
            setProgress(value)
        }
    }

    const toggleMute = () => {
        if (volume === -69) {
            setVolume(0)
        } else {
            setVolume(-69)
        }
    } 

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 h-full">
            <div className="flex w-full justify-start">
                <div className="flex items-center gap-x-4">
                    <MediaItem data={song} />
                    <LikeButton songId={song.id} />
                </div>
            </div>

            <div className="flex md:hidden col-auto w-full justify-end items-center">
                <div onClick={handlePlay} className="h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer">
                    <Icon size={30} color="black" />
                </div>
            </div>

            <div className="flex flex-col justify-center mb-2">
                <div className="hidden h-full md:flex justify-center items-center w-full gap-x-6">
                    <AiFillStepBackward onClick={onPlayPrev} size={30} className="cursor-pointer text-neutral-400 hover:text-white transition" />
                    <div onClick={handlePlay} className="flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer">
                        <Icon size={30} color="black" />
                    </div>
                    <AiFillStepForward onClick={onPlayNext} size={30} className="cursor-pointer text-neutral-400 hover:text-white transition" />

                </div>

                <div key={duration} className="inline-flex justify-center items-center gap-x-2">
                    <p className="text-xs text-neutral-400">{progressMinutesSeconds}</p>
                    <Slider max={duration} min={0} value={progress} onChange={handleProgressChange} />
                    <p className="text-xs text-neutral-400">{durationMinutesSeconds}</p>
                </div>
                    
            </div>
            

            <div className="hidden md:flex w-full justify-end pr-2">
                <div className="inline-flex items-center gap-x-2 w-72">
                    <VolumeIcon onClick={toggleMute} className="cursor-pointer" size={40} />
                    <Slider value={volume} onChange={(value) => setVolume(value)} max={0} min={-69} />
                    <Slider value={playbackRate} max={2} step={0.01} onChange={setPlaybackRate} />
                    <Slider value={audioReverbWetness} step={0.01} onChange={setRevertWetness} />
                </div>
            </div>
        </div>
    )
}