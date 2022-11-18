import React from "react"
import { useParams } from "react-router-dom"

function SearchResult() {
  const params = useParams()
  console.log(params)

  return <div>SearchResult</div>
}

export default SearchResult
