"use client"

import { useState, useEffect } from "react"
import DataTable from "react-data-table-component"
import { useToast } from "@chakra-ui/react"
import Swal from "sweetalert2"

// Lucide Icons
import { Search, Edit, Trash2, ChevronUp, Users, UserPlus, Filter, Download, RefreshCw } from "lucide-react"

// Components
import Header from "../header/header"
import useHttp from "../customHook/useHttp"
import { LoadingScreen } from "@/components/ui/loading-screen"

import AddUserModal from "./add-user-modal"
import  UpdateUserModal  from "./update-user-modal"
// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Role badge component for better visual representation
const RoleBadge = ({ role }) => {
  const roleStyles = {
    admin: "bg-purple-100 text-purple-800 border-purple-200",
    "super-admin": "bg-red-100 text-red-800 border-red-200",
    client: "bg-blue-100 text-blue-800 border-blue-200",
    supportIt: "bg-green-100 text-green-800 border-green-200",
    default: "bg-gray-100 text-gray-800 border-gray-200",
  }

  const style = roleStyles[role] || roleStyles.default

  return <span className={`text-xs px-2.5 py-0.5 rounded-full ${style} border`}>{role}</span>
}

const UsersList = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { loading, sendRequest } = useHttp()
  const toast = useToast()

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState(null)

  // Fetch users data
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setIsRefreshing(true)
    const token = localStorage.getItem("accessToken")
    const request = {
      url: "http://127.0.0.1:8000/api/users",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }

    sendRequest(request, (data) => {
      setData(data.users)
      setFilteredData(data.users)
      setIsRefreshing(false)
    })
  }

  // Handle search input change
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)

    // Apply both search and role filters
    filterData(term, selectedRole)
  }

  // Handle role filter change
  const handleRoleFilter = (role) => {
    setSelectedRole(role)
    filterData(searchTerm, role)
  }

  // Apply both filters
  const filterData = (term, role) => {
    let filtered = [...data]

    // Apply search filter
    if (term) {
      filtered = filtered.filter(
        (user) =>
          (user.name && user.name.toLowerCase().includes(term)) ||
          (user.email && user.email.toLowerCase().includes(term)) ||
          (user.departement && user.departement.toLowerCase().includes(term)) ||
          (user.fonction && user.fonction.toLowerCase().includes(term)),
      )
    }

    // Apply role filter
    if (role && role !== "all") {
      filtered = filtered.filter((user) => user.role === role)
    }

    setFilteredData(filtered)
  }

  // Handle user deletion
  const handleDeleteUser = async (id, userName) => {
    const response = await Swal.fire({
      title: "Delete User",
      text: `Are you sure you want to delete ${userName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    })

    if (response.isConfirmed) {
      const token = localStorage.getItem("accessToken")

      const request = {
        url: `http://127.0.0.1:8000/api/drop-user/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }

      sendRequest(request, (response) => {
        toast({
          title: "User Deleted",
          description: `${userName} has been removed successfully.`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        })

        // Refresh the user list
        fetchUsers()
      })
    }
  }

  // Export users to CSV
  const exportUsers = () => {
    const headers = ["Name", "Email", "Role", "Department", "Function"]

    const csvData = filteredData.map((user) => [
      user.name || "",
      user.email || "",
      user.role || "",
      user.departement || "",
      user.fonction || "",
    ])

    // Create CSV content
    const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n")

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `users_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export Complete",
      description: `${filteredData.length} users exported to CSV`,
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top-right",
    })
  }

  // Open update modal
  const handleOpenUpdateModal = (userId) => {
    setSelectedUserId(userId)
    setIsUpdateModalOpen(true)
  }

  // DataTable columns configuration
  const columns = [
    {
      name: "Name",
      selector: (row) => row.name || "—",
      sortable: true,
      cell: (row) => (
        <div className="py-2">
          <div className="font-medium">{row.name || "—"}</div>
          {row.email && <div className="text-xs text-gray-500">{row.email}</div>}
        </div>
      ),
    },
    {
      name: "Role",
      selector: (row) => row.role || "—",
      sortable: true,
      cell: (row) => <RoleBadge role={row.role} />,
    },
    {
      name: "Department",
      selector: (row) => row.departement || "—",
      sortable: true,
    },
    {
      name: "Function",
      selector: (row) => row.fonction || "—",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                  onClick={() => handleOpenUpdateModal(row.id)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit User</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => handleDeleteUser(row.id, row.name)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete User</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
      width: "120px",
    },
  ]

  // Custom styles for DataTable
  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#f9fafb",
        borderBottomWidth: "1px",
        borderBottomColor: "#e5e7eb",
      },
    },
    headCells: {
      style: {
        fontSize: "0.875rem",
        fontWeight: "600",
        color: "#4b5563",
        paddingLeft: "16px",
        paddingRight: "16px",
      },
    },
    rows: {
      style: {
        fontSize: "0.875rem",
        fontWeight: "400",
        color: "#1f2937",
        backgroundColor: "#ffffff",
        minHeight: "48px",
        "&:not(:last-of-type)": {
          borderBottomStyle: "solid",
          borderBottomWidth: "1px",
          borderBottomColor: "#f3f4f6",
        },
        "&:hover": {
          backgroundColor: "#f9fafb",
        },
      },
    },
    cells: {
      style: {
        paddingLeft: "16px",
        paddingRight: "16px",
      },
    },
    pagination: {
      style: {
        fontSize: "0.875rem",
        minHeight: "56px",
        borderTopStyle: "solid",
        borderTopWidth: "1px",
        borderTopColor: "#e5e7eb",
      },
      pageButtonsStyle: {
        borderRadius: "0.375rem",
        height: "32px",
        width: "32px",
        padding: "0",
        margin: "0 4px",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        backgroundColor: "#ffffff",
        "&:disabled": {
          cursor: "unset",
          color: "#d1d5db",
          backgroundColor: "#f3f4f6",
        },
        "&:hover:not(:disabled)": {
          backgroundColor: "#f3f4f6",
        },
        "&:focus": {
          outline: "none",
          backgroundColor: "#e5e7eb",
        },
      },
    },
  }

  // Get unique roles for the filter
  const roles = ["all", ...new Set(data.map((user) => user.role).filter(Boolean))]

  // Count users by role
  const userCounts = roles.reduce((acc, role) => {
    if (role === "all") {
      acc[role] = data.length
    } else {
      acc[role] = data.filter((user) => user.role === role).length
    }
    return acc
  }, {})

  if (loading && !isRefreshing && data.length === 0) {
    return <LoadingScreen message="Loading users" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        name="Mezrioui Hakim"
        greeting="Have a nice day"
        role="super-admin"
        profile="https://img.freepik.com/photos-premium/photo-profil-vecteur-plat-homme-elegant-generee-par-ai_606187-310.jpg"
      />

      <div className="container mx-auto px-4 py-8">
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Users className="mr-2 h-6 w-6" />
                  User Management
                </CardTitle>
                <CardDescription className="text-blue-100 mt-1">
                  View, add, edit and manage system users
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {filteredData.length} users
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Role filter tabs */}
            <Tabs value={selectedRole} onValueChange={handleRoleFilter} className="mb-6">
              <TabsList className="grid grid-cols-5">
                {roles.map((role) => (
                  <TabsTrigger key={role} value={role} className="capitalize">
                    {role}
                    <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-700">
                      {userCounts[role]}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Search and actions */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by name, email, department..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-9 pr-4 w-full md:w-80"
                />
              </div>

              <div className="flex items-center space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={fetchUsers}
                        disabled={isRefreshing}
                        className="h-10 w-10"
                      >
                        <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Refresh users</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-10">
                      <Filter className="h-4 w-4 mr-2" />
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={exportUsers}>
                      <Download className="h-4 w-4 mr-2" />
                      Export to CSV
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button onClick={() => setIsAddModalOpen(true)} className="h-10">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>

            {/* Users table */}
            <div className="border rounded-lg overflow-hidden bg-white">
              <DataTable
                columns={columns}
                data={filteredData}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                sortIcon={<ChevronUp size={16} />}
                customStyles={customStyles}
                progressPending={isRefreshing}
                progressComponent={
                  <div className="flex justify-center items-center p-6">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
                    <span className="ml-3 text-blue-600 font-medium">Loading users...</span>
                  </div>
                }
                noDataComponent={
                  <div className="flex flex-col items-center justify-center p-10 text-center">
                    <Users className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No users found</h3>
                    <p className="text-gray-500 mt-1">
                      {searchTerm || selectedRole !== "all"
                        ? "Try adjusting your search or filters"
                        : "Add a new user to get started"}
                    </p>
                    {(searchTerm || selectedRole !== "all") && (
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => {
                          setSearchTerm("")
                          setSelectedRole("all")
                          setFilteredData(data)
                        }}
                      >
                        Clear filters
                      </Button>
                    )}
                  </div>
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add User Modal */}
      <AddUserModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={fetchUsers} />

      {/* Update User Modal */}
      <UpdateUserModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        userId={selectedUserId}
        onSuccess={fetchUsers}
      />
    </div>
  )
}

export default UsersList
