"use client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePathname, useRouter } from "next/navigation"
import { sortTypes } from ".."


export default  function Sort(){
    const router = useRouter()
    const path = usePathname()
    const handleSortin =(sort :string) =>{
      router.push(`${path}?sort=${sort}`)
    }
    return(
  <Select  value={sortTypes[0].value} onValueChange={handleSortin}>
  <SelectTrigger className="w-[100px]">
    <SelectValue placeholder={sortTypes[0].value} />
  </SelectTrigger>
  <SelectContent >
    {sortTypes.map((sort)=>(
   <SelectItem value={sort.value} key={sort.label} className="sort bg-amber-50">
    {sort.label}
   </SelectItem>
    ))}
 
    
  </SelectContent>
</Select>
    )
}