"use client"

import { useUploadModal } from "@/hooks/useUploadModal";
import { Modal } from "./Modal";
import { useForm, FieldValues, Form, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { Input } from "./Input";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import uniqid from "uniqid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import Button from "./Button";

export function UploadModal() {
    const [isLoading, setIsLoading] = useState(false);
    const uploadModal = useUploadModal()
    const { user } = useUser()
    const supabaseClient = useSupabaseClient()
    const router = useRouter()

    const { register, handleSubmit, reset } = useForm<FieldValues>({
        defaultValues: {
            author : "",
            title : "",
            song : null,
            image : null
        }
    })

    const onChange = (open: boolean) => {
        if (!open) {
            reset();
            uploadModal.close();
        }
    };

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setIsLoading(true)

            const imageFile = values.image?.[0]
            const songFile = values.song?.[0]

            if (!imageFile || !songFile || !user) {
                toast.error("Please select a song and an image")
                return
            }

            const uniqueID = uniqid()

            //Upload songs
            const {
                data: songData,
                error: songError,
            } = await supabaseClient.storage.from("songs").upload(`song-${values.title}-${uniqueID}.mp3`, songFile, {
                cacheControl: "3600",
                upsert: false,
            })

            if (songError) {
                setIsLoading(false)
                toast.error("Failed to upload song")
            }

            //Upload images
            const {
                data: imageData,
                error: imageError,
            } = await supabaseClient.storage.from("images").upload(`image-${values.title}-${uniqueID}.png`, imageFile, {
                cacheControl: "3600",
                upsert: false,
            })

            if (imageError) {
                setIsLoading(false)
                toast.error("Failed to upload image")
            }

            //Insert song into database
            const { error: supabaseError } = await supabaseClient.from("songs").insert({
                user_id: user.id,
                title: values.title,
                author: values.author,
                image_path: imageData?.path,
                song_path: songData?.path,
            })

            if (supabaseError) {
                setIsLoading(false)
                toast.error("Failed to insert song into database")
            }

            router.refresh
            setIsLoading(false)
            toast.success("Song uploaded successfully")
            reset()
            uploadModal.close()

        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal title="Add a song" description="Upload a mp3 audio file" isOpen={uploadModal.isOpen} onChange={onChange}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                <Input
                    id="title" 
                    disabled={isLoading} 
                    {...register("title", { required: true })}
                    placeholder="Song title"
                />
                <Input
                    id="author" 
                    disabled={isLoading} 
                    {...register("author", { required: true })}
                    placeholder="Author name"
                />
                <div>
                    <div className="pb-1">
                        Select a song file
                    </div>
                    <Input
                        id="song"
                        type="file"
                        accept=".mp3" 
                        disabled={isLoading} 
                        {...register("song", { required: true })}
                    />
                </div>
                <div>
                    <div className="pb-1">
                        Select an image
                    </div>
                    <Input
                        id="image"
                        type="file"
                        accept=".png, .jpg, .jpeg" 
                        disabled={isLoading} 
                        {...register("image", { required: true })}
                    />
                </div>
                <Button disabled={isLoading} type="submit">Create</Button>
            </form>
        </Modal>
    )
}