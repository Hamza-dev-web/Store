"use client"
import Image from "next/image"
import { Input } from "./ui/input"
import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import GetFiles from "@/lib/action/file.action"
import Thumbnail from "./thumbnail"
import FormattedDateTime from "./formatedDateTime"
import { Models } from "appwrite"
export const Search = ()=>{
const [query , setQeury] = useState("")
const searchParams =useSearchParams()
console.log(searchParams)
const searchQuery= searchParams.get('query') || ""
console.log(searchQuery)
const [Resault , setResault] = useState<Models.Document[]>([]) 
const [open , setOpen] = useState(false)
//console.log(searchQuery)
const router = useRouter() 
const path = usePathname()
useEffect(()=>{
    console.log(query)
const fecthFiles = async ()=>{
    const files = await GetFiles({
        types:[],
          searchText : query 
    })
    if(!files) return
    console.log(query)
    setResault( files?.rows as any)
    setOpen(true)

}
fecthFiles()
},[query]) 
console.log(Resault)

useEffect(()=>{
if(!searchQuery) {
    setQeury("")
}

},[searchQuery])
const handleClickItem = (file :Models.Document |any)=> {
setOpen(false)
setResault([])
router.push(
    `/${ file.type }?query=${query}`
)


}
    
return (
<div className="search  items-center">
<div className="search-input-wrapper">
<Image
src="/assets/icons/search.svg"
alt="search"
width={24}
height={24}
/>
<Input
value={query}
placeholder="Search"
className="search-input sort font-bold"
onChange={(e) => setQeury(e.target.value)}
/>
</div>
{open  && query != "" && 
<ul className="search-result items-center">
{Resault && Resault.length > 0 ? (
Resault.map((file :any )=>(
    <li 
    key={file.$id}
    className=" flex items-center justify-between p-4 bg-white border border-amber-100 rounded shadow-md"
    onClick={()=>handleClickItem(file)}
    >
        <div className=" flex cursor-pointer items-center gap-4">
<Thumbnail
type={file.type}
extension={file.extension}
url={file.url}
 className=" size-9 min-w-9"
/>
        </div>
        <p className=" subtitle-2  line-clamp-1 text-light-100">
            {file.name}
        </p>
          <FormattedDateTime
             date={file.$createdAt}
             className=" caption text-light-200 font-mono"
           />
    </li>
))


) :(
<p className="empty-results font-extrabold ml-4 mt-2 p-3 bg-white border border-gray-200 rounded shadow-md">
  No files found
</p>
)}

    </ul>}

</div>
)
}