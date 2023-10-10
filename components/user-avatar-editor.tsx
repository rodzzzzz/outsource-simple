"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { User } from "@prisma/client"
import { useSession } from "next-auth/react"
import Cropper, { Area, Point } from "react-easy-crop"

import getCroppedImg, { readFile, resizeBlob } from "@/lib/crop"
import { useUploadThing } from "@/lib/uploadthing"

import { Icons } from "./icons"
import { Button } from "./ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet"
import { Slider } from "./ui/slider"
import { toast } from "./ui/use-toast"

interface UserAvatarEditorProps
  extends Pick<User, "firstName" | "lastName" | "image"> {}

export function UserAvatarEditor({
  image,
  firstName,
  lastName,
}: UserAvatarEditorProps) {
  const { update, data: session } = useSession()
  const router = useRouter()

  const [avatar, setAvatar] = useState<string | undefined>(undefined)
  const [openEditor, setOpenEditor] = useState(false)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    return () => {
      console.log("Clean up")
    }
  }, [])

  const { startUpload } = useUploadThing("avatarUploader")

  const handleImageUpload = async ({ target: { files } }) => {
    const file = files && files[0]

    if (file) {
      const imageDataUrl = await readFile(file)

      setAvatar(imageDataUrl)
      setOpenEditor(true)
    }
  }

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels)
    },
    []
  )

  const showCroppedImage = useCallback(async () => {
    setIsUploading(true)
    try {
      const croppedImage = await getCroppedImg(avatar!, croppedAreaPixels!)

      var formData = new FormData() //this will submit as a "multipart/form-data" request
      formData.append(
        "avatar",
        await fetch(croppedImage!)
          .then((r) => r.blob())
          .then(async (blobFile: Blob) => {
            const resized = await resizeBlob(blobFile!)
            return new File(
              [resized as BlobPart],
              `${firstName.toLowerCase()}-${lastName.toLowerCase()}-avatar.webp`,
              {
                type: "image/webp",
              }
            )
          })
      )

      const res = await startUpload([formData.get("avatar")!] as any)

      if (!res) {
        setIsUploading(false)

        return toast({
          title: "Your image cannot be uploaded",
          description: "Please try again later",
          variant: "destructive",
        })
      }

      const [fileResponse] = res

      const key = fileResponse?.key

      if (!key) {
        setIsUploading(false)

        return toast({
          title: "Something went wrong",
          description: "Please try again later",
          variant: "destructive",
        })
      }

      await update({
        ...session,
        user: {
          ...session?.user,
          image: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${key}`,
        },
      })

      reset(croppedImage!)

      router.refresh()

      toast({
        description: "Profile picture updated successfully",
      })
    } catch (e) {
      setIsUploading(false)

      return toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      })
    }
  }, [croppedAreaPixels, avatar])

  function reset(croppedImage: string) {
    URL.revokeObjectURL(croppedImage)
    setAvatar(undefined)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)

    setIsUploading(false)
    setOpenEditor(false)
  }

  return (
    <div className="w-[150px] h-[150px] lg:w-[200px] lg:h-[200px]">
      <input
        id="profile-picture"
        type="file"
        name="cover"
        onChange={handleImageUpload}
        accept="img/*"
        className="hidden"
      />
      <label
        htmlFor="profile-picture"
        className="relative grid w-full h-full cursor-pointer place-content-center"
      >
        <Image
          className="relative w-full h-full border rounded-full border-border"
          src={image!}
          alt={`${firstName}-${lastName}-employer-avatar`}
          width={300}
          height={300}
        />
        <span className="absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full gap-1 text-sm font-medium transition-all duration-300 rounded-full bg-gradient-to-t via-accent/70 from-accent/100 to-accent/20 lg:opacity-0 lg:hover:opacity-100">
          <Icons.camera className="hidden w-8 h-8 lg:block" />
          <span>Change photo</span>
        </span>
      </label>
      <Sheet open={openEditor} onOpenChange={setOpenEditor}>
        <SheetContent position="bottom" size="xl">
          <SheetHeader>
            <SheetTitle>Change your profile picture</SheetTitle>
            <SheetDescription>Crop your new profile picture.</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col w-full gap-8 max-w-[300px] mx-auto">
            <div className="relative block w-full h-[300px]">
              <Cropper
                image={avatar}
                crop={crop}
                zoom={zoom}
                zoomSpeed={4}
                minZoom={1}
                maxZoom={3}
                zoomWithScroll={false}
                cropShape="round"
                showGrid={false}
                aspect={1}
                restrictPosition
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                style={{
                  containerStyle: {
                    width: 300,
                    height: 300,
                    marginLeft: "auto",
                    marginRight: "auto",
                    borderRadius: 50,
                  },
                }}
              />
            </div>
            <div className="inline-flex items-center w-full gap-5">
              <Icons.image className="w-6 h-6" />
              <Slider
                value={[zoom]}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="zoom"
                onValueChange={(zoom) => setZoom(zoom[0])}
              />
              <Icons.image className="w-8 h-8" />
            </div>
            <Button
              className=""
              onClick={showCroppedImage}
              disabled={isUploading}
            >
              {isUploading ? (
                <Icons.spinner className="w-4 h-4 animate-spin" />
              ) : (
                <span>Save</span>
              )}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
