"use server"
import { InputFile } from "node-appwrite/file";
import { database, storage } from "../database/config";
import { ID, Query } from "appwrite";
import { Models } from "node-appwrite";
import { constructFileUrl, convertFileSize, getFileOnType, getFileType } from "../utils";
import { revalidatePath } from "next/cache";
import { getUser } from "./users.action";

type FileType = 'document' | 'image' | 'video' | 'audio' | 'other';
declare interface GetFilesProps {
  types: FileType[] | string;
  searchText?: string;
  sort?: string;
  limit?: number;
}
export declare interface UploadFileProps {
  file: File;
  ownerId: string;
  accountId: string;
  path: string;
  username :string
}
export async function  UploadFile (
    {ownerId , file , path ,accountId , username } : UploadFileProps
){
try {
      console.log(username)
  const inputFile =   InputFile.fromBuffer(file, file.name);
  const bucketFile = await storage.createFile(
  process.env.NEXT_PUBLIC_APPWRITE_STRORE!,
  ID.unique(),
  inputFile     
    )
    console.log(inputFile , bucketFile)
    const filedocument = {
    type : getFileType(bucketFile.name as string).type,
    name : bucketFile.name ,
    url : constructFileUrl(bucketFile.$id),
    extension : getFileType(bucketFile.name).extension,
    size :bucketFile.sizeOriginal,
    owner :ownerId ,
    accountId ,
    fillownername :username ,
    users :[] ,
    bucketFeildId : bucketFile.$id
}
const newFile = await database.createRow(
  { 
    databaseId :process.env.NEXT_PUBLIC_APPWRITE_DATABASESID!,
    tableId : process.env.NEXT_PUBLIC_APPWRITE_FILES!,
    rowId :ID.unique(),
    data :filedocument
}
).catch(async(error :unknown)=>{
await storage.deleteFile(process.env.NEXT_PUBLIC_APPWRITE_STRORE! ,bucketFile.$id )
return console.log("error",error)
})
revalidatePath("/")
}
catch (err :any) {
    console.log(err)
} 
}

 const getQuery =  (currentUser :Models.Document |  any ,  types: string[] | string,
  searchText: string,
  sort: string,
  limit?: number,)=>{
console.log(types)
  const queries = []
  
  /*[Query.or([
  Query.equal('owner' , [currentUser.$id]),
  Query.contains('users' , [currentUser.email])
])]*/
if(types.length > 0) queries.push(Query.equal("type" , types))
if(searchText != "") queries.push(Query.contains("name" , searchText))
if(sort !="") {
 const [sortBy , orderBy] = sort.split('-')
  queries.push(orderBy === "asc" ? 
     Query.orderAsc(sortBy) : Query.orderDesc(sortBy))
}

if(limit) queries.push(Query.limit( limit))
return queries
}

export default async function GetFiles ({
  types = [],
  searchText = "",
  sort = "$createdAt-desc",
  limit,
}: GetFilesProps){
try {
const currentUser = await getUser()
if(!currentUser) return 
const queries =  getQuery(currentUser.rows[0] as Models.Document | any, types,searchText ,sort,limit)

const files=  await database.listRows({
  databaseId : process.env.NEXT_PUBLIC_APPWRITE_DATABASESID! ,
  tableId : process.env.NEXT_PUBLIC_APPWRITE_FILES!,
  queries :queries
})
return files
}
catch (err :any) {
  console.log(err)
}

}

export async function RenameFile(id :string , name :string) {
try {
  const fileInDb=  await database.updateRow(
   process.env.NEXT_PUBLIC_APPWRITE_DATABASESID! ,
 process.env.NEXT_PUBLIC_APPWRITE_FILES!,
 id,
   {name}
)
return console.log("ok")
}
catch (err :any) {
  console.log(err)
}
}
export async function GetDetailsFile(file:Models.Document | any) {

try {
const fileInDb =  await database.listRows({
  databaseId : process.env.NEXT_PUBLIC_APPWRITE_DATABASESID! ,
  tableId : process.env.NEXT_PUBLIC_APPWRITE_FILES!,
  queries :[Query.equal("$id" , file.$id)]
})
if(fileInDb.rows.length > 0) return fileInDb
}
catch (err :any) {
  console.log(err)
}
}
export async function ShareFile(file:Models.Document | any , users :Models.Document[] | any) {
try {
  const user = await getUser()
  if(!user) return

// Create a Set to prevent duplicates
const updatedUserList = new Set(file.users); // file.users is assumed to be an array of IDs

// Add new user IDs, avoiding duplicates
for (let i = 0; i < users.length; i++) {
  const userId = users[i].$id;
  updatedUserList.add(String(userId)); // Set automatically avoids duplicates
}

// Convert Set back to array
const newUserArray = Array.from(updatedUserList);

// Update the database once with the final list
await database.updateRow(
  process.env.NEXT_PUBLIC_APPWRITE_DATABASESID!,
  process.env.NEXT_PUBLIC_APPWRITE_FILES!,
  file.$id,
  { users: newUserArray }
);


return console.log("ok")


}
catch (err :any) {
  console.log(err)
}
}
export async function DeleteFile(file:Models.Document | any) {
try {
await database.deleteRow(
   process.env.NEXT_PUBLIC_APPWRITE_DATABASESID! ,
 process.env.NEXT_PUBLIC_APPWRITE_FILES!,
    file.$id
);
return console.log("ok")
}
catch (err :any) {
  console.log(err)
}
}
export const calculateSize  = async (type :string , id :string)=>{
  try {
const files =await GetFiles({types:type , searchText :"" })
console.log(id)
if(!files)return
let size =0
for(let i = 0 ; i<files.rows.length ; i++){
  if(files.rows[i].owner == id) {
    console.log(files.rows[i])
  size+=files.rows[i].size
  }  
}
return size
  }
  catch (err :any){
    console.log(err)
  }
}
export const calculateAvailableSize  = async (id :string)=>{
  try {
const files =  await database.listRows({
  databaseId : process.env.NEXT_PUBLIC_APPWRITE_DATABASESID! ,
  tableId : process.env.NEXT_PUBLIC_APPWRITE_FILES!,
  queries :[
    Query.equal("owner" , id)
  ]
})

if(!files)return
let size =0
for(let i = 0 ; i<files.rows.length ; i++){
  size+=files.rows[i].size
  
}
const leftsize=(2*1024*1024*1024) - size
console.log(leftsize)
return convertFileSize(leftsize) 
 }
  catch (err :any){
    console.log(err)
  }
}