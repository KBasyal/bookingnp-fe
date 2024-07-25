import { createContext, useState } from "react"

const AuthContext = createContext ({loggedInUser:null} as any)

export default AuthContext
