"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@chakra-ui/react"
import axios from "axios"
import PropTypes from "prop-types"
import { motion, AnimatePresence } from "framer-motion"
import useHttp from "../customHook/useHttp"

// Lucide Icons
import { Search, Settings, LogOut, Menu, X, User, Home, Users, Ticket, FileDown } from "lucide-react"

// shadcn components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Use theme colors
const COLORS = {
  primary: "#2F2983",
  secondary: "#1560bd",
  tertiary: "#1034A6",
}

// Helper to convert hex color to rgba with a given opacity
function hexToRgba(hex, opacity) {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

const Header = ({ greeting }) => {
  const [time, setTime] = useState(new Date())
  const [user, setUser] = useState({})
  const [role, setRole] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const { loading, sendRequest } = useHttp()
  const navigate = useNavigate()
  const toast = useToast()

  // Navigation items
  const mainItems = [
    { title: "Dashboard", url: "/tickets", icon: Home },
    { title: "Tickets", url: "/tickets/ticketlist", icon: Ticket },
    { title: "Export Tickets", url: "/tickets/exporttickets", icon: FileDown },
  ]

  const adminItems = [{ title: "Users", url: "/tickets/usersList", icon: Users }]

  // All navigation items combined for search
  const allNavigationItems = [...mainItems, ...(role === "admin" ? adminItems : [])]

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    const request = {
      url: "http://127.0.0.1:8000/api/user",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }

    sendRequest(request, (data) => setUser(data))
    setRole(localStorage.getItem("role"))
  }, [sendRequest])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [isMobileMenuOpen])

  // Filter search results when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([])
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = allNavigationItems.filter((item) => item.title.toLowerCase().includes(query))
    setSearchResults(filtered)
  }, [searchQuery])

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("accessToken")

      await axios.post(
        "http://127.0.0.1:8000/api/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      localStorage.removeItem("accessToken")
      localStorage.removeItem("id")
      localStorage.removeItem("role")

      navigate("/login")

      toast({
        title: "Logout successful",
        description: "You've been logged out successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "Unable to log out. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    }
  }

  // Handle navigation from search results
  const handleNavigate = (url) => {
    navigate(url)
    setSearchQuery("")
    setShowSearchBar(false)
    setIsMobileMenuOpen(false)
  }

  if (loading) return null

  // Format time
  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })

  // Get greeting based on time of day
  const getTimeGreeting = () => {
    const hour = time.getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  // Get initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <header className="sticky top-0 mx-10 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Main Header */}
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left Side - Mobile Menu and Greeting */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={(e) => {
              e.stopPropagation()
              setIsMobileMenuOpen(!isMobileMenuOpen)
            }}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>

          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
              <AvatarFallback
                style={{
                  background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
                  color: "white",
                }}
              >
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold flex flex-wrap items-center gap-1">
                {getTimeGreeting()}, <span style={{ color: COLORS.primary }}>{user.name}</span>
              </h2>
              <p className="text-sm text-muted-foreground">
                {greeting ||
                  new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-2">
          {/* Search Toggle */}
          <div className="relative">
            <AnimatePresence>
              {showSearchBar ? (
                <motion.div
                  initial={{ width: 40, opacity: 0 }}
                  animate={{ width: 240, opacity: 1 }}
                  exit={{ width: 40, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-background pl-9 pr-8 h-9 rounded-md border border-input text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-9 w-9 text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setShowSearchBar(false)
                      setSearchQuery("")
                    }}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close search</span>
                  </Button>
                </motion.div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setShowSearchBar(true)}
                >
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
              )}
            </AnimatePresence>

            {/* Search Results Dropdown */}
            {showSearchBar && searchResults.length > 0 && (
              <div className="absolute top-full mt-1 w-full bg-white rounded-md border shadow-lg z-50 max-h-[300px] overflow-y-auto">
                {searchResults.map((item, index) => (
                  <button
                    key={index}
                    className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-gray-100 transition-colors"
                    onClick={() => handleNavigate(item.url)}
                  >
                    <span className="text-gray-500">{item.icon && <item.icon className="h-4 w-4" />}</span>
                    <span>{item.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Time Display */}
          <div className="hidden md:flex items-center">
            <div className="text-sm font-medium px-3 py-1.5 rounded-md" style={{ color: COLORS.primary }}>
              {formattedTime}
            </div>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 gap-2 pl-1 pr-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
                  <AvatarFallback
                    style={{
                      background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
                      color: "white",
                    }}
                  >
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start text-left">
                  <span className="text-sm font-medium leading-none">{user.name}</span>
                  <span className="text-xs text-muted-foreground leading-none mt-1">{role || "User"}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center gap-3 p-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
                  <AvatarFallback
                    style={{
                      background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
                      color: "white",
                    }}
                  >
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">{role || "User"}</span>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>My profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur pt-16 md:hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="container px-4 py-4 space-y-6">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background pl-9 pr-3 h-10 rounded-md border border-input text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              {/* Mobile Search Results */}
              {searchQuery.trim() !== "" && searchResults.length > 0 && (
                <div className="bg-white rounded-md border shadow-sm overflow-hidden">
                  {searchResults.map((item, index) => (
                    <button
                      key={index}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors border-b last:border-b-0"
                      onClick={() => handleNavigate(item.url)}
                    >
                      <span className="text-gray-500">{item.icon && <item.icon className="h-5 w-5" />}</span>
                      <span className="font-medium">{item.title}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Main Navigation Items */}
              <div className="space-y-1">
                {mainItems.map((item, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start h-12 text-base"
                    onClick={() => handleNavigate(item.url)}
                  >
                    {item.icon && <item.icon className="h-5 w-5 mr-3" />}
                    {item.title}
                  </Button>
                ))}
              </div>

              {/* Admin Items */}
              {role === "admin" && (
                <div className="pt-2 border-t">
                  <h3 className="font-medium mb-2 text-sm text-muted-foreground px-3">Administration</h3>
                  <div className="space-y-1">
                    {adminItems.map((item, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start h-12 text-base"
                        onClick={() => handleNavigate(item.url)}
                      >
                        {item.icon && <item.icon className="h-5 w-5 mr-3" />}
                        {item.title}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Log out
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

Header.propTypes = {
  greeting: PropTypes.string,
}

export default Header
