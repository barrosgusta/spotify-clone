'use client'

import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import Button from "./Button";
import { useAuthModal } from "@/hooks/useAuthModal";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@/hooks/useUser";
import { FaUserAlt } from "react-icons/fa";
import toast from "react-hot-toast";

interface HeaderProps {
    children : React.ReactNode;
    className?: string;
}


function getWelcomeMessage():string {
    const currentHour = Date.now();

    if (currentHour >= 0 && currentHour < 12) {
        return "Good Morning";
    } else if (currentHour >= 12 && currentHour < 18) {
        return "Good Afternoon";
    } else {
        return "Good Evening";
    }
}


export function Header({ children, className }: HeaderProps) {
    const AuthModal = useAuthModal();
    const router = useRouter();

    const supabaseClient = useSupabaseClient();
    const { user, userDetails, subscription } = useUser();

    const HandleLogout = async () => {
        const { error } = await supabaseClient.auth.signOut();
        //TODO: Reset any playing songs
        router.refresh();

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Logged out successfully");
        }
    }

    return (
        <div className={twMerge("h-fit bg-gradient-to-b from-emerald-800 p-6", className)}>
            <div className="w-full mb-4 flex items-center justify-between">
                <div className="hidden md:flex gap-x-2 items-center">
                    <button onClick={() => router.back()} className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition">
                        <RxCaretLeft color="white" size={35} />
                    </button>
                    <button onClick={() => router.forward()} className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition">
                        <RxCaretRight color="white" size={35} />
                    </button>
                </div>
                <div className="flex md:hidden gap-x-2 items-center">
                    <button className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition">
                        <HiHome color="black" size={20} />
                    </button>
                    <button className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition">
                        <BiSearch color="black" size={20} />
                    </button>
                </div>
                <div className="flex justify-between items-center gap-x-4">
                    {user ? (
                        <div className="flex gap-x-4 items-center">
                            <Button onClick={HandleLogout} className="bg-white px-6 py-2">
                                Logout
                            </Button>
                            <Button onClick={() => router.push("/account")} className="bg-white">
                                <FaUserAlt />
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div>
                                <Button
                                    onClick={AuthModal.open}
                                    className="bg-transparent text-neutral-300 font-medium">
                                    Sign Up
                                </Button>
                            </div>
                            <div>
                                <Button
                                    onClick={AuthModal.open}
                                    className="bg-white px-6 py-2">
                                    Log in
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="mb-2">
            <h1>
                 { getWelcomeMessage() } <strong>{userDetails?.full_name}</strong>
            </h1>
                {children}
            </div>
        </div>
    )
} 