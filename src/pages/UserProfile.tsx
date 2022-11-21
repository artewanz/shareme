import { useContext, useEffect, useState } from "react"
import UserContext from "@src/utils/context/userContext"
import { useNavigate, useParams } from "react-router-dom"
import { GoogleLogout } from "react-google-login"
import DefaultLayout from "./layouts/DefaultLayout"

import { AiOutlineLogout } from "react-icons/ai"
import {
  userQuery,
  userSavedPinsQuery,
  userCreatedPinsQuery,
} from "@src/utils/querys"

import { client } from "@src/client"
import { MasonryLayout, Spinner } from "@src/components"
import { IPin, IUser } from "@src/utils/types"

const randomImage =
  "https://source.unsplash.com/1600x900/?nature,photography,technology"

const UserProfile = () => {
  const activeBtnStyles =
    "bg-red-500 text-white font-bold p-2 px-4 rounded-full outline-none"
  const notActiveBtnStyles =
    "bg-primary text-black p-2 rounded-full w-20 outline-none"

  const { user, setUser } = useContext<{
    user: IUser
    setUser: (data: IUser) => void
  }>(UserContext)
  const [userProfile, setUserProfile] = useState<IUser>(null)
  const [pins, setPins] = useState<IPin[]>(null)
  const [text, setText] = useState("created")
  const [activeBtn, setActiveBtn] = useState("created")
  const navigate = useNavigate()
  const { userId } = useParams()

  const logout = () => {
    localStorage.clear()
    navigate("/")
    setUser(null)
  }

  async function fetchUser() {
    const query = userQuery(userId)

    const data = await client.fetch(query)
    setUserProfile(data)
  }

  useEffect(() => {
    setPins(null)
    setText("created")
    setActiveBtn("created")
    fetchUser()
  }, [userId])

  useEffect(() => {
    if (userProfile) document.title = `${userProfile.userName}: Profile`
  }, [userProfile])

  useEffect(() => {
    let query = ""
    setPins(null)
    if (userProfile) {
      if (activeBtn === "created") {
        query = userCreatedPinsQuery(userProfile._id)
      }
      if (activeBtn === "saved") {
        query = userSavedPinsQuery(userProfile._id)
      }
      client.fetch(query).then((data) => setPins(data))
    }
  }, [text, userId, userProfile])

  if (!userProfile) {
    return (
      <div className="flex h-screen place-center">
        <Spinner message="Loading profile..." />
      </div>
    )
  }

  return (
    <DefaultLayout>
      <section className="relative w-full h-full items-center">
        <div className="flex flex-col">
          <div className="relative flex flex-col gap-y-4">
            <figure className="flex flex-col place-center">
              <img
                className="w-full h-370 2xl:h-510 shadow-lg object-cover"
                src={randomImage}
                alt="banner picture"
              />
              <img
                className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
                src={userProfile.image}
                alt="user-pic"
              />
            </figure>

            <h1 className="text-center font-bold text-3xl">
              {userProfile.userName}
            </h1>

            <div className="text-center flex gap-8 justify-center">
              <button
                onClick={(e) => {
                  setText("created")
                  setActiveBtn("created")
                }}
                className={`${
                  activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles
                }`}
              >
                Created
              </button>
              <button
                onClick={(e) => {
                  setText("saved")
                  setActiveBtn("saved")
                }}
                className={`${
                  activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles
                }`}
              >
                Saved
              </button>
            </div>

            <div className="px-2 py-4">
              {!pins && (
                <div>
                  <Spinner message={`Loading ${text} pins.`} />
                </div>
              )}
              {pins &&
                (pins?.length ? (
                  <MasonryLayout items={pins} setItems={setPins} />
                ) : (
                  <p className="text-center">There are not {text} pins yet.</p>
                ))}
            </div>
          </div>
        </div>

        {user && user._id === userProfile._id && (
          <div className="absolute top-2 right-2 bg-opacity-70 flex justify-end px-4 py-4">
            <GoogleLogout
              clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
              render={(renderProps) => (
                <button
                  type="button"
                  className="bg-white p-2 rounded-full cursor-pointer outline-none shadow-md flex items-center gap-2"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  Logout
                  <AiOutlineLogout />
                </button>
              )}
              onLogoutSuccess={logout}
            />
          </div>
        )}
      </section>
    </DefaultLayout>
  )
}

export default UserProfile
