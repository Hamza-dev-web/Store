"use client"

import { createContext, useState } from "react"


export const ContextValue = createContext({})




export default function ContextProvider ({children}:{children :React.ReactNode}){
const [avatar , setAvatar] =useState("")
console.log(avatar)
    return (
<ContextValue.Provider value={{avatar , setAvatar}}>
    {children}
</ContextValue.Provider>

)}
