import React from "react"
import { Oval as Loader } from "react-loader-spinner"
import { red } from "@app/utils/constants/colors"

const Spinner = ({ message = "" }) => {
  return (
    <div className="flex flex-col place-center w-full h-full gap-4">
      <Loader
        color={red}
        secondaryColor={"rgb(156 163 175)"}
        strokeWidth={3}
        width={60}
        height={60}
      />
      <p className="text-gray-400">{message}</p>
    </div>
  )
}

export default Spinner
