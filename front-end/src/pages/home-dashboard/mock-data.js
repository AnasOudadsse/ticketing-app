// Ticket Status Data
export const ticketStatusData = [
    { name: "Opened", value: 423, color: "#3b82f6" }, // blue-500
    { name: "Reserved", value: 198, color: "#60a5fa" }, // blue-400
    { name: "Resolved", value: 347, color: "#2563eb" }, // blue-600
    { name: "Closed", value: 280, color: "#93c5fd" }, // blue-300
  ]
  
  // Ticket Priority Data
  export const ticketPriorityData = [
    { name: "High", value: 187, color: "#1d4ed8" }, // blue-700
    { name: "Medium", value: 435, color: "#3b82f6" }, // blue-500
    { name: "Low", value: 626, color: "#93c5fd" }, // blue-300
  ]
  
  // Ticket Trend Data
  export const ticketTrendData = [
    { date: "Mon", tickets: 45, resolved: 38 },
    { date: "Tue", tickets: 52, resolved: 43 },
    { date: "Wed", tickets: 49, resolved: 45 },
    { date: "Thu", tickets: 63, resolved: 52 },
    { date: "Fri", tickets: 58, resolved: 47 },
    { date: "Sat", tickets: 27, resolved: 25 },
    { date: "Sun", tickets: 18, resolved: 15 },
  ]
  
  // Recent Tickets
  export const recentTickets = [
    {
      id: 1248,
      title: "Unable to access email account",
      description: "I'm getting an error message when trying to log in to my email account.",
      status: "opened",
      priority: "high",
      user: {
        id: 101,
        name: "John Smith",
        email: "john.smith@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      createdAt: "10 minutes ago",
    },
    {
      id: 1247,
      title: "Printer not connecting to network",
      description: "The office printer is not connecting to our network. We've tried restarting it multiple times.",
      status: "reserved",
      priority: "medium",
      user: {
        id: 102,
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      createdAt: "25 minutes ago",
    },
    {
      id: 1246,
      title: "New software installation request",
      description: "We need Adobe Creative Suite installed on the marketing team's computers.",
      status: "resolved",
      priority: "low",
      user: {
        id: 103,
        name: "Michael Brown",
        email: "michael.brown@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      createdAt: "1 hour ago",
    },
    {
      id: 1245,
      title: "VPN connection issues",
      description: "I'm unable to connect to the company VPN when working remotely.",
      status: "opened",
      priority: "high",
      user: {
        id: 104,
        name: "Emily Davis",
        email: "emily.davis@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      createdAt: "2 hours ago",
    },
    {
      id: 1244,
      title: "Password reset request",
      description: "I need to reset my password for the company portal.",
      status: "closed",
      priority: "medium",
      user: {
        id: 105,
        name: "David Wilson",
        email: "david.wilson@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      createdAt: "3 hours ago",
    },
  ]
  
  // Top Agents
  export const topAgents = [
    {
      id: 201,
      name: "Alex Johnson",
      department: "IT Support",
      resolvedTickets: 87,
      performance: 95,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 202,
      name: "Maria Garcia",
      department: "Customer Service",
      resolvedTickets: 76,
      performance: 92,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 203,
      name: "Robert Chen",
      department: "Technical Support",
      resolvedTickets: 68,
      performance: 88,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 204,
      name: "Lisa Taylor",
      department: "IT Support",
      resolvedTickets: 65,
      performance: 90,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]
  
  // Department Data
  export const departmentData = [
    { name: "IT", opened: 145, resolved: 120, closed: 98 },
    { name: "HR", opened: 45, resolved: 38, closed: 32 },
    { name: "Finance", opened: 65, resolved: 52, closed: 48 },
    { name: "Marketing", opened: 35, resolved: 28, closed: 22 },
    { name: "Sales", opened: 55, resolved: 42, closed: 38 },
  ]
  
  // Satisfaction Data
  export const satisfactionData = {
    average: 4.2,
    distribution: [
      { rating: 1, count: 24 },
      { rating: 2, count: 38 },
      { rating: 3, count: 126 },
      { rating: 4, count: 284 },
      { rating: 5, count: 347 },
    ],
  }
  
  // SLA Metrics
  export const slaMetrics = [
    {
      name: "First Response Time",
      value: 95,
      target: 90,
      description: "Percentage of tickets with first response within SLA (2 hours)",
    },
    {
      name: "Resolution Time",
      value: 87,
      target: 85,
      description: "Percentage of tickets resolved within SLA (8 hours)",
    },
    {
      name: "Customer Satisfaction",
      value: 92,
      target: 90,
      description: "Percentage of tickets with satisfaction rating of 4 or higher",
    },
  ]
  
  // Response Time Data
  export const responseTimeData = {
    data: [
      { date: "Week 1", responseTime: 45, resolutionTime: 5.2 },
      { date: "Week 2", responseTime: 42, resolutionTime: 4.8 },
      { date: "Week 3", responseTime: 38, resolutionTime: 4.5 },
      { date: "Week 4", responseTime: 35, resolutionTime: 4.3 },
      { date: "Week 5", responseTime: 32, resolutionTime: 4.2 },
      { date: "Week 6", responseTime: 30, resolutionTime: 4.0 },
    ],
    current: {
      responseTime: {
        value: 32,
        unit: "min",
        change: 12,
        changeDirection: "decrease",
      },
      resolutionTime: {
        value: 4.2,
        unit: "hrs",
        change: 8,
        changeDirection: "decrease",
      },
    },
  }
  
  // Agent Performance Data
  export const agentPerformanceData = [
    { name: "Alex Johnson", resolvedTickets: 87 },
    { name: "Maria Garcia", resolvedTickets: 76 },
    { name: "Robert Chen", resolvedTickets: 68 },
    { name: "Lisa Taylor", resolvedTickets: 65 },
    { name: "James Wilson", resolvedTickets: 58 },
  ]
  
  // Workload Data
  export const workloadData = [
    {
      id: 201,
      name: "Alex Johnson",
      currentWorkload: 12,
      capacity: 20,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 202,
      name: "Maria Garcia",
      currentWorkload: 18,
      capacity: 20,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 203,
      name: "Robert Chen",
      currentWorkload: 15,
      capacity: 20,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 204,
      name: "Lisa Taylor",
      currentWorkload: 10,
      capacity: 15,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 205,
      name: "James Wilson",
      currentWorkload: 8,
      capacity: 15,
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]
  