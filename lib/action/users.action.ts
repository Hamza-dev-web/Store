"use server"
import { ID, Query } from "appwrite";
import { InputFile } from "node-appwrite/file";
import { account, database, storage } from "../database/config";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { constructFileUrl, getFileType } from "../utils";

export const CreateAccount = async(email :string ,fullName : string , file :File |       any)=>{
try {
let user 

 user = await GetUseViaEmail(email)
if(user && user.rows.length > 0 ){
return {user , status : 'sign-in'}
    /*
    (await cookies()).set("email", email, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    })
return user
*/
} 

const accountId = await SendKey(email)  
  const inputFile =   InputFile.fromBuffer(file, file.name);
  const bucketFile = await storage.createFile(
  process.env.NEXT_PUBLIC_APPWRITE_STRORE!,
  ID.unique(),
  inputFile     
    )
 await database.createRow(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASESID!,
    'users',
    ID.unique(),
    {
      fullname: fullName,
      email: email,
      avatar: constructFileUrl(bucketFile.$id),
      accountId: accountId,
    }
  ).catch(async (err :any)=> { 
    console.log(err)
    await storage.deleteFile(
    process.env.NEXT_PUBLIC_APPWRITE_STORE!,
    bucketFile.$id
  )
  }
);
(await cookies()).set("email", email, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    })
user= await GetUseViaEmail(email)
revalidatePath("/")
return {user , status : 'sign-up'}

 }
 catch (err :any) {
    console.log(err)
 }
} 

export const SendKey = async (email :string) =>{
 try {
const sessionToken = await account.createEmailToken({
    userId: ID.unique(),
    email: email
});
return sessionToken.userId

 }
 catch (err :any){
    console.log(err)
 }
}
export const Login = async (key :string , userId :string )=>{
    try {
const session = await account.createSession({
    userId:userId ,
    secret: key
});
if(session){
   const user =  await database.listRows({
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASESID!,
    tableId: 'users',
    queries: [
        Query.equal("accountId",userId),]
});
if(!user) return
(await cookies()).set("email", user.rows[0].email, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    })
 return session
}
    }
    catch (err) {
        console.log(err)
    }
}
 export const GetUseViaEmail = async(email :string) =>  {
    try{
const  user = await database.listRows({
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASESID!,
    tableId: 'users',
    queries: [
        Query.equal("email",email),]
});
if( user ) return user
    }
    catch(err :any) {
        console.log(err)
    }
}
export const getUser =async ()=>{
try {
const email = (await cookies()).get("email") 
if(!email) return
const user = await GetUseViaEmail(email.value)
if(user && user?.rows.length > 0) return user
}
catch (err :any){
    console.log(err)
}
}

export async function Logout(){
    try{
(await cookies()).delete("email" )
 
}
    
    catch (err) {
        console.log(err)
    }
}
export const GetAllUser = async(id :string) =>{
 try {
let  users = await database.listRows({
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASESID!,
    tableId: 'users',
    queries: []
});
users.rows = users.rows.filter((user) => user.$id != id);
if(users.rows.length > 0) return  users

 }
 catch (err :any){
    console.log(err)
 }
}