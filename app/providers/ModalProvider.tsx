"use client"

import { AuthModal } from "@/components/AuthModal"
import { UploadModal } from "@/components/UploadModal"
import { useEffect, useState } from "react"

export function ModalProvider() {
    const [isMounted, setIsMounted] = useState(false)

    //When the component mounts is rendered in client side
    useEffect(() => {
        setIsMounted(true)
    } ,[])

    if (!isMounted) return null

    return (
        <>
            <AuthModal />
            <UploadModal />
        </>
    )
}