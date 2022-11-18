import { AiFillCloseCircle } from "react-icons/ai"
import { useEffect } from "react"

// icons
import { RiHomeFill } from "react-icons/ri"
import { AiOutlineLogin } from "react-icons/ai"
import { Link, NavLink } from "react-router-dom"
import { logo } from "@src/assets"
import { useContext } from "react"
import UserContext from "@src/utils/context/userContext"

import { IUser } from "@src/utils/types"

import Categories from "@src/utils/constants/categories"

const activeLink =
  "text-black font-bold border-r-4 border-black flex items-center bg-gray-50"
const noActiveLink = "text-gray-500 flex items-center gap-2"

const Sidebar = ({ toggle = null }) => {
  const user: IUser = useContext(UserContext).user

  useEffect(() => {
    setTimeout(() => window.addEventListener("click", onClickHandler))
    return () => window.removeEventListener("click", onClickHandler)
  }, [])

  const onClickHandler = function (e) {
    const target: HTMLElement = e.target

    if (
      !target.closest("[data-content]") &&
      !window.matchMedia("(min-width: 768px)").matches
    )
      toggle(false)
  }

  return (
    <div
      className="bg-white w-full min-h-full p-5 pr-0 flex flex-col overflow-y-auto hide-scrollbar"
      data-content
    >
      <div className="flex justify-end items-center w-full px-5">
        <AiFillCloseCircle
          fontSize={30}
          className="cursor-pointer"
          onClick={() => toggle(false)}
        />
      </div>

      <div className="mb-8">
        <Link to="/" className="flex px-5 gap-2 my-6 pt-1 w-190 items-center">
          <img src={logo} alt="logo" />
        </Link>
      </div>

      <div className="text-xl space-y-10 pl-5 flex flex-col flex-1">
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? activeLink : noActiveLink)}
        >
          <RiHomeFill />
          Home
        </NavLink>

        <nav className="flex flex-col gap-4 flex-1">
          <h3 className="mb-4">Discover categories</h3>
          {Categories.slice(0, Categories.length - 1).map((cat) => (
            <NavLink
              to={`/category/${cat.name}`}
              key={cat.name}
              className={({ isActive }) =>
                (isActive ? activeLink : noActiveLink) +
                " hover:bg-gray-100 rounded-l-full transition-colors"
              }
            >
              {cat.image && (
                <figure className="flex items-center gap-4 capitalize">
                  <img
                    src={cat.image}
                    alt="Category image"
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  <figcaption>{cat.name}</figcaption>
                </figure>
              )}
            </NavLink>
          ))}
        </nav>

        <hr />

        {user ? (
          <Link
            to={`/user-profile/${user?._id}`}
            className="flex items-center gap-2"
          >
            <figure className="w-16 rounded-full overflow-hidden mt-auto">
              <img src={user?.image} alt="logo" className="w-full" />
            </figure>

            <p className="text-lg">{user.userName}</p>
          </Link>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 self-start border border-black py-2 px-4 rounded-full"
          >
            Login <AiOutlineLogin />
          </Link>
        )}
      </div>
    </div>
  )
}

export default Sidebar
