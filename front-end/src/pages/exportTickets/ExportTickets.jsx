"use client"

import { useState, useEffect } from "react"
import { saveAs } from "file-saver"
import * as XLSX from "xlsx"
import { useToast } from "@chakra-ui/react"
import { motion } from "framer-motion"
import PropTypes from "prop-types"
import useHttp from "../customHook/useHttp"
import Header from "../header/header"

// Lucide Icons
import {
  FileDown,
  Search,
  Calendar,
  Filter,
  Download,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  Loader2,
  Users,
  User,
  Tag,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  PauseCircle,
  Activity,
} from "lucide-react"

// shadcn components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Status badge component
const StatusBadge = ({ status }) => {
  let bgColor, textColor, icon

  switch (status) {
    case "opened":
      bgColor = "bg-emerald-100"
      textColor = "text-emerald-800"
      icon = <AlertCircle className="h-3 w-3 text-emerald-600 mr-1" />
      break
    case "reserved":
      bgColor = "bg-amber-100"
      textColor = "text-amber-800"
      icon = <PauseCircle className="h-3 w-3 text-amber-600 mr-1" />
      break
    case "resolved":
      bgColor = "bg-blue-100"
      textColor = "text-blue-800"
      icon = <CheckCircle className="h-3 w-3 text-blue-600 mr-1" />
      break
    case "closed":
      bgColor = "bg-red-100"
      textColor = "text-red-800"
      icon = <XCircle className="h-3 w-3 text-red-600 mr-1" />
      break
    default:
      bgColor = "bg-gray-100"
      textColor = "text-gray-800"
      icon = null
  }

  return (
    <Badge className={`${bgColor} ${textColor} flex items-center gap-1 border-none`}>
      {icon}
      <span className="capitalize">{status}</span>
    </Badge>
  )
}

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
}

