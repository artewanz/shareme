import { useEffect, useState } from "react"
import { Routes, Route, useLocation, useNavigate } from "react-router-dom"

import UserContext from "./utils/context/userContext"
import { Login, MainPage, UserProfile } from "@src/pages"

function App() {
  const [user, setUser] = useState(
    localStorage.getItem("user") !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null
  )
  const context = { user, setUser }
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  return (
    <UserContext.Provider value={context}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/user-profile/:userId" element={<UserProfile />} />
        <Route path="/*" element={<MainPage />} />
      </Routes>
    </UserContext.Provider>
  )
}

export default App
