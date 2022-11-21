export const convertLinkToText = (link: string, length: number = 20) => {
  let newLink = link.replace(/^https?:\/?\/?www\./, "")
  if (newLink.length > length)
    return newLink.length > length
      ? newLink.match(/.+\.[\w\d]+(?=\/)?/)[0]
      : newLink
}

export const debounce = (fn: () => any, time) => {
  let isDebounced = false
  let timeoutId: any
  let _this = this

  return (...args: any) => {
    if (!isDebounced) fn.apply(_this, args)

    isDebounced = true

    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => (isDebounced = false), time)
  }
}
