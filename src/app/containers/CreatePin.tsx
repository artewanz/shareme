import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import UserContext from "@app/utils/context/userContext"

import { AiOutlineCloudUpload } from "react-icons/ai"
import { MdDelete } from "react-icons/md"
import categories from "@app/utils/constants/categories"
import { Spinner } from "@app/components/index"
import { client } from "@app/client"
import { IUser } from "@app/utils/types"

const inputStyles =
  "w-full border-gray-200 p-2 focus:valid:border-gray-400 invalid:text-red-500 invalid:border-red-500"

function CreatePin() {
  const { user } = useContext<{ user: IUser }>(UserContext)
  const [title, setTitle] = useState("")
  const [about, setAbout] = useState("")
  const [destination, setDestination] = useState("")
  const [loading, setLoading] = useState(false)
  const [fields, setFields] = useState(null)
  const [category, setCategory] = useState("")
  const [imageAsset, setImageAsset] = useState(null)
  const [error, setError] = useState(false)

  const navigate = useNavigate()

  const uploadImage: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    setLoading(true)
    const selectedFile = e.target.files[0]

    const img = await client.assets
      .upload("image", selectedFile, {
        contentType: selectedFile.type,
        filename: selectedFile.name,
      })
      .catch((err) => console.log(err))

    setImageAsset(img)
    setLoading(false)
  }

  const savePin = () => {
    if (!title || !about || !destination || !imageAsset?._id || !category) {
      return setError(true)
    }

    const doc = {
      _type: "pin",
      title: title.trim(),
      about: about.trim(),
      destination: destination.match(/https?:\/\//)
        ? destination
        : "http://" + destination,
      image: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: imageAsset?._id,
        },
      },
      userId: user._id,
      postedBy: { _type: "postedBy", _ref: user._id },
      category,
    }

    client.create(doc).then(() => {
      navigate("/")
    })
  }

  return (
    <div className="flex flex-col place-center h-full">
      <form
        className="flex flex-col justify-center items-center bg-white lg:p-5 p-3 w-full gap-8"
        onChange={() => setError(false)}
        onSubmit={(e) => e.preventDefault()}
      >
        {/* Image upload */}
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
            {loading && (
              <div className="opacity-50">
                {" "}
                <Spinner />
              </div>
            )}
            {!imageAsset && !loading && (
              <label className="flex flex-col place-center opacity-50 cursor-pointer h-full w-full">
                <div className="my-auto flex flex-col place-center">
                  <AiOutlineCloudUpload fontSize={32} />
                  <p>Click to upload</p>
                </div>
                <p className="max-w-[70%] text-center text-xs sm:text-base">
                  Recomendation: use high quality JPG, SVG, PNG, GIF or TIFF
                  less than 20 MB
                </p>

                <input
                  type="file"
                  hidden
                  onChange={uploadImage}
                  accept="image/*"
                />
              </label>
            )}
            {imageAsset && (
              <div className="relative w-full h-full">
                <figure className="h-full">
                  <img src={imageAsset?.url} alt="Uploaded picture" />
                </figure>
                <button
                  className="bg-white p-3 rounded-full absolute bottom-2 right-2 opacity-80 hover:opacity-100"
                  onClick={() => setImageAsset(null)}
                >
                  <MdDelete fontSize={24} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Input fields */}
        <fieldset className="flex flex-1 flex-col gap-6 w-full">
          <label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add your title"
              pattern=".{3,}"
              className={
                "border-b-2 text-2xl xl:text-3xl font-bold peer" +
                " " +
                inputStyles
              }
            />
            <small className="invisible text-red-500 peer-invalid:visible">
              Must be more than 3 symbols.
            </small>
          </label>
          {user && (
            <figure className="flex gap-2 items-center">
              <img
                src={user.image}
                alt="User image"
                className="w-12 rounded-full"
              />
              <figcaption>{user.userName}</figcaption>
            </figure>
          )}

          <label>
            <input
              type="text"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="What is your pin about"
              pattern=".{3,}"
              className={
                "border-b w-full text-base xl:text-xl peer" + " " + inputStyles
              }
            />
            <small className="invisible text-red-500 peer-invalid:visible">
              Must be more than 3 symbols.
            </small>
          </label>
          <label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Add a destination link"
              pattern="(https?:\/\/)?.+\.\w{2,}/?"
              className={
                "border-b text-base xl:text-xl peer" + " " + inputStyles
              }
            />
            <small className="invisible text-red-500 peer-invalid:visible">
              Example: coollink.com
            </small>
          </label>

          <label className="space-y-4">
            <p className="font-medium text-lg xl:text-xl">
              Choose pin category:
            </p>

            <select
              className="w-4/5 text-base xl:text-xl border-b-2 border-gray-200 p-2 rounded-md capitalize"
              value={category}
              required
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="other">Select category</option>
              {categories.map((category) => (
                <option
                  key={category.name}
                  value={category.name}
                  className="border-0 bg-white text-black"
                >
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </fieldset>

        <p
          className={[
            "text-red-500 transition-all text-xl duration-300",
            error ? "visible" : "invisible",
          ].join(" ")}
        >
          Please, fill in all the fields.
        </p>

        <button
          type="submit"
          className="self-end bg-red-500 text-white text-base font-bold py-2 px-6 rounded-full outline-none hover:bg-red-600"
          onClick={savePin}
        >
          Save Pin
        </button>
      </form>
    </div>
  )
}

export default CreatePin
