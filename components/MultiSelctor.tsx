'use client'

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { ShareFile } from "@/lib/action/file.action"
import { Models } from "node-appwrite"
import { toast } from "sonner"
interface MultiUserSelectProps {
  users: any
  file :Models.Document | any
  loading :boolean,
  setisLoading :(arg :boolean)=> void
  closeAllModal :()=> void
}
export function MultiUserSelect({
  users,
  file,
  loading ,
  setisLoading,
  closeAllModal
}: MultiUserSelectProps) {
  const [open, setOpen] = React.useState(false)
const [selectedUsers, setSelectedUsers] =React.useState<string[]>([]);
const isSelected = (user: any) =>
    selectedUsers.some((u:any) => u.$id == user.$id)
  const toggleUser = (user: any) => {
    if (isSelected(user)) {
      setSelectedUsers(selectedUsers.filter((u :any) => u.$id !== user.$id))
    } else {
      setSelectedUsers([...selectedUsers, user])
    }
  }
  const removeUser = (user: any) => {
    const newarray =selectedUsers.filter((u:any) => u.id != user.id)
   console.log(newarray)
    setSelectedUsers(newarray)
  }
  console.log(users.rows , selectedUsers)
  return (
<div className="w-full max-w-md flex flex-col gap-4" >
  <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-full justify-between bg-white text-black font-semibold shadow-sm border-gray-300"
      >
        {selectedUsers?.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {selectedUsers?.map((user: any) => (
              <Badge
                key={user.fullname}
                variant="secondary"
                className="flex items-center gap-1 bg-gray-100 text-black font-medium"      
             >
                {user.fullname}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-gray-500 font-normal">
            Sélectionner des utilisateurs
          </span>
        )}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-gray-500" />
      </Button>
    </PopoverTrigger>
    <PopoverContent
      align="start"
      className="w-full max-w-md p-0 bg-white shadow-md border border-gray-200 rounded-md"
    >
      <Command>
        <CommandInput
          placeholder="Rechercher..."
          className="text-black placeholder-gray-400 font-normal"
        />
        <CommandEmpty className="p-4 text-sm text-gray-500 font-medium">
          Aucun utilisateur trouvé.
        </CommandEmpty>
        <CommandGroup>
          {users?.rows?.map((user: any) => (
            <CommandItem
              key={user.$id}
              onSelect={() => toggleUser(user)}
              className="cursor-pointer px-3 py-2 text-black hover:bg-gray-100 font-medium"
            
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4 text-green-500",
                  isSelected(user) ? "opacity-100" : "opacity-0"
                )}
                  
              />
              <div className="flex flex-row items-center gap-2">
                <Image
                  src="/assets/icons/loader.svg"
                  alt="avatar"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <p>{user.fullname}</p>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </Command>
    </PopoverContent>
  </Popover>

  {/* Display selected users below the popover */}
  {selectedUsers.length > 0 && (
    <div className="flex flex-wrap gap-2 text-sm font-medium text-black">
      <span className="text-gray-600">Utilisateurs sélectionnés :</span>
      {selectedUsers.map((user: any) => (
        <span key={user.$id} className="bg-gray-100 px-2 py-1 rounded">
          {user.fullname}
        </span>
      ))}
    </div>
  )}

  {/* Action Buttons */}
  <div className="flex flex-row justify-end gap-4 pt-2">
    <Button
      onClick={closeAllModal}
      className="bg-white border border-gray-300 text-black hover:bg-gray-100"
    >
      Cancel
    </Button>

    <Button
      onClick={async () => {
        setisLoading(true);
       await ShareFile(file , selectedUsers)
       setisLoading(false)
        toast('the documents wass Shared sucessfulle')
       closeAllModal()
      }}
      className="bg-black text-white hover:bg-gray-800 flex items-center gap-2"
    >
      <p className="capitalize">Share</p>
      {loading && (
        <Image
          src="/assets/icons/loader.svg"
          alt=""
          width={20}
          height={20}
          className="animate-spin"
        />
      )}
    </Button>
  </div>
</div>

  )
}