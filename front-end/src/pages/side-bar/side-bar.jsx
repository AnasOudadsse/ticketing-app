"use client"

import { SidebarProvider } from "@/components/ui/sidebar"

import { useState, useEffect } from "react"
import {
  Home,
  FileText,
  Download,
  Settings,
  LifeBuoy,
  Moon,
  Sun,
  Users,
  User2,
  ChevronUp,
  Grip,
  ChevronDown,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"

import { useNavigate, useLocation } from "react-router-dom"

const AppSidebar = () => {
  const { open } = useSidebar()
  const navigate = useNavigate()
  const location = useLocation()
  const [role, setRole] = useState("")
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Fetch the role from localStorage
  useEffect(() => {
    const userRole = localStorage.getItem("role")
    setRole(userRole || "user")

    // Check user's preferred theme
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const savedTheme = localStorage.getItem("theme")
    setIsDarkMode(savedTheme === "dark" || (!savedTheme && prefersDark))
  }, [])

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem("theme", newMode ? "dark" : "light")
    document.documentElement.classList.toggle("dark", newMode)
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("id")
    localStorage.removeItem("role")
    navigate("/login")
  }

  // Main navigation items
  const mainItems = [
    { title: "Dashboard", url: "/tickets", icon: Home, roles: ["admin"] },
    { title: "Tickets", url: "/tickets/ticketlist", icon: FileText, roles: ["admin", "user"] },
    { title: "Export Tickets", url: "/tickets/exporttickets", icon: Download, roles: ["admin"] },
    { title: "Users", url: "/tickets/usersList", icon: Users, roles: ["admin"] },
  ]

  // Settings items
  const settingsItems = [
    { title: "Settings", url: "/settings", icon: Settings },
    { title: "Help & Support", url: "/help", icon: LifeBuoy },
  ]

  // Filter navigation items based on user role
  const filteredMainItems = mainItems.filter((item) => !item.roles || item.roles.includes(role))

  return (
    <Sidebar collapsible="icon" className="fixed left-0 top-0 h-full">
      <SidebarHeader className="px-4 py-6 bg-white dark:bg-gray-800 flex items-start">
        {open ? (
          <img src="/UM6SS-logo.png" alt="UM6SS Logo" className="h-12 w-auto" />
        ) : (
          <img src="/UM6SS-logo-cropped.png" alt="UM6SS Logo" className="h-8 w-10" />

        )}
      </SidebarHeader>

      <SidebarContent className="bg-white dark:bg-gray-800">
        <SidebarGroup>
          <SidebarGroupLabel className="text-left pl-4">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <a href={item.url} className="flex items-center gap-2 pl-4">
                      <item.icon className="h-5 w-5" />
                      {open && <span>{item.title}</span>}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <SidebarMenuItem>
                <Collapsible defaultOpen={false}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="flex items-center gap-2 pl-4">
                      <Grip className="h-5 w-5" />
                      {open && <span>Settings</span>}
                      {open && <ChevronDown className="ml-auto" />}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {open && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {settingsItems.map((item) => (
                          <SidebarMenuSubItem
                            className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md w-full ml-0 p-0.5"
                            key={item.title}
                          >
                            <div className="m-1">
                              <a href={item.url} className="flex items-center gap-2 pl-4">
                                <item.icon className="h-5 w-5" />
                                <span>{item.title}</span>
                              </a>
                            </div>
                          </SidebarMenuSubItem>
                        ))}
                        <SidebarMenuSubItem className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md w-full ml-0 p-0.5">
                          <div className="m-1">
                            <button onClick={toggleDarkMode} className="flex items-center gap-2 pl-4 w-full text-left">
                              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                              <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
                            </button>
                          </div>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </Collapsible>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-white dark:bg-gray-800">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="flex items-center gap-2 pl-4">
                  <User2 className="h-5 w-5" />
                  {open && (
                    <>
                      <span>{role ? role.charAt(0).toUpperCase() + role.slice(1) : "User"}</span>
                      <ChevronUp className="ml-auto" />
                    </>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
        {open && (
          <div className="flex items-center justify-center py-4 text-sm text-gray-500 dark:text-gray-400">
            <span>UM6SS © {new Date().getFullYear()}</span>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}

// Main component that combines the sidebar with content
const SidebarLayout = ({ children }) => {
  return (
    <div className="flex">
      <AppSidebar />
          <div className="m-5" >
            <SidebarTrigger />
          </div>

    </div>
  )
}

// Wrapper component to conditionally render the sidebar
const SidebarWrapper = ({ children }) => {
  const location = useLocation()

  // Check if we're on a login or authentication page
  const isAuthPage =
    location.pathname.includes("/login") || location.pathname.includes("/register") || location.pathname === "/"

  return (
    <div className="min-h-screen">
      {isAuthPage ? (
        children
      ) : (
        <SidebarProvider defaultOpen={true}>
          <SidebarLayout>{children}</SidebarLayout>
        </SidebarProvider>
      )}
    </div>
  )
}

export { AppSidebar, SidebarLayout, SidebarWrapper }
export default SidebarWrapper
