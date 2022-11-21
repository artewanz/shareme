import { Pin } from "@app/components"
import React from "react"
import Masonry from "react-masonry-css"

const breakpointObj = {
  default: 6,
  2500: 5,
  2000: 4,
  1500: 3,
  1000: 2,
  500: 1,
}

const MasonryLayout = ({ items, setItems }) => {
  return (
    <div className="MasonryLayout">
      {items?.map((item, i) => (
        <article key={i} className="p-2">
          <Pin data={item} setPins={setItems} />
        </article>
      ))}
    </div>
  )
}

export default MasonryLayout

/*
<Masonry
        className="flex animate-slide-fwd"
        breakpointCols={breakpointObj}
      >
      </Masonry>
*/
