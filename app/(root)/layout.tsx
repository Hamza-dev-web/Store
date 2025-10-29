import { Header } from "@/components/header";
import MobileNavbar from "@/components/mobileNavbar";
import { SideBar } from "@/components/sidebar";
import { getUser } from "@/lib/action/users.action";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  const user = await  getUser()
  if(!user) return redirect("/sign-in")
  return(
 <main className=" flex h-screen">
<SideBar
avatar={user?.rows[0].avatar}
fullName={user?.rows[0].fullname}
email={user?.rows[0].email}
/>
<section className="flex h-full flex-1 flex-col">
<Header
userId={user?.rows[0].$id as string}
accountId={user?.rows[0].accountId}
username ={user?.rows[0].fullname}
/>
<div className=" lg:hidden ">
<MobileNavbar 
fullname={user.rows[0].fullname}
avatar={user.rows[0].avatar}
email={user.rows[0].email}
accountId={user.rows[0].accountId}
ownerId={user.rows[0].ownerId}
/>  
</div>

<div className="main-content"> 
  {children}
  </div>
</section>

 </main>
    )
}