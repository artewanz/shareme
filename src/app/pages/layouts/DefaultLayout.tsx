import { useState, useEffect } from "react"

import { motion } from "framer-motion"
import { useLocation } from "react-router-dom"
import { HiOutlineChevronRight } from "react-icons/hi"

import { Header, Sidebar } from "@app/components/index"

export default function DefaultLayout({ children }) {
  const isMinMediumScreen = window.matchMedia("(min-width: 768px)").matches

  const [toggleSidebar, setToggleSidebar] = useState(
    window.matchMedia("(min-width: 768px)").matches
  )
  const location = useLocation()

  useEffect(() => {
    if (!isMinMediumScreen) setToggleSidebar(false)
  }, [location])

  return (
    <>
      <header className="md:hidden fixed top-0 bg-white inset-x-0 p-4 shadow-md z-20">
        <Header toggleSidebar={setToggleSidebar} />
      </header>

      <main
        className={`pt-24 px-4 pb-8 md:pt-8 md:pr-12 transition-padding duration-300 ease-out min-h-screen relative mx-auto ${
          toggleSidebar ? "md:pl-[var(--offset-sidebar)]" : "md:pl-12"
        }`}
      >
        {children}
      </main>

      {toggleSidebar && (
        <motion.aside
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          transition={{
            ease: "easeOut",
            duration: 0.3,
          }}
          className="fixed top-0 left-0 flex md:w-[var(--w-sidebar)] w-4/5 h-sidebar shadow-md z-30"
        >
          <Sidebar toggle={setToggleSidebar} />
        </motion.aside>
      )}

      <footer></footer>

      {toggleSidebar && (
        <div className="fixed inset-0 bg-blackOverlay z-20 md:hidden" />
      )}
      {!toggleSidebar && window.matchMedia("(min-width: 768px)").matches && (
        <motion.button
          initial={{ x: 300 }}
          animate={{ x: 0 }}
          transition={{ ease: "easeOut" }}
          className="fixed top-1/2 left-0 bg-neutral-200 rounded-tr-md py-2 hover:opacity-80"
          onClick={() => setToggleSidebar(true)}
        >
          <HiOutlineChevronRight
            fontSize={40}
            className="text-gray-500 -ml-2"
          />
        </motion.button>
      )}
    </>
  )
}
