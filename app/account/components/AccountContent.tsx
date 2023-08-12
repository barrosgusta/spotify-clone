"use client"

import Button from "@/components/Button"
import { useSubscribeModal } from "@/hooks/useSubscribeModal"
import { useUser } from "@/hooks/useUser"
import { postData } from "@/libs/helpers"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function AccountContent() {
    const router = useRouter()
    const subscribeModal = useSubscribeModal()
    const { isLoading, subscription, user } = useUser()

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace("/")
        }
    }, [isLoading, user, router])

    const redirectToCustomerPortal = async () => {
        setLoading(true)
        try {
            const { url, error } = await postData({
                url: "/api/create-portal-link"
            })
            window.location.assign(url)
        } catch (error) {
            toast.error((error as Error).message)
        }
        setLoading(false)
    }

    return (
        <div className="mb-7 px-6">
            {!subscription && (
                <div className="flex flex-col gap-y-4">
                    <p>No active plan</p>
                    <Button 
                        onClick={subscribeModal.open}
                        className="w-[300px]"
                    >
                        Subscribe
                    </Button>
                </div>
            )}
            {subscription && (
                <div className="flex flex-col gap-y-4">
                    <p>
                        Current plan: <b>{subscription?.prices?.products?.name}</b>
                    </p>
                    <Button
                        disabled={loading || isLoading}
                        onClick={redirectToCustomerPortal}
                        className="w-[300px]"
                    >   
                        Open customer portal
                    </Button>
                </div>
            )}
        </div>
    )
}