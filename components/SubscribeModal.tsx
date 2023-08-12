"use client"

import { Price, ProductWithPrice } from "@/types";
import { Modal } from "./Modal"
import Button from "./Button";
import { useUser } from "@/hooks/useUser";
import { useState } from "react";
import toast from "react-hot-toast";
import { postData } from "@/libs/helpers";
import { getStripe } from "@/libs/stripeClient";
import { useSubscribeModal } from "@/hooks/useSubscribeModal";

interface SubscriptionsModalProps {
    products: ProductWithPrice[]
}

function formatPrice(price: Price) {
    const priceString = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: price.currency,
        minimumFractionDigits: 0
    }).format((price.unit_amount || 0) / 100);

    return priceString
}

export default function SubscriptionsModal({ products }: SubscriptionsModalProps) {
    const subscribeModal = useSubscribeModal();
    const { user, isLoading, subscription } = useUser();
    const [priceIdLoading, setPriceIdLoading] = useState<string>();

    const onChange = (open: boolean) => {
        if (!open) {
            subscribeModal.close();
        }
    }

    const handleCheckout = async (price: Price) => {
        setPriceIdLoading(price.id);
        
        if (!user) {
            setPriceIdLoading(undefined);
            return toast.error("You must be logged in to subscribe");
        }

        if (subscription) {
            setPriceIdLoading(undefined);
            return toast.error("You already have a subscription");
        }

        try {
            const { sessionId } = await postData({
                url: '/api/create-checkout-session',
                data: { price }
            })

            const stripe = await getStripe();
            stripe?.redirectToCheckout({ sessionId });
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setPriceIdLoading(undefined);
        }
    }

    let content = (
        <div className="text-center">
            No products avaliable
        </div>
    );

    if (subscription) {
        content = (
            <div className="text-center">
                You already have a subscription
            </div>
        )
    } else
    if (products.length && !subscription) {
        content = (
            <div>
                {products.map((product) => {
                    if (!product.prices?.length) {
                        return (
                            <div key={product.id}>
                                No prices avaliable
                            </div>
                        )
                    }

                    return product.prices.map((price) => (
                        <Button 
                            key={price.id}
                            onClick={() => handleCheckout(price)}
                            disabled={isLoading || price.id === priceIdLoading}
                            className="mb-4"
                        >
                            {`Subscribe for ${formatPrice(price)} a ${price.interval}`}
                        </Button>
                    ))
                })}
            </div>
        )
    }

    return (
        <Modal
        title="Only for premium users"
        description="Listen to music with Spotify Premium"
        isOpen={subscribeModal.isOpen}
        onChange={onChange}
        >
            {content}
        </Modal>
    )
}