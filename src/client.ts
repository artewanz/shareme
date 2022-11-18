import sanityClient from "@sanity/client"
import imageUrl from "@sanity/image-url"

export const client = sanityClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2022-10-28",
  useCdn: true,
  token: import.meta.env.VITE_SANITY_TOKEN,
  ignoreBrowserTokenWarning: true,
})

const builder = imageUrl(client)

export const urlFor = (source) => builder.image(source)
