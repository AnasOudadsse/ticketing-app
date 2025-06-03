"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { formatDistanceToNow } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import PropTypes from "prop-types"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

import Header from "../header/header"
import { Search, Calendar, Clock, AlertCircle, CheckCircle, PauseCircle, XCircle, ChevronRight, Filter, Plus, RefreshCw } from 'lucide-react'
import { useToast } from "@chakra-ui/react"

// Date filter helper functions
const isToday = (date) => {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

const isThisWeek = (date) => {
  const today = new Date()
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
  return date >= startOfWeek
}

const isThisMonth = (date) => {
  const today = new Date()
  return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()
}

// Priority badge component
const PriorityBadge = ({ priority }) => {
  let color, label

  switch (priority?.toLowerCase()) {
    case "high":
      color = "bg-red-100 text-red-800 border-red-200"
      label = "High"
      break
    case "medium":
      color = "bg-amber-100 text-amber-800 border-amber-200"
      label = "Medium"
      break
    case "low":
      color = "bg-green-100 text-green-800 border-green-200"
      label = "Low"
      break
    default:
      color = "bg-gray-100 text-gray-800 border-gray-200"
      label = "Normal"
  }

  return <span className={`text-xs px-2 py-0.5 rounded-full ${color} border`}>{label}</span>
}

PriorityBadge.propTypes = {
  priority: PropTypes.string
}

// Status icon component
const StatusIcon = ({ status }) => {
  switch (status) {
    case "opened":
      return <AlertCircle size={16} className="text-green-500" />
    case "reserved":
      return <PauseCircle size={16} className="text-amber-500" />
    case "resolved":
      return <CheckCircle size={16} className="text-blue-500" />
    case "closed":
      return <XCircle size={16} className="text-red-500" />
    default:
      return null
  }
}

StatusIcon.propTypes = {
  status: PropTypes.string.isRequired
}

// Status badge component
const StatusBadge = ({ status, reservedBy }) => {
  let color, icon

  switch (status) {
    case "opened":
      color = "bg-green-100 text-green-800 border-green-200"
      icon = <AlertCircle size={14} className="text-green-500" />
      break
    case "reserved":
      color = "bg-amber-100 text-amber-800 border-amber-200"
      icon = <PauseCircle size={14} className="text-amber-500" />
      break
    case "resolved":
      color = "bg-blue-100 text-blue-800 border-blue-200"
      icon = <CheckCircle size={14} className="text-blue-500" />
      break
    case "closed":
      color = "bg-red-100 text-red-800 border-red-200"
      icon = <XCircle size={14} className="text-red-500" />
      break
    default:
      color = "bg-gray-100 text-gray-800 border-gray-200"
      icon = null
  }

  const getStatusText = () => {
    if (status === "reserved" && reservedBy) {
      return `Reserved by ${reservedBy}`
    }
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color} border`}>
      {icon}
      {getStatusText()}
    </span>
  )
}

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  reservedBy: PropTypes.string
}

// Individual ticket item component
const TicketItem = ({
  statusColor,
  problemName,
  ticketNumber,
  priority,
  postedTime,
  name,
  description,
  status,
  created_by,
  reserved_by,
}) => {
  const navigate = useNavigate()

  const handleOpenTicket = () => {
    navigate(`/tickets/ticketview/${ticketNumber}`)
  }

  const getStatusColorClass = () => {
    switch (status) {
      case "opened":
        return "bg-green-500"
      case "reserved":
        return "bg-amber-500"
      case "resolved":
        return "bg-blue-500"
      case "closed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="relative my-2 w-full rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-green-300 hover:bg-gray-50 hover:shadow-md">
        {/* Status indicator line */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${getStatusColorClass()}`} />

        <div className="pl-2">
          {/* Header section with ticket number, status and time */}
          <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-md font-semibold text-gray-800">#{ticketNumber}</h3>
              <StatusBadge status={status} reservedBy={reserved_by} />
              <PriorityBadge priority={priority} />
            </div>

            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock size={14} />
              <span>{formatDistanceToNow(new Date(postedTime), { addSuffix: true })}</span>
            </div>
          </div>

          {/* Problem title */}
          <h4 className="mb-2 font-medium text-gray-700">{problemName}</h4>

          {/* Description */}
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600">{description}</p>

          <Separator className="my-3" />

          {/* Footer with user info and action button */}
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 border border-gray-200">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${name}`} />
                <AvatarFallback className="bg-green-100 text-green-800">{getInitials(name)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700">{name}</span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-green-600 hover:bg-green-50 hover:text-green-700"
              onClick={handleOpenTicket}
            >
              View Details
              <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

TicketItem.propTypes = {
  statusColor: PropTypes.string,
  problemName: PropTypes.string.isRequired,
  ticketNumber: PropTypes.number.isRequired,
  priority: PropTypes.string,
  postedTime: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  created_by: PropTypes.string.isRequired,
  reserved_by: PropTypes.string
}

// Main TicketList component
export default function TicketList() {
  const [tickets, setTickets] = useState([])
  const [filteredTickets, setFilteredTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [timeFilter, setTimeFilter] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      setIsRefreshing(true)
      const response = await axios.get("http://127.0.0.1:8000/api/tickets/getTicketsWithProblems")
      setTickets(response.data)
      setFilteredTickets(response.data)
      setLoading(false)
      setIsRefreshing(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch tickets from the server.",
        variant: "destructive",
      })
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)
    applyFilters(term, timeFilter, selectedTab)
  }

  const handleTimeFilter = (value) => {
    setTimeFilter(value)
    applyFilters(searchTerm, value, selectedTab)
  }

  const handleTabChange = (value) => {
    setSelectedTab(value)
    applyFilters(searchTerm, timeFilter, value)
  }

  const applyFilters = (term, time, tab) => {
    let filtered = tickets

    if (term) {
      filtered = filtered.filter(
        (ticket) =>
          ticket?.name?.toLowerCase().includes(term) ||
          ticket?.description?.toLowerCase().includes(term) ||
          ticket?.problem?.name?.toLowerCase().includes(term) ||
          ticket?.id?.toString().includes(term),
      )
    }

    if (time) {
      filtered = filtered.filter((ticket) => {
        const ticketDate = new Date(ticket.created_at)
        return (
          (time === "today" && isToday(ticketDate)) ||
          (time === "this-week" && isThisWeek(ticketDate)) ||
          (time === "this-month" && isThisMonth(ticketDate))
        )
      })
    }

    if (tab !== "all") {
      filtered = filtered.filter((ticket) => ticket.status === tab)
    }

    setFilteredTickets(filtered)
  }

  const handleCreateTicket = () => {
    navigate("/tickets/newticket")
  }

  const clearFilters = () => {
    setSearchTerm("")
    setTimeFilter("")
    setSelectedTab("all")
    setFilteredTickets(tickets)
  }

  return (
    <>
      <Header
        name="Mezrioui Hakim"
        greeting="Have a nice day"
        role="super-admin"
        profile="https://img.freepik.com/photos-premium/photo-profil-vecteur-plat-homme-elegant-generee-par-ai_606187-310.jpg"
      />

      <div className="min-h-[calc(100vh-80px)] bg-gray-50 px-4 py-6 md:px-8">
        {/* Header with title and actions */}
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">Ticket Management</h1>
            <Badge variant="outline" className="ml-3 bg-green-50 text-green-700">
              {filteredTickets.length} tickets
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={fetchTickets}
                    disabled={isRefreshing}
                    className="h-10 w-10"
                  >
                    <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh tickets</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button onClick={handleCreateTicket} className="px-6">
              <Plus size={18} className="mr-2" />
              New Ticket
            </Button>
          </div>
        </div>

        {/* Main content card */}
        <div className="w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
          {/* Search and filter section */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by ticket #, problem, or description"
                value={searchTerm}
                onChange={handleSearch}
                className="pl-9"
              />
            </div>

            <div className="flex-1" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[160px]">
                  {timeFilter ? (
                    <>
                      <Calendar size={16} className="mr-2" />
                      {timeFilter === "today" ? "Today" : timeFilter === "this-week" ? "This Week" : "This Month"}
                    </>
                  ) : (
                    <>
                      <Filter size={16} className="mr-2" />
                      Filter by time
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleTimeFilter("")}>All Time</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTimeFilter("today")}>Today</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTimeFilter("this-week")}>This Week</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTimeFilter("this-month")}>This Month</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Tabs for status filtering */}
          <Tabs defaultValue="all" value={selectedTab} onValueChange={handleTabChange} className="mb-6">
            <TabsList className="mb-2 w-full justify-start overflow-x-auto border-b border-gray-200 bg-transparent p-0">
              <TabsTrigger
                value="all"
                className="data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                All Tickets
              </TabsTrigger>
              <TabsTrigger
                value="opened"
                className="data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <AlertCircle size={16} className="mr-1 text-green-500" /> Opened
              </TabsTrigger>
              <TabsTrigger
                value="reserved"
                className="data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <PauseCircle size={16} className="mr-1 text-amber-500" /> Reserved
              </TabsTrigger>
              <TabsTrigger
                value="resolved"
                className="data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <CheckCircle size={16} className="mr-1 text-blue-500" /> Resolved
              </TabsTrigger>
              <TabsTrigger
                value="closed"
                className="data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <XCircle size={16} className="mr-1 text-red-500" /> Closed
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Ticket list */}
          <div className="space-y-4">
            <AnimatePresence>
              {loading ? (
                // Loading skeletons
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="relative my-2 w-full rounded-lg border border-gray-200 bg-white p-5">
                      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg bg-gray-200" />
                      <div className="pl-2">
                        <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-16" />
                          </div>
                          <Skeleton className="h-5 w-32" />
                        </div>
                        <Skeleton className="mb-2 h-5 w-3/4" />
                        <Skeleton className="mb-2 h-4 w-full" />
                        <Skeleton className="mb-4 h-4 w-5/6" />
                        <Separator className="my-3" />
                        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-5 w-32" />
                          </div>
                          <Skeleton className="h-8 w-28" />
                        </div>
                      </div>
                    </div>
                  ))
              ) : filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <TicketItem
                    key={ticket.id}
                    statusColor={
                      ticket.status === "opened"
                        ? "green"
                        : ticket.status === "reserved"
                          ? "yellow"
                          : ticket.status === "resolved"
                            ? "blue"
                            : "red"
                    }
                    status={ticket.status}
                    ticketNumber={ticket.id}
                    problemName={ticket?.problem?.specification || ticket?.problem?.name || "Unknown Problem"}
                    priority={ticket.priority}
                    postedTime={ticket.created_at}
                    name={ticket.creator.name}
                    description={ticket.description}
                    created_by={ticket.created_by}
                    reserved_by={ticket?.support_it?.name}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-10"
                >
                  <div className="mb-4 rounded-full bg-gray-100 p-3">
                    <Search size={24} className="text-gray-400" />
                  </div>
                  <h3 className="mb-2 text-center text-lg font-medium">No tickets found</h3>
                  <p className="text-center text-gray-500">Try adjusting your search or filter criteria</p>
                  <Button variant="outline" className="mt-6" onClick={clearFilters}>
                    Clear filters
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  )
}
