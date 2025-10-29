"use client"
import { calculateAvailableSize, calculateSize } from "@/lib/action/file.action"
import Image from "next/image"
import { useEffect , useState } from "react"
import RadialBarChart from "./RadialBarChart";
import { convertFileSize } from "@/lib/utils";
export default function Chart ({id} :{id:string}){
const [sizeImage , setSize1] = useState("")
const [sizeDocuments , setSize2] = useState("")
const [sizeOthers , setSize3] = useState("")
const [sizeMedia , setSize4] = useState("")
const [spaceused , setspaceused ] =useState("")
const [totalspace , setTotalspace] = useState(0)
    useEffect(()=>{
        const handleFileSize =async()=>{
            try {
            const img= await calculateSize("images" , id)
            setSize1( convertFileSize(img as number ) as string)
            const doc= await calculateSize("documents" , id)
            console.log(doc)
            setSize2(convertFileSize(doc as number ) as string)
            const oth= await calculateSize("others" , id)
            setSize3(convertFileSize(oth as number  ) as string)
            const md= await calculateSize("media" , id)
            setSize4(convertFileSize(md as number ) as string)
          const used = await calculateAvailableSize(id)
        const total = Number(img)+Number(doc)+Number(oth)+Number(md)
        const t =Number((2*1024*1024*1024))
        console.log( t ,total)
           setspaceused( convertFileSize(t-total) as string)
        setTotalspace(total)
        console.log(used ,total)
    }
            catch (err :any) {
                console.log(err)
            }
        }
        handleFileSize()



    },[])
return (
    <div className=" flex  rounded-4xl bg-amber-100 flex-col h-screen w-[600px] gap-4  border-cyan-950  shadow-amber-800">
<div className=" flex flex-row w-full bg-gray-100 shadow-cyan-800 items-center rounded-4xl h-[200px]">
    <div className=" mr-[-100px]  "> 
      <RadialBarChart size={totalspace}/>
</div>
<div className=" flex flex-col ml-4 items-center justify-center">

    <h3 className="   text-[25px] font-extrabold sort">Available Storage </h3>
    <h3 className=" text-[15px]  font-extrabold  sort">{`${spaceused.split(".00 ").join("")} `}/{" "}2GB </h3>
</div>

</div>
<div className=" flex  ml-4 gap-7 flex-row flex-wrap  max-w-auto">
<div className=" flex flex-col w-[220px] mt-2  bg-white shadow-cyan-200 items-center rounded-4xl h-[180px]">
    <Image
src="/assets/icons/file-image-light.svg"
alt=""
className=" rounded--full mr-[80px]"
height={150}
width={150}
/>

<p className="sort mt-3 "> Image</p>
<p className=" sort mt-10 ml-[100px]"> {sizeImage}</p>
</div>
<div className=" flex flex-col w-[220px] mt-2  bg-white shadow-cyan-200 items-center rounded-4xl h-[180px]">
<Image
src="/assets/icons/file-document-light.svg"
alt=""
className=" rounded--full mr-[80px]"
height={150}
width={150}
/>
<p className="sort mt-3 "> Documents</p>
<p className=" sort mt-10 ml-[100px]"> {sizeDocuments}</p>
</div>
<div className=" flex flex-col w-[220px] mt-2  bg-white shadow-cyan-200 items-center rounded-4xl h-[180px]">
<Image
src="/assets/icons/file-other-light.svg"
alt=""
className=" rounded--full mr-[80px]"
height={150}
width={150}
/>
<p className="sort mt-3 "> Others</p>
<p className=" sort mt-10 ml-[100px]"> {sizeOthers}</p>

</div>
<div className=" flex flex-col w-[220px] mt-2  bg-white shadow-cyan-200 items-center rounded-4xl h-[180px]">
<Image
src="/assets/icons/file-video-light.svg"
alt=""
className=" rounded--full mr-[80px]"
height={150}
width={150}
/>
<p className="sort mt-3 "> Media</p>
<p className=" sort mt-10 ml-[100px]"> {sizeMedia}</p>
</div>
</div>

</div>
)

} 