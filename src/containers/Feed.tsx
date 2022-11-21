import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

import { client } from "@src/client"

import { Search, Spinner, MasonryLayout } from "@src/components"
import { feedQuery } from "@src/utils/querys"

function Feed() {
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [pins, setPins] = useState<any[]>(null)
  const { categoryId } = useParams()

  useEffect(() => {
    setLoading(true)

    const query = feedQuery(categoryId, searchTerm)

    client
      .fetch(query)
      .then((data) => {
        setPins(data)
        setLoading(false)
      })
      .catch((err) => {})

    setLoading(true)
  }, [categoryId, searchTerm])

  return (
    <div>
      <div className="w-full mt-4 mb-8">
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      {loading && <Spinner message="We are adding new ideas to your feed!" />}
      {!loading && pins?.length ? (
        <MasonryLayout items={pins} setItems={setPins} />
      ) : (
        <p className="text-gray-500 text-xl text-center">Nothing there.</p>
      )}
    </div>
  )
}

export default Feed
