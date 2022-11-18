const onTouchHandler = (e) => {
  e.preventDefault()
}

export function enableScroll() {
  document.body.style.overflowY = null
  document.body.addEventListener("touchmove", onTouchHandler)
}

export function disableScroll() {
  document.body.style.overflowY = "hidden"
  document.body.removeEventListener("touchmove", onTouchHandler)
}
