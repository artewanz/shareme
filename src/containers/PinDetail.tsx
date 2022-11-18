import React, { useContext, useEffect, useState } from "react"
import { MdDownloadForOffline, MdOutlineArrowBack } from "react-icons/md"
import { Link, useNavigate, useParams } from "react-router-dom"
import { v4 as idGenerator } from "uuid"

import { client, urlFor } from "@src/client"
import { pinDetailQuery, pinDetailMorePinQuery } from "@src/utils/querys"
import { MasonryLayout, Spinner } from "@src/components"
import { IPin, IUser } from "@src/utils/types"
import { convertLinkToText } from "@src/utils/functions/helpers"
import UserContext from "@src/utils/context/userContext"
import { BsFillArrowRightCircleFill } from "react-icons/bs"

function PinDetail(props) {
  const { user } = useContext<{ user: IUser }>(UserContext)
  const [pins, setPins] = useState<IPin[]>(null)
  const [pinDetail, setPinDetail] = useState<IPin>(null)
  const [comment, setComment] = useState("")

  const { pinId } = useParams<{ pinId: string }>()
  const navigate = useNavigate()

  const fetchPinDetails = async () => {
    let query = pinDetailQuery(pinId)
    if (!query) return

    let data = await client.fetch(query)

    setPinDetail(data?.[0])
    if (!data[0]) throw new Error("Pin details not found.")

    query = pinDetailMorePinQuery(data[0])
    data = await client.fetch(query)
    setPins(data)
  }

  const commentSubmitHandler: React.FormEventHandler = async (e) => {
    e.preventDefault()
    setComment(comment.trim())

    try {
      await client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: idGenerator(),
            postedBy: {
              _type: "postedBy",
              _ref: user._id,
            },
          },
        ])
        .commit()
        .then(() => fetchPinDetails())

      setComment("")
    } catch (e) {}
  }

  useEffect(() => {
    fetchPinDetails().catch((err) => console.error(err))
  }, [pinId])

  if (!pinDetail)
    return (
      <div className="min-h-[80vh] flex place-center">
        <Spinner message="Loading pin." />
      </div>
    )

  return (
    <div className="relative">
      <article className="space-y-4">
        <div className="flex flex-col lg:PinGrid bg-white items-start w-full min-w-[25vw] max-w-full space-y-8 rounded-2xl">
          <figure className="relative self-center">
            <img
              src={pinDetail.image && urlFor(pinDetail.image).url()}
              alt="user-post"
              className="rounded-3xl rounded-b-lg object-cover max-h-[60vh]"
            />
            <a
              href={`${pinDetail.image.asset.url}?dl=`}
              download
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-black text-4xl opacity-75 hover:opacity-100 absolute bottom-2 right-2"
            >
              <MdDownloadForOffline />
            </a>
          </figure>

          <div className="w-full space-y-6 p-5">
            <div className="flex items-center justify-between">
              {pinDetail.destination && (
                <a
                  href={pinDetail.destination}
                  target="_blank"
                  rel="noreferrer"
                >
                  {convertLinkToText(pinDetail.destination)}
                </a>
              )}
            </div>
            <div className="space-y-6">
              <h1 className="text-4xl font-bold break-words">
                {pinDetail.title}
              </h1>
              <p>{pinDetail.about}</p>
            </div>
            <div>
              <Link
                to={`/user-profile/${pinDetail.postedBy?._id}`}
                className="flex items-center gap-2"
              >
                <figure className="w-10 rounded-full overflow-hidden mt-auto">
                  <img
                    src={pinDetail.postedBy?.image}
                    alt="logo"
                    className="w-full"
                  />
                </figure>
                <p className="text-lg font-medium capitalize">
                  {pinDetail.postedBy.userName}
                </p>
              </Link>
            </div>
          </div>
        </div>

        <hr className="w-full" />

        {pinDetail.comments ? (
          <div className="space-y-8 bg-white p-5">
            <h2 className="text-2xl">Comments</h2>
            <div className="max-h-370 space-y-6">
              {pinDetail.comments?.map((comment, i) => (
                <figure className="flex gap-2 items-center" key={i}>
                  <img
                    className="w-10 h-10 rounded-full cursor-pointer"
                    src={comment.postedBy.image}
                    alt="user profile image"
                  />
                  <div className="flex flex-col">
                    <p className="font-bold">{comment.postedBy.userName}</p>
                    <p>{comment.comment}</p>
                  </div>
                </figure>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}

        {user && (
          <div>
            <form
              className="bg-white p-4 flex items-start gap-4"
              onSubmit={commentSubmitHandler}
            >
              <figure>
                <img className="w-12 rounded-full" src={user.image} alt="" />
              </figure>
              <textarea
                value={comment}
                onChange={(e) => {
                  e.target.style.height = null
                  e.target.style.height = e.target.scrollHeight + "px"
                  setComment(e.target.value)
                }}
                className="border rounded-xl p-2 w-full resize-none overflow-hidden h-max"
                rows={1}
                placeholder="Comment..."
              />
              <button className="text-[2.5rem]">
                <BsFillArrowRightCircleFill />
              </button>
            </form>
          </div>
        )}
      </article>
      {!!pins?.length && (
        <div>
          <hr className="my-8" />
          <div className="flex flex-col gap-8">
            <h2 className="text-center font-bold text-2xl">More like this</h2>
            <MasonryLayout items={pins} setItems={setPins} />
          </div>
        </div>
      )}
      <div
        onClick={() => navigate("/")}
        className="absolute bg-white rounded-full p-2 top-4 left-4 cursor-pointer border border-black"
      >
        <MdOutlineArrowBack size={30} />
      </div>
    </div>
  )
}

export default PinDetail
