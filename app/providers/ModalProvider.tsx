"use client"

import { AuthModal } from "@/components/AuthModal"
import SubscriptionsModal from "@/components/SubscribeModal"
import { UploadModal } from "@/components/UploadModal"
import { ProductWithPrice } from "@/types"
import { useEffect, useState } from "react"

interface ModalProviderProps {
    products: ProductWithPrice[]
}

export function ModalProvider({ products }: ModalProviderProps) {
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
            <SubscriptionsModal products={products} />
        </>
    )
}