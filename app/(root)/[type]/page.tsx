import Card from "@/components/card";
import Sort from "@/components/sort";
import GetFiles from "@/lib/action/file.action";
import { GetAllUser, getUser } from "@/lib/action/users.action";
import { getFileOnType, getFileType } from "@/lib/utils";
import { Models } from "node-appwrite";
 type FileType = 'document' | 'image' | 'video' | 'audio' | 'other';
 declare interface SearchParamProps {
  params?: Promise<any>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}
export  default  async function Page({searchParams ,params} :SearchParamProps){
const type = (await params)?.type as string || ""
const searchText = ((await searchParams))?.query as string || ""
const sort = (await searchParams)?.sort as string || ""; 
const types = getFileOnType(type) as FileType[] | any
const user = await getUser()
if(!user) return
const users =await GetAllUser(user?.rows[0].$id)
const files = await GetFiles({types ,searchText :searchText ,sort})

return (
        <div className="page-container">
<section className="w-full">
<h1 className=" h1 capitalize ">
    {type}
</h1>
<div className=" total-size-section">
    <p className="body-1">
        Total :<span className="h5"> 
0 MB
        </span>
    </p>
<div className="sort-container">
    <p className=" body-1 hidden  sort  sm:block">
        Sort by :
    </p>
    <Sort />
</div>
</div>
</section>
{ files && files.rows.length ? (
<section className="file-list">
    {files.rows.map((file:Models.Document | any) =>(
<Card 
key={file.$id} 
file={file}
owner={user}
users={users}
/>
    ))}
</section>


):(
        <p className=" empty-list"> No files uploaded</p>
    )}


        </div>

    )
}