const ExportTickets = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [problems, setProblems] = useState([])

  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [search, setSearch] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [searchBy, setSearchBy] = useState("support_it")

  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortField, setSortField] = useState("created_at")
  const [sortDirection, setSortDirection] = useState("desc")
  const [isExporting, setIsExporting] = useState(false)

  const { sendRequest, loading } = useHttp()
  const toast = useToast()

  // Status options for filtering
  const statusOptions = [
    { value: "all", label: "All Statuses", icon: <Activity className="h-4 w-4 text-gray-500" /> },
    { value: "opened", label: "Opened", icon: <AlertCircle className="h-4 w-4 text-emerald-600" /> },
    { value: "reserved", label: "Reserved", icon: <PauseCircle className="h-4 w-4 text-amber-600" /> },
    { value: "resolved", label: "Resolved", icon: <CheckCircle className="h-4 w-4 text-blue-600" /> },
    { value: "closed", label: "Closed", icon: <XCircle className="h-4 w-4 text-red-600" /> },
  ]

  // Fetch data on component mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    const request1 = {
      url: "http://127.0.0.1:8000/api/getTicketsByUser",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
    const request2 = {
      url: "http://127.0.0.1:8000/api/problems",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }

    sendRequest(request1, getData1)
    sendRequest(request2, getData2)
  }, [])

  const getData1 = (dataRec) => {
    setData(dataRec.tickets)
    setFilteredData(dataRec.tickets)
  }

  const getData2 = (dataRec) => {
    setProblems([...dataRec])
  }

  // Apply filters when filter values change
  useEffect(() => {
    handleFilter()
  }, [selectedCategory, selectedStatus, search, startDate, endDate, searchBy])

  // Filter functions
  const handleFilter = () => {
    const ticketsFiltredByProblems = handleFilterByProblems(data)
    const ticketsFiltredByStatus = handleFilterByStatus(ticketsFiltredByProblems)
    const ticketsFiltredBySearch = handleFiltredBySearch(ticketsFiltredByStatus)
    const ticketsFiltredByDate = handleFiltredByDate(ticketsFiltredBySearch)

    setFilteredData(ticketsFiltredByDate)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleFilterByProblems = (values) => {
    if (selectedCategory === "" || selectedCategory === "all") {
      return values
    }
    const resultat = values.filter((ticket) => {
      if (selectedCategory && ticket.problem_id == selectedCategory) {
        return ticket
      }
      return false
    })

    return resultat.length === 0 ? [] : resultat
  }

  const handleFilterByStatus = (values) => {
    if (selectedStatus === "all") {
      return values
    }

    return values.filter((ticket) => ticket.status === selectedStatus)
  }

  const handleFiltredBySearch = (values) => {
    if (search === "") {
      return values
    }

    const resultat = values.filter((ticket) => {
      if (
        ticket[searchBy] &&
        ticket[searchBy].name &&
        ticket[searchBy].name.toLowerCase().includes(search.toLowerCase())
      ) {
        return ticket
      }
      return false
    })

    return resultat
  }

  const handleFiltredByDate = (values) => {
    const resultat = values.filter((ticket) => {
      const ticketDate = new Date(ticket.created_at)
      const start = startDate ? new Date(startDate) : null
      const end = endDate ? new Date(endDate) : null

      if (start && end) {
        return ticketDate >= start && ticketDate <= end
      } else if (start) {
        return ticketDate >= start
      } else if (end) {
        return ticketDate <= end
      }

      return true // If no date is selected, return all values
    })

    return resultat
  }

  // Handle sorting
  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === "asc"
    setSortDirection(isAsc ? "desc" : "asc")
    setSortField(field)

    const sortedData = [...filteredData].sort((a, b) => {
      // Handle nested properties
      const getNestedValue = (obj, path) => {
        const parts = path.split(".")
        return parts.reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : ""), obj)
      }

      let valueA, valueB

      if (field.includes(".")) {
        valueA = getNestedValue(a, field)
        valueB = getNestedValue(b, field)
      } else {
        valueA = a[field] || ""
        valueB = b[field] || ""
      }

      // Handle string comparison
      if (typeof valueA === "string") {
        return isAsc ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
      }

      // Handle date comparison
      if (field === "created_at" || field === "resolution_date") {
        const dateA = valueA ? new Date(valueA) : new Date(0)
        const dateB = valueB ? new Date(valueB) : new Date(0)
        return isAsc ? dateA - dateB : dateB - dateA
      }

      // Default comparison
      return isAsc ? (valueA > valueB ? 1 : -1) : valueB > valueA ? 1 : -1
    })

    setFilteredData(sortedData)
  }

  // Get status counts for the status tabs
  const getStatusCounts = () => {
    const counts = {
      all: data.length,
      opened: 0,
      reserved: 0,
      resolved: 0,
      closed: 0,
    }

    data.forEach((ticket) => {
      if (counts.hasOwnProperty(ticket.status)) {
        counts[ticket.status]++
      }
    })

    return counts
  }

  const statusCounts = getStatusCounts()

  // Pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage)
  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory("")
    setSelectedStatus("all")
    setSearch("")
    setStartDate("")
    setEndDate("")
    setSearchBy("support_it")
  }

  // Export to Excel
  const exportToExcel = async () => {
    try {
      setIsExporting(true)

      // Prepare data for export - clean up nested objects
      const exportData = filteredData.map((ticket) => ({
        Problem: ticket.problem?.name || "",
        Status: ticket.status || "",
        "Support IT": ticket.support_it?.name || "",
        Client: ticket.creator?.name || "",
        "Created Date": ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : "",
        "Resolution Date": ticket.resolution_date ? new Date(ticket.resolution_date).toLocaleDateString() : "",
        Description: ticket.description || "",
      }))

      // Convert data to Excel
      const worksheet = XLSX.utils.json_to_sheet(exportData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets")

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      })

      // Create Blob and save file
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      })

      // Simulate delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 800))

      saveAs(data, `Tickets_Report_${new Date().toISOString().split("T")[0]}.xlsx`)

      toast({
        title: "Export successful",
        description: `${filteredData.length} tickets exported to Excel`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      })
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export failed",
        description: "There was an error exporting the data",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      })
    } finally {
      setIsExporting(false)
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        name="Mezrioui Hakim"
        greeting="Have a nice day"
        role="super-admin"
        profile="https://img.freepik.com/photos-premium/photo-profil-vecteur-plat-homme-elegant-generee-par-ai_606187-310.jpg"
      />

      <div className="container mx-auto max-w-[1280px] px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center">
                    <FileDown className="mr-2 h-6 w-6" />
                    Export Tickets
                  </CardTitle>
                  <CardDescription className="text-blue-100 mt-1">
                    Filter, sort and export ticket data to Excel
                  </CardDescription>
                </div>
                <div className="bg-white/20 rounded-full p-2">
                  <FileSpreadsheet className="h-6 w-6" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              {/* Status Tabs */}
              <Tabs value={selectedStatus} onValueChange={setSelectedStatus} className="mb-6">
                <TabsList className="grid grid-cols-5 mb-2">
                  {statusOptions.map((status) => (
                    <TabsTrigger key={status.value} value={status.value} className="flex items-center gap-2">
                      {status.icon}
                      <span>{status.label}</span>
                      <Badge variant="secondary" className="ml-1 bg-white/20">
                        {statusCounts[status.value]}
                      </Badge>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1 text-gray-700">
                    <Tag className="h-4 w-4 text-gray-500" />
                    Problem Category
                  </label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">All Categories</SelectItem>
                        {problems.map((problem) => (
                          <SelectItem key={problem.id} value={problem.id.toString()}>
                            {problem.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1 text-gray-700">
                    <Search className="h-4 w-4 text-gray-500" />
                    Search By
                  </label>
                  <Select value={searchBy} onValueChange={setSearchBy}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select search field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="support_it">Support IT</SelectItem>
                      <SelectItem value="creator">Client</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1 text-gray-700">
                    {searchBy === "support_it" ? (
                      <Users className="h-4 w-4 text-gray-500" />
                    ) : (
                      <User className="h-4 w-4 text-gray-500" />
                    )}
                    {searchBy === "support_it" ? "Support IT" : "Client"} Name
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder={`Search by ${searchBy === "support_it" ? "support" : "client"} name...`}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1 text-gray-700">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="pl-2 pr-2 text-sm"
                      />
                    </div>
                    <div className="relative">
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="pl-2 pr-2 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Results summary */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    Showing <span className="font-medium">{filteredData.length}</span> tickets
                    {selectedCategory || selectedStatus !== "all" || search || startDate || endDate
                      ? " (filtered)"
                      : ""}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Select value={rowsPerPage.toString()} onValueChange={(value) => setRowsPerPage(Number(value))}>
                    <SelectTrigger className="w-[110px] h-8 text-xs">
                      <SelectValue placeholder="10 per page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 per page</SelectItem>
                      <SelectItem value="10">10 per page</SelectItem>
                      <SelectItem value="25">25 per page</SelectItem>
                      <SelectItem value="50">50 per page</SelectItem>
                    </SelectContent>
                  </Select>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                          onClick={resetFilters}
                        >
                          <Filter className="h-3.5 w-3.5" />
                          Clear
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Clear all filters</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* Data table */}
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("problem.name")}
                        >
                          <div className="flex items-center gap-1">
                            Problem
                            {sortField === "problem.name" &&
                              (sortDirection === "asc" ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              ))}
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("status")}
                        >
                          <div className="flex items-center gap-1">
                            Status
                            {sortField === "status" &&
                              (sortDirection === "asc" ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              ))}
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("support_it.name")}
                        >
                          <div className="flex items-center gap-1">
                            Support IT
                            {sortField === "support_it.name" &&
                              (sortDirection === "asc" ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              ))}
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("creator.name")}
                        >
                          <div className="flex items-center gap-1">
                            Client
                            {sortField === "creator.name" &&
                              (sortDirection === "asc" ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              ))}
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("created_at")}
                        >
                          <div className="flex items-center gap-1">
                            Created Date
                            {sortField === "created_at" &&
                              (sortDirection === "asc" ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              ))}
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("resolution_date")}
                        >
                          <div className="flex items-center gap-1">
                            Resolution Date
                            {sortField === "resolution_date" &&
                              (sortDirection === "asc" ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              ))}
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        // Loading state
                        Array(5)
                          .fill(0)
                          .map((_, index) => (
                            <TableRow key={index}>
                              {Array(6)
                                .fill(0)
                                .map((_, cellIndex) => (
                                  <TableCell key={cellIndex} className="py-3">
                                    <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                                  </TableCell>
                                ))}
                            </TableRow>
                          ))
                      ) : paginatedData.length > 0 ? (
                        // Data rows
                        paginatedData.map((ticket) => (
                          <TableRow key={ticket.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{ticket.problem?.name || "Unknown Problem"}</TableCell>
                            <TableCell>
                              <StatusBadge status={ticket.status} />
                            </TableCell>
                            <TableCell>{ticket.support_it?.name || "-"}</TableCell>
                            <TableCell>{ticket.creator?.name || "-"}</TableCell>
                            <TableCell className="text-gray-600">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 text-gray-400" />
                                {formatDate(ticket.created_at)}
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-600">
                              {ticket.resolution_date ? (
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                                  {formatDate(ticket.resolution_date)}
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        // No results
                        <TableRow>
                          <TableCell colSpan={6} className="h-32 text-center">
                            <div className="flex flex-col items-center justify-center text-gray-500">
                              <Search className="h-8 w-8 mb-2 text-gray-300" />
                              <p className="text-lg font-medium">No tickets found</p>
                              <p className="text-sm">Try adjusting your filters</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Pagination */}
              {filteredData.length > 0 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>

                      {/* First page */}
                      {currentPage > 2 && (
                        <PaginationItem>
                          <PaginationLink onClick={() => setCurrentPage(1)}>1</PaginationLink>
                        </PaginationItem>
                      )}

                      {/* Ellipsis */}
                      {currentPage > 3 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}

                      {/* Previous page */}
                      {currentPage > 1 && (
                        <PaginationItem>
                          <PaginationLink onClick={() => setCurrentPage(currentPage - 1)}>
                            {currentPage - 1}
                          </PaginationLink>
                        </PaginationItem>
                      )}

                      {/* Current page */}
                      <PaginationItem>
                        <PaginationLink isActive>{currentPage}</PaginationLink>
                      </PaginationItem>

                      {/* Next page */}
                      {currentPage < totalPages && (
                        <PaginationItem>
                          <PaginationLink onClick={() => setCurrentPage(currentPage + 1)}>
                            {currentPage + 1}
                          </PaginationLink>
                        </PaginationItem>
                      )}

                      {/* Ellipsis */}
                      {currentPage < totalPages - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}

                      {/* Last page */}
                      {currentPage < totalPages - 1 && totalPages > 1 && (
                        <PaginationItem>
                          <PaginationLink onClick={() => setCurrentPage(totalPages)}>{totalPages}</PaginationLink>
                        </PaginationItem>
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-between items-center border-t p-6">
              <div className="text-sm text-gray-500">
                {filteredData.length} {filteredData.length === 1 ? "ticket" : "tickets"} found
              </div>

              <Button
                onClick={exportToExcel}
                disabled={filteredData.length === 0 || isExporting}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white gap-2"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Export to Excel
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default ExportTickets
