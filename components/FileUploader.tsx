'use client'

import { useCallback, Dispatch, SetStateAction } from "react"
import type { FileWithPath } from "@uploadthing/react"
import { useDropzone } from "@uploadthing/react/hooks"
import { generateClientDropzoneAccept } from "uploadthing/client"

import { convertFileToUrl } from "@/lib/utils"
import Button from "@mui/material/Button";
import Image from "next/image";

type FileUploaderProps = {
    imageUrl: string
    setImageUrl: Dispatch<SetStateAction<string>>
    setFile: Dispatch<SetStateAction<File|undefined>>
}

export function FileUploader({ imageUrl, setImageUrl, setFile }: FileUploaderProps) {
    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        setFile(acceptedFiles[0])
        setImageUrl(convertFileToUrl(acceptedFiles[0]))
    }, [setImageUrl, setFile])

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: "image/*" ? generateClientDropzoneAccept(["image/*"]) : undefined,
        maxFiles: 1,
    })

    return (
        <div
            {...getRootProps()}
            className={"flex-center bg-dark-3 flex h-[25rem] cursor-pointer flex-col overflow-hidden rounded bg-grey-50 border border-black/[.23]"}>
            <input {...getInputProps()} className={"cursor-pointer"} />

            {imageUrl ? (
                <div className={"flex h-full w-full flex-1 justify-center "}>
                    <Image
                        src={imageUrl}
                        alt={"image"}
                        width={250}
                        height={250}
                        className={"w-full object-contain object-center"}
                    />
                </div>
            ) : (
                <div className={"flex-center flex-col py-5 text-grey-500"}>
                    <Image src={"/assets/icons/upload.svg"} width={77} height={77} alt={"file upload"} />
                    <h3 className={"mb-2 mt-2"}>Drag photo here</h3>
                    <p className={"p-medium-12 mb-4"}>SVG, PNG, JPG</p>
                    <Button variant={"contained"}>
                        Select from computer
                    </Button>
                </div>
            )}
        </div>
    )
}
