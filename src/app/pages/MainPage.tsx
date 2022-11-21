import { useEffect, useRef } from "react"
import DefaultLayout from "./layouts/DefaultLayout"
import { Feed, CreatePin, PinDetail } from "@app/containers"
import { Route, Routes } from "react-router-dom"

export default function MainPage() {
  const scrollRef = useRef<HTMLElement>(null)

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0)
  }, [])

  return (
    <DefaultLayout>
      <section className="flex-1" ref={scrollRef}>
        <div>
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/category/:categoryId" element={<Feed />} />
            <Route path="/pin-detail/:pinId" element={<PinDetail />} />
            <Route path="/create-pin" element={<CreatePin />} />
            {/* <Route path="/search" element={<SearchResult />} /> */}
            {/* <Route path="/*" element={<NotFound />} /> */}
          </Routes>
        </div>
      </section>
    </DefaultLayout>
  )
}
