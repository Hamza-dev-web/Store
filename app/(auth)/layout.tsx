import ContextProvider from "@/context/context"
import "../globals.css"
import Image from "next/image"
export default  function Layout({children} :{children : React.ReactNode}){
return (
<div className=" flex min-h-screen">
<section >
<ContextProvider>
{children}
</ContextProvider>
 </section>

    </div>
)
}