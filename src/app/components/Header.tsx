import { logo } from "@app/assets"
import { HiMenu } from "react-icons/hi"
import { Link } from "react-router-dom"

const Header = ({ toggleSidebar }) => {
  return (
    <div className="flex items-center justify-between">
      <HiMenu
        fontSize={40}
        className="cursor-pointer md:hidden"
        onClick={() => {
          toggleSidebar(true)
        }}
      />

      <Link to={"/"}>
        <figure className="w-40">
          <img src={logo} alt="logo" />
        </figure>
      </Link>
    </div>
  )
}

export default Header
