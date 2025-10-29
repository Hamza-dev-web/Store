import ActionDropdown from "@/components/ActionDropdown"
import Chart from "@/components/chart"
import FormattedDateTime from "@/components/formatedDateTime"
import Thumbnail from "@/components/thumbnail"
import GetFiles, { GetDetailsFile } from "@/lib/action/file.action"
import { GetAllUser, getUser } from "@/lib/action/users.action"

export default  async function Page(){
const files = await GetFiles({types :[] , searchText :"" , sort:'' ,limit : 10})
const user = await getUser()
console.log(user)
const users = await GetAllUser(user?.rows[0].$id as string)
if(files?.rows.length == 0) return

    return (
        <div className=" flex flex-row w-full gap-10 flex-2 ">
<Chart id={user?.rows[0].$id as string}/>
<div className="flex flex-col h-screen w-full max-w-[300px] rounded-3xl bg-slate-100 border border-cyan-950 shadow-md p-4">
  <p className="font-bold italic font-[cursive] text-lg text-gray-800 mb-4">
    Recent Files Uploaded
  </p>

  <div className="flex flex-col gap-3 overflow-y-auto">
    {files?.rows.map((file: any) => (
      <div
        key={file.$id}
        className="flex flex-row items-center justify-between bg-white rounded-xl p-2 shadow-sm hover:shadow-md transition-all duration-200"
      >
        <div className="flex flex-row items-center gap-3">
          <Thumbnail
            type={file.type}
            extension={file.extension}
            url={file.url}
            className="w-10 h-10"
            imageClassName="w-10 h-10 rounded-lg"
          />

          <div className="flex flex-col w-[140px] truncate">
            <p className="text-[13px] font-bold italic font-[cursive] text-gray-700 truncate">
              {file.name}
            </p>
            <FormattedDateTime
              date={file.$createdAt}
              className="text-[10px] text-gray-500 italic font-[cursive]"
            />
          </div>
        </div>

        <ActionDropdown
          file={file}
          users={users}
          owner={user?.rows[0]}
        />
      </div>
    ))}
  </div>
</div>
</div>
    )
} 