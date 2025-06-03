"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ClockIcon,
  LayersIcon,
  TicketIcon,
  UsersIcon,
  CalendarIcon,
  CheckCircleIcon,
  BellIcon,
  SearchIcon,
  FilterIcon,
  DownloadIcon,
  RefreshCwIcon,
  MoreHorizontalIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ChevronRightIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import api from '@/lib/axios'

export default function Dashboard() {
  const [dateRange, setDateRange] = useState("week")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('accessToken')
      console.log('Token from localStorage:', token)
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      console.log('Making API request to /api/dashboard/stats')
      const response = await api.get('/api/dashboard/stats')
      console.log('API Response:', response)

      if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
        console.log('Received HTML response:', response.data)
        throw new Error('Received HTML response instead of JSON data')
      }

      setDashboardData(response.data)
      setError(null)
    } catch (err) {
      console.error('Error details:', {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data
      })
      setError(err.message || 'Failed to fetch dashboard data')
      setDashboardData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Helper function to format numbers
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  // Helper function to calculate percentage change
  const getChangeColor = (change) => {
    return change > 0 ? "text-blue-600" : "text-blue-400"
  }

  // Helper function to get status color
  const getStatusColor = (status) => {
    const colors = {
      opened: "bg-blue-500",
      reserved: "bg-blue-400",
      resolved: "bg-blue-600",
      closed: "bg-blue-300",
    }
    return colors[status] || "bg-blue-200"
  }

  // Helper function to get priority color
  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-blue-700",
      medium: "bg-blue-500",
      low: "bg-blue-300",
    }
    return colors[priority] || "bg-blue-200"
  }

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchDashboardData().finally(() => {
      setIsRefreshing(false)
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">
          <p className="text-xl font-bold mb-2">Error Loading Dashboard</p>
          <p>{error}</p>
          <button 
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">No data available</div>
      </div>
    )
  }

  // Transform API data for charts
  const ticketStatusData = (dashboardData?.ticketStatus || []).map(item => ({
    name: item.status,
    value: item.count,
    color: getStatusColor(item.status)
  }));

  const ticketPriorityData = (dashboardData?.ticketPriority || []).map(item => ({
    name: item.priority,
    value: item.count,
    color: getPriorityColor(item.priority)
  }));

  const ticketTrendData = (dashboardData?.ticketTrend || []).map(item => ({
    date: item.date,
    tickets: item.tickets || 0,
    resolved: item.resolved || 0
  }));

  const departmentData = (dashboardData?.departmentData || []).map(dept => ({
    name: dept.name || 'Unknown',
    opened: dept.opened || 0,
    resolved: dept.resolved || 0,
    closed: dept.closed || 0
  }));

  const topAgents = dashboardData?.topAgents || [];
  const slaMetrics = dashboardData?.slaMetrics || [];
  const responseTimeData = {
    data: (dashboardData?.responseTimeData?.data || []).map(item => ({
      date: item.date,
      responseTime: item.responseTime || 0,
      resolutionTime: item.resolutionTime || 0
    })),
    current: {
      responseTime: {
        value: dashboardData?.responseTimeData?.current?.responseTime?.value || 0,
        unit: 'min',
        change: dashboardData?.responseTimeData?.current?.responseTime?.change || 0,
        changeDirection: dashboardData?.responseTimeData?.current?.responseTime?.changeDirection || 'increase'
      },
      resolutionTime: {
        value: dashboardData?.responseTimeData?.current?.resolutionTime?.value || 0,
        unit: 'hrs',
        change: dashboardData?.responseTimeData?.current?.resolutionTime?.change || 0,
        changeDirection: dashboardData?.responseTimeData?.current?.resolutionTime?.changeDirection || 'increase'
      }
    }
  };

  const agentWorkload = dashboardData?.agentWorkload || [];
  const recentTickets = dashboardData?.recentTickets || [];
  const satisfactionData = {
    average: dashboardData?.satisfactionData?.average || 0,
    distribution: dashboardData?.satisfactionData?.distribution || []
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Dashboard</h1>
          <p className="text-muted-foreground mt-1">Monitor ticket activity and agent performance</p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center gap-2 bg-background border rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              className={dateRange === "day" ? "bg-muted" : ""}
              onClick={() => setDateRange("day")}
            >
              Day
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={dateRange === "week" ? "bg-muted" : ""}
              onClick={() => setDateRange("week")}
            >
              Week
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={dateRange === "month" ? "bg-muted" : ""}
              onClick={() => setDateRange("month")}
            >
              Month
            </Button>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
                  <RefreshCwIcon className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <FilterIcon className="mr-2 h-4 w-4" /> Filter view
              </DropdownMenuItem>
              <DropdownMenuItem>
                <DownloadIcon className="mr-2 h-4 w-4" /> Export data
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <SearchIcon className="mr-2 h-4 w-4" /> Search tickets
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CalendarIcon className="h-4 w-4" />
        <span>Last updated: April 18, 2025, 11:45 AM</span>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 animate-in fade-in-50">
          {/* Key Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="overflow-hidden border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                <div className="p-1 bg-blue-100 rounded-full">
                  <TicketIcon className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(dashboardData?.totalTickets || 0)}</div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-l-4 border-l-blue-400">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                <div className="p-1 bg-blue-100 rounded-full">
                  <LayersIcon className="h-4 w-4 text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(dashboardData?.openTickets || 0)}</div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-l-4 border-l-blue-600">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
                <div className="p-1 bg-blue-100 rounded-full">
                  <CheckCircleIcon className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(dashboardData?.resolvedToday || 0)}</div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-l-4 border-l-blue-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
                <div className="p-1 bg-blue-100 rounded-full">
                  <ClockIcon className="h-4 w-4 text-blue-300" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData?.avgResponseTime || 0} min</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-11">
            {/* Status Distribution */}
            <Card className="col-span-3 overflow-hidden border border-border/40 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-muted/30">
                <CardTitle className="text-base">Ticket Status</CardTitle>
                <CardDescription>Distribution of tickets by status</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ChartContainer
                  config={{
                    opened: {
                      label: "Opened",
                      color: "hsl(221.2, 83.2%, 53.3%)", // blue-500
                    },
                    reserved: {
                      label: "Reserved",
                      color: "hsl(221.2, 83.2%, 65.3%)", // blue-400
                    },
                    resolved: {
                      label: "Resolved",
                      color: "hsl(221.2, 83.2%, 41.3%)", // blue-600
                    },
                    closed: {
                      label: "Closed",
                      color: "hsl(221.2, 83.2%, 77.3%)", // blue-300
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ticketStatusData}
                        cx="30%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        innerRadius={40}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {ticketStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {ticketStatusData.map((status) => (
                    <div key={status.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }}></div>
                      <span className="text-xs">
                        {status.name}: {status.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Priority Distribution */}
            <Card className="col-span-3 overflow-hidden border border-border/40 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-muted/30">
                <CardTitle className="text-base">Ticket Priority</CardTitle>
                <CardDescription>Distribution of tickets by priority</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ChartContainer
                  config={{
                    high: {
                      label: "High",
                      color: "hsl(221.2, 83.2%, 29.3%)", // blue-700
                    },
                    medium: {
                      label: "Medium",
                      color: "hsl(221.2, 83.2%, 53.3%)", // blue-500
                    },
                    low: {
                      label: "Low",
                      color: "hsl(221.2, 83.2%, 77.3%)", // blue-300
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ticketPriorityData}
                        cx="30%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        innerRadius={40}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {ticketPriorityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {ticketPriorityData.map((priority) => (
                    <div key={priority.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: priority.color }}></div>
                      <span className="text-xs">
                        {priority.name}: {priority.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ticket Trend */}
            <Card className="col-span-5 overflow-hidden border border-border/40 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-muted/30">
                <CardTitle className="text-base">Ticket Trend</CardTitle>
                <CardDescription>New vs. resolved tickets over time</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ChartContainer
                  config={{
                    tickets: {
                      label: "New Tickets",
                      color: "hsl(221.2, 83.2%, 53.3%)", // blue-500
                    },
                    resolved: {
                      label: "Resolved",
                      color: "hsl(221.2, 83.2%, 41.3%)", // blue-600
                    },
                  }}
                  className="h-[350px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ticketTrendData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="tickets"
                        stroke="var(--color-tickets)"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="resolved"
                        stroke="var(--color-resolved)"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Tickets and Top Agents */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Recent Tickets */}
            <Card className="col-span-1 overflow-hidden border border-border/40 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-muted/30 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Recent Tickets</CardTitle>
                  <CardDescription>Latest support requests</CardDescription>
                </div>
                <Button variant="ghost" size="icon">
                  <BellIcon className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-0 divide-y">
                    {recentTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="flex items-start space-x-4 p-4 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{ticket.title}</p>
                            <div className="flex space-x-2">
                              <Badge variant="outline" className={`${getStatusColor(ticket.status)} text-white`}>
                                {ticket.status}
                              </Badge>
                              <Badge variant="outline" className={`${getPriorityColor(ticket.priority)} text-white`}>
                                {ticket.priority}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{ticket.description}</p>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={ticket.user.avatar || "/placeholder.svg"} alt={ticket.user.name} />
                                <AvatarFallback>{ticket.user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{ticket.user.name}</span>
                            </div>
                            <span>{ticket.createdAt}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="bg-muted/20 p-2">
                <Button variant="ghost" className="w-full text-primary hover:text-primary hover:bg-primary/10">
                  View All Tickets <ChevronRightIcon className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            {/* Top Agents */}
            <Card className="col-span-1 overflow-hidden border border-border/40 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-muted/30 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Top Performing Agents</CardTitle>
                  <CardDescription>Based on resolved tickets</CardDescription>
                </div>
                <Button variant="ghost" size="icon">
                  <UsersIcon className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-0 divide-y">
                    {topAgents.map((agent) => (
                      <div
                        key={agent.id}
                        className="flex items-center space-x-4 p-4 hover:bg-muted/30 transition-colors"
                      >
                        <Avatar className="h-10 w-10 border-2 border-primary/20">
                          <AvatarImage src={agent.avatar || "/placeholder.svg"} alt={agent.name} />
                          <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between">
                            <p className="font-medium">{agent.name}</p>
                            <p className="text-sm font-medium">{agent.resolvedTickets} tickets</p>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span>{agent.department}</span>
                            <span className="mx-2">•</span>
                            <span
                              className={`font-medium ${agent.performance >= 90 ? "text-green-500" : "text-amber-500"}`}
                            >
                              {agent.performance}% performance
                            </span>
                          </div>
                          <div className="relative pt-1">
                            <div className="overflow-hidden h-1.5 text-xs flex rounded bg-muted">
                              <div
                                style={{ width: `${agent.performance}%` }}
                                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                                  agent.performance >= 90 ? "bg-green-500" : "bg-amber-500"
                                }`}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="bg-muted/20 p-2">
                <Button variant="ghost" className="w-full text-primary hover:text-primary hover:bg-primary/10">
                  View All Agents <ChevronRightIcon className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Tickets Tab */}
        <TabsContent value="tickets" className="space-y-6 animate-in fade-in-50">
          {/* Search and Filter */}
          <Card className="border border-border/40 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search tickets..." className="pl-9" />
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="all-status">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-status">All Statuses</SelectItem>
                      <SelectItem value="opened">Opened</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all-priority">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-priority">All Priorities</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <FilterIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Department Distribution */}
          <Card className="border border-border/40 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-muted/30">
              <CardTitle className="text-base">Tickets by Department</CardTitle>
              <CardDescription>Distribution of tickets across departments</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ChartContainer
                config={{
                  opened: {
                    label: "Opened",
                    color: "hsl(221.2, 83.2%, 53.3%)", // blue-500
                  },
                  resolved: {
                    label: "Resolved",
                    color: "hsl(221.2, 83.2%, 41.3%)", // blue-600
                  },
                  closed: {
                    label: "Closed",
                    color: "hsl(221.2, 83.2%, 77.3%)", // blue-300
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="opened" fill="var(--color-opened)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="resolved" fill="var(--color-resolved)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="closed" fill="var(--color-closed)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Customer Satisfaction and SLA */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Customer Satisfaction */}
            <Card className="border border-border/40 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-muted/30">
                <CardTitle className="text-base">Customer Satisfaction</CardTitle>
                <CardDescription>Rating distribution (1-5 stars)</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="text-center p-4 bg-muted/30 rounded-full w-24 h-24 flex flex-col items-center justify-center">
                    <div className="text-4xl font-bold">{satisfactionData.average}</div>
                    <div className="text-xs text-muted-foreground">Average</div>
                  </div>
                </div>
                <ChartContainer
                  config={{
                    count: {
                      label: "Count",
                      color: "hsl(221, 83%, 53%)",
                    },
                  }}
                  className="h-[250px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={satisfactionData.distribution}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="rating" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]}>
                        {satisfactionData.distribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={index < 2 ? "#bfdbfe" : index < 3 ? "#60a5fa" : "#2563eb"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="grid grid-cols-5 gap-2 mt-4">
                  {satisfactionData.distribution.map((item) => (
                    <div key={item.rating} className="text-center">
                      <div className="text-xs font-medium">{item.rating} ★</div>
                      <div className="text-xs text-muted-foreground">{item.count}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* SLA Compliance */}
            <Card className="border border-border/40 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-muted/30">
                <CardTitle className="text-base">SLA Compliance</CardTitle>
                <CardDescription>Service level agreement metrics</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {slaMetrics.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">{metric.name}</div>
                          <div className="text-xs text-muted-foreground">{metric.description}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{metric.value}%</div>
                          <div className="text-xs text-muted-foreground">Target: {metric.target}%</div>
                        </div>
                      </div>
                      <div className="relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-muted">
                          <div
                            style={{ width: `${metric.value}%` }}
                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                              metric.value >= metric.target ? "bg-blue-600" : "bg-blue-400"
                            }`}
                          ></div>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6 animate-in fade-in-50">
          {/* Response & Resolution Time */}
          <Card className="border border-border/40 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-muted/30">
              <CardTitle className="text-base">Response & Resolution Time</CardTitle>
              <CardDescription>Average times over the last 6 weeks</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ChartContainer
                config={{
                  responseTime: {
                    label: "Response Time (min)",
                    color: "hsl(221.2, 83.2%, 53.3%)", // blue-500
                  },
                  resolutionTime: {
                    label: "Resolution Time (hrs)",
                    color: "hsl(221.2, 83.2%, 41.3%)", // blue-600
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={responseTimeData.data}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="responseTime"
                      stroke="var(--color-responseTime)"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      dot={{ r: 4 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="resolutionTime"
                      stroke="var(--color-resolutionTime)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 border rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                  <div className="text-sm font-medium text-muted-foreground">Current Response Time</div>
                  <div className="flex items-center mt-1">
                    <div className="text-2xl font-bold">
                      {responseTimeData.current.responseTime.value} {responseTimeData.current.responseTime.unit}
                    </div>
                    <div
                      className={`ml-2 flex items-center text-sm ${getChangeColor(responseTimeData.current.responseTime.changeDirection === "decrease")}`}
                    >
                      {responseTimeData.current.responseTime.changeDirection === "decrease" ? (
                        <TrendingDownIcon className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingUpIcon className="h-4 w-4 mr-1" />
                      )}
                      {responseTimeData.current.responseTime.change}%
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Compared to previous period</div>
                </div>
                <div className="p-4 border rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                  <div className="text-sm font-medium text-muted-foreground">Current Resolution Time</div>
                  <div className="flex items-center mt-1">
                    <div className="text-2xl font-bold">
                      {responseTimeData.current.resolutionTime.value} {responseTimeData.current.resolutionTime.unit}
                    </div>
                    <div
                      className={`ml-2 flex items-center text-sm ${getChangeColor(responseTimeData.current.resolutionTime.changeDirection === "decrease")}`}
                    >
                      {responseTimeData.current.resolutionTime.changeDirection === "decrease" ? (
                        <TrendingDownIcon className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingUpIcon className="h-4 w-4 mr-1" />
                      )}
                      {responseTimeData.current.resolutionTime.change}%
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Compared to previous period</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agent Performance and Workload */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Agent Performance */}
            <Card className="border border-border/40 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-muted/30">
                <CardTitle className="text-base">Agent Performance</CardTitle>
                <CardDescription>Tickets resolved per agent</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ChartContainer
                  config={{
                    resolvedTickets: {
                      label: "Resolved Tickets",
                      color: "hsl(221.2, 83.2%, 53.3%)", // blue-500
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={agentWorkload}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="resolvedTickets" fill="var(--color-resolvedTickets)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Agent Workload */}
            <Card className="border border-border/40 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-muted/30">
                <CardTitle className="text-base">Current Workload</CardTitle>
                <CardDescription>Tickets assigned per agent</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {agentWorkload.map((agent) => (
                    <div key={agent.id} className="space-y-2">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2 border border-primary/20">
                            <AvatarImage src={agent.avatar || "/placeholder.svg"} alt={agent.name} />
                            <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{agent.name}</span>
                        </div>
                        <div className="text-sm">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span>
                                  {agent.currentWorkload} / {agent.capacity} tickets
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{Math.round((agent.currentWorkload / agent.capacity) * 100)}% of capacity</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                      <div className="relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-muted">
                          <div
                            style={{ width: `${(agent.currentWorkload / agent.capacity) * 100}%` }}
                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all ${
                              (agent.currentWorkload / agent.capacity) > 0.9
                                ? "bg-red-500"
                                : agent.currentWorkload / agent.capacity > 0.7
                                  ? "bg-amber-500"
                                  : "bg-green-500"
                            }`}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-muted/20 p-2">
                <Button variant="ghost" className="w-full text-primary hover:text-primary hover:bg-primary/10">
                  View Workload Distribution <ChevronRightIcon className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
