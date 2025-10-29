"use client"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navItems } from "@/constants";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Logout } from "@/lib/action/users.action";
import { FileUploader } from "./fileuploader";
export default function MobileNavbar({ownerId,fullname , avatar ,email,accountId} :{ownerId :string ,fullname :string , avatar :string , email:string, accountId :string }){
const [open , setopen] = useState(false)
const pathname = usePathname()
return (
    <header className="mobile-header">
  <img
width={50}
height={50}
alt=""
className="rounded-full"
src="/store.png"
/>
<Sheet open={open} onOpenChange={setopen}>
<SheetTrigger>
  <Image
width={30}
height={30}
alt=""
src="/assets/icons/menu.svg"
/>
</SheetTrigger>
<SheetContent className="shad-sheet  px-3 bg-amber-600 flex flex-col justify-between h-auto">
  {/* Top Section */}
  <div>
    <SheetTitle>
      <div className="header-user">
        <Image
          width={44}
          height={44}
          alt="avatar"
          className="header-user-avatar"
          src={avatar}
        />
        <div className="sm:hidden lg:block">
          <p className="subtitle-2 capitalize">{fullname}</p>
          <p className="caption">{email}</p>
        </div>
      </div>
      <Separator className="mb-1 bg-light-200/20" />
    </SheetTitle>

    <nav className="mobile-nav">
      <ul className="mobile-nav-list">
        {navItems.map(({ icon, url, name }) => (
          <Link href={url} key={name} className="lg:w-full">
            <li
              className={cn(
                "mobile-nav-item ",
                pathname === url && "shad-active "
              )}
            >
              <Image
                width={24}
                height={24}
                alt=""
                src={icon}
                className={cn("mobile-nav-item", pathname === url && "shad-active")}
              />
              <p >{name}</p>
            </li>
          </Link>
        ))}
      </ul>
    </nav>

    <Separator className="my-5 bg-light-200/20" />
  </div>

  {/* Bottom Section (Logout Button) */}
  <div className="flex flex-col justify-between gap-5 pb-5">
    <FileUploader accountId={accountId} ownerId={ownerId}/>
    <Button
      type="submit"
      className="mobile-sign-out-button w-full flex items-center gap-2"
      onClick={async () => await Logout()}
    >
      <Image src="/assets/icons/logout.svg" alt="logo" width={24} height={24} />
      <p>Logout</p>
    </Button>
  </div>
</SheetContent>
</Sheet>
</header>
)
}