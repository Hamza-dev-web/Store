"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { Login, SendKey } from "@/lib/action/users.action"
import { useRouter } from "next/navigation"

export function OptModal({userId , email , closeAllModal} :{userId :string , email :string , closeAllModal : ()=> void}) {
  const [value , setValue] = React.useState("")
  const [isSend , setisSend] = React.useState(false)
  const router = useRouter()
  console.log(value)
  async function HandleSubmit(e:React.FormEvent) {
    e.preventDefault()
    console.log("start")
    try{
    if(value != ""){
  console.log("start")
const session = await Login(value , userId)
console.log(session)
if(session){
router.push("/")
}
      }

    }
    catch(err :any){
      console.log(err)
    }
    
  }
  return (
<DialogContent className="sm:max-w-[425px] bg-slate-50 rounded-2xl shadow-lg p-6">
  <DialogHeader className="text-center">
    <DialogTitle className="text-xl font-bold italic font-[cursive] text-gray-800">
      Enter your one-time password
    </DialogTitle>
    <DialogDescription className="text-sm text-gray-600 italic font-[cursive] mt-1">
      Please enter the 6-digit code sent to your device.
    </DialogDescription>
  </DialogHeader>

  <form onSubmit={HandleSubmit} className="mt-4">
    <div className="grid gap-4 py-4">
      <Label
        htmlFor="otp"
        className="text-base font-bold italic font-[cursive] text-gray-700"
      >
        Secret Key
      </Label>

      <InputOTP
        id="otp"
        maxLength={6}
        value={value}
        onChange={(value) => setValue(value)}
        className="flex justify-center gap-2"
      >
        <InputOTPGroup className="flex gap-2">
          {[...Array(6)].map((_, i) => (
            <InputOTPSlot
              key={i}
              index={i}
              className="w-10 h-10 text-center border-2 border-cyan-700 rounded-md font-bold italic font-[cursive] text-lg text-gray-800 focus:border-cyan-900 focus:ring-2 focus:ring-cyan-500 transition-all"
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>

    <DialogFooter className="flex justify-between mt-2">
      <DialogClose asChild>
        <Button
          type="button"
          variant="outline"
          className="font-bold italic font-[cursive] border-cyan-700 text-cyan-800 hover:bg-cyan-50"
          onClick={()=> closeAllModal()}
        >
          Cancel
        </Button>
      </DialogClose>

      <Button
        type="submit"
        variant="outline"
        className="font-bold italic font-[cursive] bg-cyan-700 text-white hover:bg-cyan-800"
      >
        Confirm
      </Button>
    </DialogFooter>

    <p className="text-sm text-gray-600 text-center mt-4 italic font-[cursive]">
      Didn’t get the code?{" "}
      <Button
        type="button"
        onClick={async () => {
          await SendKey(email);
          setisSend(true);
        }}
        disabled={isSend}
        className="font-bold italic font-[cursive] text-cyan-800 hover:text-cyan-900 underline"
      >
        Send Again
      </Button>
    </p>
  </form>
</DialogContent>

  )
}
