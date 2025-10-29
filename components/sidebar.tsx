"use client"
import Link from "next/link"
import Image from "next/image"
import { navItems } from "../index"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
interface Props {
   fullName :string
   avatar :string
   email :string  
}
export  const SideBar =({fullName , avatar , email} :Props)=>{
   const pathname= usePathname()
return (
   <aside className="sidebar bg-gray-200">
<Link href="/">
<Image
src="/store.png"
alt="logo"
width={160}
height={50}
className="hidden h-auto lg:block rounded-full"
priority
/>
</Link>
<nav className="sidebar-nav">
<ul className=" flex flex-1 flex-col gap-6">
{navItems.map(({url , icon , name}) =>
(
   <Link href={url} key={name} className=" lg:w-full">
   <li className={
      cn("sidebar-nav-item" , pathname===url 
      && 'shad-active')}>
      <Image 
      src={icon} 
      alt="" 
      width={24} 
      height={24}
      className={cn(
         "nav-icon",
         pathname=== url && "nav-icon-active"
      )}
      />
      <p className=" hidden lg:block sort">{name}</p>
   </li>
   </Link>

))}
</ul>
</nav>
<Image
src="/assets/images/files-2.png"
alt="logo"
width={506}
height={418}
className=" w-full"
/>
<div className=" sidebar-user-info">
<Image
src={avatar}
alt="Avatar"
width={44}
height={44}
className="sidebar-user-avatar"
/>
<div className=" hidden lg:block">
<p className=" subtitle-2 capitalize">
   {fullName}
</p>
<p className="caption">{email}</p>
</div>
</div>


   </aside>
)

}