import { Models } from "appwrite";
import Link from "next/link";
import Thumbnail from "./thumbnail";
import { convertFileSize } from "@/lib/utils";
import FormattedDateTime from "./formatedDateTime";
import ActionDropdown from "./ActionDropdown";

export  default  function Card ({file , owner , users}:{file : Models.Document | any , owner : Models.Document[] | any , users :  Models.Document[] | any } ){
console.log(owner , users)
    return (
        <Link href={file.url} target="_blank" className="file-card block p-4 bg-dark-800 rounded-lg hover:bg-dark-700 transition">
  {/* Header row: Date, Owner, Actions */}
  <div className="flex flex-row items-center justify-between mb-3">
    <p className="text-xs text-light-200 ml-4  font-bold">By: {file.fillownername}</p>
  {  <ActionDropdown file={file} users={users?.rows} owner={owner?.rows[0]} /> } 
  </div>

  {/* Middle section: Thumbnail and File Size */}
  <div className="flex items-center justify-between mb-3">
    <Thumbnail
      type={file.type}
      extension={file.extension}
      url={file.url}
      className="w-20 h-20"
      imageClassName="w-11 h-11"
    />
    <div className="flex flex-col items-end">
      <p className="text-sm text-light-100 font-mono ">{convertFileSize(file.size)}</p>
 
    </div>
  </div>

  {/* Footer: File name */}
     <FormattedDateTime
      date={file.$createdAt}
      className="text-[15px] text-light-100 font-mono"
    />
  <div className="file-details-thumbnail">
    <p className="text-base font-medium text-light-100 truncate font-mono">{file.name}</p>
  </div>
</Link>

    )
}