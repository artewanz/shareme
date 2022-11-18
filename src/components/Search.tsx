import { Link } from "react-router-dom"
import { IoMdAdd, IoMdSearch } from "react-icons/io"

function Search({ searchTerm, setSearchTerm }) {
  return (
    <div className="flex gap-4">
      <div className="flex-1 h-12">
        <form onSubmit={(e) => e.preventDefault()}>
          <label className="flex justify-start items-center w-full h-12 pl-2 rounded-md bg-white border-none utline-none focus-within:shadow-sm">
            <IoMdSearch fontSize={30} />
            <input
              name="searchTerm"
              type="text"
              className="w-full h-full p-2 focus:outline-none"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
              }}
            />
          </label>
        </form>
      </div>
      <Link
        to="/create-pin"
        className="w-12 rounded-md bg-black text-white flex place-center opacity-75 hover:opacity-100"
      >
        <IoMdAdd fontSize={26} />
      </Link>
    </div>
  )
}

export default Search
