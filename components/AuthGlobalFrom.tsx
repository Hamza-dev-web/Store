"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { email, z } from "zod"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useCallback, useRef, useState } from "react"
import Link from "next/link"
import { CreateAccount, GetUseViaEmail, SendKey } from "@/lib/action/users.action"
import { useRouter } from "next/navigation"
import { Dialog, DialogTrigger } from "./ui/dialog"
import { OptModal } from "./otpModal"
import TemplateDemo from "./fileauthuploader"
import { constructFileUrl } from "@/lib/utils"
import Basic from "./fileauthuploader"
import { useDropzone } from "react-dropzone"

type FormType = "sign-in" | "sign-up"

const authFormSchema =(formType : FormType)=>{
return z.object({
    email :z.string().email() ,
    fullName :    formType === "sign-up"
        ? z.string().min(2).max(50)
        : z.string().optional(), 
    password :   formType === "sign-up"
        ? z.string().min(2).max(50)
        : z.string().optional()
})
} 
export function AuthForm({type }:{type :FormType}) {
const [isLoading , setIsLoading] = useState(false)
const [errorMessage , setErrorMessage] = useState("")
const [accountId , setAccountId] = useState("")
const formSchema = authFormSchema(type)
const [isitsend , setissend] = useState(false)
const [email , setEmail  ] =useState('')
const router =useRouter()
  const [file, setFile] = useState<File | null | string>(null);
const onDrop = useCallback(async (acceptedFiles :File[]) => {
      setFile(acceptedFiles[0] )
  }, [file])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email :"",
      password :""
    },
  })
  console.log(file)
async  function onSubmit(values: z.infer<typeof formSchema>) {
setIsLoading(true)
  try {
if(type =="sign-up" && file){
  console.log(values.email , values.fullName  , file)
const {user , status} = await CreateAccount(values.email , values.fullName as string , file as string ) as any
if(!user){
   setErrorMessage("probelme while creating  the user")  
   return
}
// @ts-ignore
if(status && status=="sign-in"){
  router.push("/sign-in")
}
console.log(user)
// @ts-ignore
setAccountId( user?.rows[0].accountId )
setEmail(user?.rows[0].email)
setissend(true)
router.push("/")
}
if(type === "sign-in") {
  const user = await GetUseViaEmail(values.email)
  if(!user) return
  if(!isitsend){
  await SendKey(user.rows[0].email)
  }
setEmail(user?.rows[0].email)
 setAccountId(user.rows[0].accountId) 
 router.push("/") 
}
}

catch(err :any){
  console.log(err)
  //setErrorMessage(err)
}
  }
  console.log(file)
  return (
<div className="min-h-screen  mr-[-100px] flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
  <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
    {/* Image Section */}
    <div className="hidden md:block md:w-1/2">
      <Image
        src="/store.png"
        width={900}
        height={500}
        alt="Store"
        className="h-full w-full object-cover"
        priority
      />
    </div>
    {/* Form Section */}
    <div className="w-full md:w-1/2 p-8 sm:p-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {type === "sign-in" ? "Welcome Back 👋" : "Create an Account"}
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name Field */}
          { type === "sign-up" && 
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700">
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your full name"
                    {...field}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />
          }

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    {...field}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />
           { type === "sign-up" && 
           <>
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p className=" border-2 p-5  rounded-2xl shadow-2xl">Drag or drop the file here, or click to select file</p>
      }
    </div>
       
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700">
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your Password"
                    {...field}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="password"
                    />
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />
          </>
          }

          {/* Submit Button */}
     {type === 'sign-up' ? (
           <Button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-300 disabled:opacity-50"
            disabled={isLoading}
          >
            {"Sign Up"}
          </Button> 
     ) :(
<Dialog>
      <DialogTrigger type="submit"
           className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-300 disabled:opacity-50"
            disabled={isLoading}
          >
            {"Sign In"}
</DialogTrigger>
   {accountId != "" && (
        <>
          {

<OptModal userId={accountId} email={email}/>
          
          /* OTP Modal or additional component can be added here */}
        </>
      )}
</Dialog>

     )}

          {/* Error Message */}
          {errorMessage && (
            <p className="text-sm text-red-500 text-center">*{errorMessage}</p>
          )}

          {/* Toggle Sign In/Sign Up */}
          <div className="text-sm text-center text-gray-600">
            {type === "sign-in"
              ? "Don't have an account?"
              : "Already have an account?"}
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="ml-1 text-blue-600 hover:text-blue-800 font-medium"
            >
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </div>
        </form>
      </Form>

   
    </div>
  </div>
</div>
)
}