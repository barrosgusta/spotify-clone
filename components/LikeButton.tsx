"use client"

import { useAuthModal } from "@/hooks/useAuthModal"
import { useUser } from "@/hooks/useUser"
import { Song } from "@/types"
import { useSessionContext } from "@supabase/auth-helpers-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { set } from "react-hook-form"
import toast from "react-hot-toast"
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"

interface LikeButtonProps {
    songId: Song["id"]
}

export function LikeButton({ songId }: LikeButtonProps) {
    const router = useRouter()
    const { supabaseClient } = useSessionContext()

    const authModal = useAuthModal()
    const { user } = useUser()

    const [isLiked, setIsLiked] = useState(false)

    useEffect(() => {
        if (!user?.id) {
            return
        } 

        const fetchData = async () => {
            const { data, error } = await supabaseClient.from("liked_songs").select("*").eq("user_id", user.id).eq("song_id", songId).single()

            if (!error && data) {
                setIsLiked(true)
            }
        }

        fetchData()
    }, [user?.id, songId, supabaseClient])

    const Icon = isLiked ? <AiFillHeart color="#22c55e"/> : <AiOutlineHeart color="white"/> 

    const handleLike = async () => {
        if (!user) {
            return authModal.open()
        }

        if (isLiked) {
            const { error } = await supabaseClient.from("liked_songs").delete().eq("user_id", user.id).eq("song_id", songId)

            if (error) {
                toast.error(error.message)
            } else {
                setIsLiked(false)
            }
        } else {
            const { error } = await supabaseClient.from("liked_songs").insert({ user_id: user.id, song_id: songId })

            if (error) {
                toast.error(error.message)
            } else {
                setIsLiked(true)
            }
        }

        router.refresh()
    }

    return (
        <button onClick={handleLike} className="hover:opacity-75 transition">
            {Icon}
        </button>
    )
}