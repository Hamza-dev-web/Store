import { cn, getFileIcon } from "@/lib/utils"
import Image from "next/image" 
interface Props {
    type :string 
    extension : string
    url?: string
    className?:string 
    imageClassName ?:string
}

export default function Thumbnail ({type , extension , url="" , className , imageClassName}:Props){
    const isImage = type === "image" && extension !== "svg"
    console.log(getFileIcon(extension ,type))
    return (
      <figure className={cn("thumbnail")}>
<Image 
src={   type == "images" ? url : 
        type === "documents" ?
        "/assets/icons/documents.svg":
        type === "media" ?
        "/assets/icons/video.svg"
        :   "/assets/icons/other.svg"} 
alt=""
height={100}
width={100}
priority
className={
    cn("size-8 object-contain w-auto h-auto" , isImage && "thumbnail-image")
}
/>


      </figure>
    )
}