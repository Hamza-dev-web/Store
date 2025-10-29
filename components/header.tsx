"use client"
import { Button } from "./ui/button"
import Image from "next/image"
import { Search } from "./search"
import { FileUploader } from "./fileuploader"
import { Logout } from "@/lib/action/users.action"
import { useRouter } from "next/navigation"
export const Header = ({
    userId ,
    accountId,
    username
}:{
    userId :string ,
    accountId:string,
    username :string
})=>
    {
        const router =useRouter()
return (
    <header className="header">
<Search/>
<div className="header-wrapper">
    <FileUploader 
    ownerId={userId} 
    accountId={accountId}
    username={username}
    />
<Button onClick={async()=> {
    await Logout() 
window.location.reload()
router.push('/sign-in')
}} className="sign-out-button">
<Image
src="/assets/icons/logout.svg"
alt="logo"
width={24}
height={24}
className="w-6"
/>
        </Button>
</div>
    </header>
)
}