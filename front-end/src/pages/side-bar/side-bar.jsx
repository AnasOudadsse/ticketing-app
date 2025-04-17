"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useMediaQuery } from "@chakra-ui/react"
import { Home, Users, Ticket, FileDown, ChevronLeft, ChevronRight, Settings, HelpCircle, LogOut } from "lucide-react"

const SideBar = () => {
  const [role, setRole] = useState("")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isLargerScreen] = useMediaQuery("(min-width: 1000px)")
  const location = useLocation()

  // Fetch the role from localStorage
  useEffect(() => {
    const userRole = localStorage.getItem("role")
    setRole(userRole)
  }, [])

  // Only render the sidebar if the screen is larger than 1000px
  if (!isLargerScreen) return null

  // Navigation items with role-based access control
  const navigationItems = [
    {
      title: "Dashboard",
      icon: <Home size={20} />,
      link: "/tickets",
      roles: ["admin"],
    },
    {
      title: "Users",
      icon: <Users size={20} />,
      link: "/tickets/usersList",
      roles: ["admin"],
    },
    {
      title: "Tickets",
      icon: <Ticket size={20} />,
      link: "/tickets/ticketlist",
      roles: ["admin", "user"],
    },
    {
      title: "Export Tickets",
      icon: <FileDown size={20} />,
      link: "/tickets/exporttickets",
      roles: ["admin"],
    },
  ]

  // Secondary navigation items
  const secondaryNavItems = [
    {
      title: "Settings",
      icon: <Settings size={20} />,
      link: "/settings",
    },
    {
      title: "Help & Support",
      icon: <HelpCircle size={20} />,
      link: "/help",
    },
  ]

  // Filter navigation items based on user role
  const filteredNavItems = navigationItems.filter((item) => !item.roles || item.roles.includes(role))

  return (
    <motion.div
      initial={{ width: isCollapsed ? 80 : 260 }}
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`bg-white h-screen sticky top-0 left-0 border-r border-gray-100 shadow-sm flex flex-col z-10`}
    >
      {/* Logo and collapse button */}
      <div className="flex items-center justify-between px-4 py-6">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              <img src="/UM6SS-logo.png" alt="UM6SS Logo" className="h-8" />
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 hover:bg-green-100 transition-colors duration-200"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Main navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.link
            return (
              <a
                key={item.title}
                href={item.link}
                className={`flex items-center ${
                  isCollapsed ? "justify-center" : "justify-start"
                } px-3 py-3 rounded-lg transition-all duration-200 group ${
                  isActive ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`${
                    isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500 group-hover:text-green-600 group-hover:bg-green-50"
                  } w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200`}
                >
                  {item.icon}
                </div>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className={`ml-3 font-medium ${isActive ? "text-green-700" : "text-gray-700"}`}
                    >
                      {item.title}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && !isCollapsed && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute right-3 w-1.5 h-5 bg-green-500 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </a>
            )
          })}
        </nav>

        {/* Divider */}
        <div className="my-6 border-t border-gray-100" />

        {/* Secondary navigation */}
        <nav className="space-y-1">
          {secondaryNavItems.map((item) => (
            <a
              key={item.title}
              href={item.link}
              className={`flex items-center ${
                isCollapsed ? "justify-center" : "justify-start"
              } px-3 py-3 rounded-lg transition-all duration-200 group text-gray-600 hover:bg-gray-50`}
            >
              <div className="bg-gray-100 text-gray-500 group-hover:text-green-600 group-hover:bg-green-50 w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200">
                {item.icon}
              </div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="ml-3 font-medium text-gray-700"
                  >
                    {item.title}
                  </motion.span>
                )}
              </AnimatePresence>
            </a>
          ))}
        </nav>
      </div>

      {/* User profile section */}
      <div className={`p-3 border-t border-gray-100`}>
        <div
          className={`flex ${
            isCollapsed ? "justify-center" : "justify-between"
          } items-center p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer`}
        >
          <div className="flex items-center">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-medium">
              {role === "admin" ? "A" : "U"}
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="ml-3"
                >
                  <p className="text-sm font-medium text-gray-700">{role === "admin" ? "Administrator" : "User"}</p>
                  <p className="text-xs text-gray-500">{role === "admin" ? "Full Access" : "Limited Access"}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <button className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors duration-200">
                  <LogOut size={16} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export default SideBar
