import GoogleLogin, { GoogleLoginResponse } from "react-google-login"
import { Link, useNavigate } from "react-router-dom"
import { FcGoogle } from "react-icons/fc"
import { bgVideo } from "@src/assets"
import { logoWhite } from "@src/assets"
import { useEffect, useState } from "react"
import { gapi } from "gapi-script"
import { client } from "@src/client"
import { useContext } from "react"
import UserContext from "@src/utils/context/userContext"
import { userQuery } from "@src/utils/querys"
import { MdArrowBack } from "react-icons/md"

export default function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const { setUser } = useContext(UserContext)

  const successGoogleResponse = (response: GoogleLoginResponse) => {
    const { name, imageUrl, googleId } = response.profileObj

    const doc = {
      _id: googleId,
      _type: "user",
      userName: name,
      userID: googleId,
      image: imageUrl,
    }

    client
      .createIfNotExists(doc)
      .then(() => {
        const query = userQuery(doc._id)
        client
          .fetch(query)
          .then((data) => {
            setUser(data)
            localStorage.setItem("user", JSON.stringify(data))
          })
          .catch((err) => err)
      })
      .then(() => navigate("/", { replace: true }))
  }

  const failureGoogleResponse = (response: GoogleLoginResponse) => {
    console.log(response)
  }

  useEffect(() => {
    const initClient = () => {
      gapi.auth2.init({
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: "",
      })
    }
    gapi.load("client:auth2", initClient)
    setLoading(false)
  }, [])

  return (
    <main className="sm:h-screen h-[100svh] w-screen place-center 2xl:text-xl relative">
      {loading ? (
        <div className="Loader w-20 h-20 animate-spin" />
      ) : (
        <section className="fixed inset-0">
          <video
            src={bgVideo}
            autoPlay
            muted
            loop
            controls={false}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-blackOverlay flex flex-col place-items-center place-content-center gap-4">
            <figure className="w-40 md:w-auto ">
              <img src={logoWhite} alt="Shareme logo" />
            </figure>

            <div className="shadow-2xl space-y-4">
              <GoogleLogin
                clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                render={(renderProps) => (
                  <button
                    type="button"
                    className="bg-mainColor text-black p-4 rounded-lg outline-2 focus:outline disabled:bg-neutral-500 disabled:text-opacity-50 flex items-center gap-x-4"
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                  >
                    <FcGoogle className="w-8 h-8" />
                    Sign in with Google
                  </button>
                )}
                onSuccess={successGoogleResponse}
                onFailure={failureGoogleResponse}
                cookiePolicy="single_host_origin"
              />

              <Link
                className="bg-mainColor text-black p-4 rounded-lg outline-2 focus:outline disabled:bg-neutral-500 flex items-center text-center gap-x-4"
                to="/"
              >
                <MdArrowBack className="w-8 h-8" />
                Cancel
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
