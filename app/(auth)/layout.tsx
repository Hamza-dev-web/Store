
import "../globals.css"
import Image from "next/image"
export default  function Layout({children} :{children : React.ReactNode}){
return (
<div className=" flex min-h-screen min-w-screen">
<section >
{children}
 </section>
    </div>
)
}