"use client"
import React ,{useCallback , useState} from "react"
import {useDropzone} from 'react-dropzone'

import { Button } from "./ui/button"
import { cn, convertFileToUrl, getFileType } from "@/lib/utils"
import Image from "next/image"
import Thumbnail from "./thumbnail"
import { toast } from "sonner"
import { MAX_FILE_SIZE } from ".."
import { UploadFile } from "@/lib/action/file.action"
import { usePathname } from "next/navigation"
interface Props{
    ownerId : string 
    className? :string 
    accountId :string
    username :string
}

export const FileUploader =({ownerId , username , className , accountId} :Props)=>{

  const [files , setFiles] = useState([]) 
    const path = usePathname()
    
const onDrop = useCallback(async (acceptedFiles :File[]) => {

      setFiles(acceptedFiles as string[] |  any)
      const uploadPromise = acceptedFiles.map(async (file :any)=>{
if(file.size > MAX_FILE_SIZE ){
   setFiles((prev)=> prev.filter((f:any) => f.name !== file.name))
    toast("the file is greater than the max size")
  }
  console.log(username)
  return  UploadFile({ownerId , accountId ,file, username , path }).then((uplaodedfile :any) =>{
         setFiles((prev)=> prev.filter((f:any) => f.name !== file.name))
return toast("the file was uploaded sucessfully")
    
  })
       })
       await Promise.all(uploadPromise)

  }, [ownerId , accountId, path])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
const handleRemoveFile = (e: React.MouseEvent<HTMLImageElement> , fileName :string)=>{
  e.stopPropagation()
  setFiles((prev)=> prev.filter((file:any) => file.name !== fileName))
} 
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Button type="button" className={cn("uploader-button " ,className)}>
<Image
src="/assets/icons/upload.svg"
alt=""
width={24}
height={24}
/>{" "}
<p className=" font-extrabold ">Upload</p>
</Button>
{files.length > 0  && <ul className="uploader-preview-list">
    <h4 className="h4 text-light-100">Uploading ... </h4>
{files.map((file:any ,index )=>{
const {type , extension } = getFileType(file.name)
return (
<li key={`${file.name}=${index}`}
className="uploader-preview-item"
>
    <div className="flex items-center gap-3">
<Thumbnail 
type={type}
extension={extension}
url={convertFileToUrl(file)}
/>
  <div className="preview-item-name">
{file.name}
<img
src="/assets/icons/file-loader.gif"
width={80}
height={26}
alt=""
/>
</div>
    </div>
    <Image
    src="/assets/icons/remove.svg"
    width={24}
    height={24}
    alt="Remove"
 onClick={(e)=> handleRemoveFile(e , file.name)}
    
    
    />

     </li>

)


})}

    </ul>}
    </div>
  )
}