"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Models } from "appwrite"
import { constructDownloadUrl, convertFileSize, formatDateTime } from "@/lib/utils"
import Link from "next/link"
import { DeleteFile, RenameFile  } from "@/lib/action/file.action"
import { MultiUserSelect } from "./MultiSelctor"

export default function ActionDropdown ({file , users , owner} : {file :Models.Document | any , users? :Models.Document | any, owner :Models.Document | any }){
const [isModal , setIsModal] = useState(false)
const [isDropDowMenu , setIsDropDowMenu] = useState(false)
const [action ,setAction] = useState<null | any>(null)
const [name , setname] = useState(file.name)
const [loading , setisLoading] =useState(false)
const closeAllModal = ()=>{
  setIsModal(false)
  setAction(null)
  setIsDropDowMenu(false)
  setisLoading(false)
  setname(file.name)
}
const HandleAction =async()=>{
setisLoading(true)
  try {
  switch(action.value) {
  case "rename" :
await RenameFile(file.$id , name)
  break
    case "delete" :
await DeleteFile(file)
  break
  default : closeAllModal()
}
setisLoading(false)
closeAllModal()
}
catch (err){
  console.log(err)
}

}
const sampleUsers = [
  {id:1 , value: "u1", label: "Alice Johnson", avatarUrl: "/avatars/alice.jpg" },
  { id:2,value: "u2", label: "Bob Smith", avatarUrl: "/avatars/bob.jpg" },
  { id :3 ,value: "u3", label: "Carol Williams", avatarUrl: "/avatars/carol.jpg" },
  // … more users
];
console.log(users)

const renderDialogContent =()=>{
  if(!action) return 
const {value , label} = action

  return (
    <DialogContent className={`${value === "details" ?"shad-dialog" :"shad-dialog w-[250px]"}`}>
    <DialogHeader className=" flex flex-col gap-3">
      <DialogTitle className=" text-center text-light-100">
        {label === "Share"? "Share your files with others" :
         label === "Details" ? "Details of the file " : 
         label === "Delete" ? "Are you sure of deleting ths file ?": 
         label }</DialogTitle>
     {value === 'rename' && <Input type="text" value={name} onChange={(e) => setname(e.target.value)}/>}
    </DialogHeader>
   { ['rename', 
        'delete',
        ].includes(value) && 
                <DialogFooter className=" flex flex-col gap-3 md:flex-row">
                   <Button  onClick={closeAllModal}className=" modal-cancel-button bg-black"> Cancel</Button>
                   <Button onClick={HandleAction} className="modal-submit-button"> 
               <p className="capitalize">{value}</p>
{loading && (
  <Image
  src="/assets/icons/loader.svg"
  alt=""
  width={30}
  height={30}
  className="animate-spin"
  />
)}
      </Button>
      </DialogFooter>}
       {value === "share"  && (
        <MultiUserSelect 
        file={file}
        users={users}
         closeAllModal={closeAllModal}
         loading={loading}
         setisLoading={setisLoading}
         />
  )}
  {value == "details" && (
<>
<div className="w-[320px]  shadow-md rounded-xl p-4 flex flex-col space-y-3">
  {/* Header with image and owner name */}
  <div className="flex items-center space-x-4">
    <Image
      src={
        file.type == "images" ? file.url : 
        file.type === "documents" ?
        "/assets/icons/documents.svg":
        file.type === "media" ?
        "/assets/icons/video.svg"
        :   "/assets/icons/other.svg"
      }
      alt="File thumbnail"
      width={60}
      height={60}
      className="rounded-lg object-cover"
    />
    <p className="font-semibold text-lg text-gray-800">
      Owner: <span className="font-normal text-gray-600">{file.fillownername}</span>
    </p>
  </div>

  {/* File details */}
  <div className="flex justify-between text-sm text-gray-700">
    <DialogTitle className="font-medium text-gray-900">Size:</DialogTitle>
    <span>{convertFileSize(file.size)}</span>
  </div>

 <div className="flex flex-col text-sm text-gray-700">
  <DialogTitle className="font-medium text-gray-900">File Name:</DialogTitle>
  <span className="break-words text-gray-700">{file.name}</span>
</div>


  <div className="flex justify-between text-sm text-gray-700">
    <DialogTitle className="font-medium text-gray-900">Created At:</DialogTitle>
    <span>{formatDateTime(file.$createdAt)}</span>
  </div>
</div>


</>

  )}
     
  </DialogContent>
)




}

 const actionsDropdownItems =   owner?.$id === file.owner ? [
   {
    label: 'Details',
    icon: '/assets/icons/info.svg',
    value: 'details',
  },
  {
    label: 'Rename',
    icon: '/assets/icons/edit.svg',
    value: 'rename',
  },

  {
    label: 'Share',
    icon: '/assets/icons/share.svg',
    value: 'share',
  },
  {
    label: 'Download',
    icon: '/assets/icons/download.svg',
    value: 'download',
  },
  {
    label: 'Delete',
    icon: '/assets/icons/delete.svg',
    value: 'delete',
  },
] : [
    {
    label: 'Details',
    icon: '/assets/icons/info.svg',
    value: 'details',
  },
  {
    label: 'Download',
    icon: '/assets/icons/download.svg',
    value: 'download',
  },
];
//console.log(owner?.$id , file.$id)

return (
<Dialog open={isModal} onOpenChange={setIsModal}>
  <DropdownMenu open={isDropDowMenu} onOpenChange={setIsDropDowMenu}>
    <DropdownMenuTrigger  className="shad-no-focus">
      <Image
        src="/assets/icons/dots.svg"
        width={25}
        height={25}
        className="rounded-full cursor-pointer"
        alt="Menu"
      />
    </DropdownMenuTrigger>

    <DropdownMenuContent className=" bg-gray-100 font-bold border border-dark-700 rounded-md shadow-md p-2 w-[250px]">
      {/* File Name Label */}
      <DropdownMenuLabel className="max-w-full   font-serif text-sm  text-light-100 truncate mb-1">
        {file?.name}
      </DropdownMenuLabel>

      <DropdownMenuSeparator className="my-2 bg-dark-600 h-px" />

      {/* Dropdown Items */}
      {actionsDropdownItems.map((itm) => (
        <DropdownMenuItem
          key={itm.value}
          onClick={() => {
            setAction(itm)
            if ([  'rename',
                  'delete',
                  "details",
                  'share',].includes(itm.value)) {
              setIsModal(true)
            }
          }}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-dark-700 transition text-left"
        >
          {itm.value ==="download" ? (
        <>
          <Image
            src={itm.icon}
            width={30}
            height={30}
            className="rounded-full"
            alt={itm.label}
          />
              <Link href={constructDownloadUrl(file.bucketFeildId)} className="text-sm text-light-100 font-bold">{itm.label}</Link>
        </>
          ):(
            <>
          <Image
            src={itm.icon}
            width={30}
            height={30}
            className="rounded-full"
            alt={itm.label}
          />
          <span className="text-sm text-light-100 font-bold">{itm.label}</span>            
            </>
          )}
    </DropdownMenuItem>
      ))}
  
    </DropdownMenuContent>

    {renderDialogContent()}
  </DropdownMenu>
</Dialog>

)

}