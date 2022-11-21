import { urlFor, client } from "@src/client"
import { IPin, IUser } from "@src/utils/types"
import React, { FC } from "react"
import { Link, useNavigate } from "react-router-dom"
import { MdDownloadForOffline } from "react-icons/md"
import { AiTwotoneDelete } from "react-icons/ai"
import { BsFillArrowRightCircleFill } from "react-icons/bs"

import { motion, AnimatePresence } from "framer-motion"

import { v4 as idGenerator } from "uuid"
import UserContext from "@src/utils/context/userContext"
import { pinQueryById } from "@src/utils/querys"

import { convertLinkToText } from "@src/utils/functions/helpers"

interface Props {
  data: IPin
  setPins: (setPinsCallback: ((pins: IPin[]) => IPin[]) | IPin[]) => void
}

const Pin: FC<Props> = ({ data: initialData, setPins }) => {
  const isMobileDevice = !window.matchMedia("(min-width: 768px)").matches

  const [data, setData] = React.useState(initialData)
  const [postHovered, setPostHovered] = React.useState(isMobileDevice)
  const user: IUser = React.useContext(UserContext).user

  const { _id, destination, image, postedBy, save, title } = data

  const alreadySaved = save?.filter((item) => item.postedBy._id === _id).length

  const navigate = useNavigate()

  function savePin(id) {
    if (!alreadySaved) {
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: idGenerator(),
            userId: user._id,
            postedBy: {
              _type: "postedBy",
              _ref: user._id,
            },
          },
        ])
        .commit()
        .then(() => client.fetch(pinQueryById(_id)))
        .then((data) => setData(data[0]))
        .catch((err) => err)
    }
  }

  function deletePin(id) {
    client
      .delete(id)
      .then(() => setPins((pins) => pins.filter((pin) => pin._id != id)))
  }

  return (
    <div
      onMouseMove={() => setPostHovered(true)}
      onMouseLeave={() => setPostHovered(false)}
      onClick={() => {
        navigate(`/pin-detail/${_id}`)
      }}
      className="bg-white cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-shadow duration-200"
    >
      <div className="relative rounded-t-lg overflow-hidden">
        <figure>
          <img className="w-full" src={urlFor(image).width(300).url()} alt="" />
        </figure>
        <AnimatePresence>
          {postHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              exit={{ opacity: 0 }}
              className="absolute top-0 w-full h-full flex flex-col justify-between p-2 z-10 text-sm"
            >
              <div className="flex items-center justify-between">
                <a
                  href={`${image.asset.url}?dl`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-black text-xl opacity-75 hover:opacity-100"
                >
                  <MdDownloadForOffline />
                </a>

                <button
                  className="bg-red-500 opacity-75 text-white font-bold px-6 py-2 rounded-full hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    savePin(_id)
                  }}
                >
                  {save?.length ? `${save.length} saved` : "Save"}
                </button>
              </div>
              <div className="flex justify-between items-center gap-2 w-full">
                {destination && (
                  <a
                    onClick={(e) => e.stopPropagation()}
                    href={destination}
                    target="blank"
                    rel="noreferrer"
                    className="bg-white flex items-center gap-2 px-4 py-2 rounded-full opacity-75 hover:opacity-100"
                  >
                    <BsFillArrowRightCircleFill className="-rotate-45" />
                    {convertLinkToText(destination)}
                  </a>
                )}
                {postedBy?._id == user?._id && (
                  <button
                    className="bg-white flex items-center gap-2 px-4 py-2 rounded-full opacity-75 hover:opacity-100 ml-auto"
                    onClick={(e) => {
                      e.stopPropagation()
                      deletePin(_id)
                    }}
                  >
                    <AiTwotoneDelete />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <h3 className="font-bold">{title}</h3>
        </div>
        <hr />
        <Link
          onClick={(e) => e.stopPropagation()}
          to={`/user-profile/${postedBy?._id}`}
          className="flex items-center gap-4"
        >
          {postedBy.image && (
            <img
              src={postedBy.image}
              alt="User Profile Image"
              className="rounded-full w-12"
            />
          )}
          <p className="text-base capitalize">{postedBy.userName}</p>
        </Link>
      </div>
    </div>
  )
}

export default Pin
