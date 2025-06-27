"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Tooltip as RechartsTooltip,
  Area,
  AreaChart,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
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
  BarChart3Icon,
  PieChartIcon,
  LineChartIcon,
  ActivityIcon,
  AlertCircleIcon,
  CheckIcon,
  XIcon,
  InfoIcon,
  StarIcon,
  ClipboardListIcon,
  ZapIcon,
  ShieldIcon,
  SettingsIcon,
} from "lucide-react";
import api from "@/lib/axios";

// Add this after all the imports but before the Dashboard component
function generateFakeData() {
  // Generate fake ticket status data
  const ticketStatus = [
    { status: "opened", count: Math.floor(Math.random() * 100) + 50 },
    { status: "reserved", count: Math.floor(Math.random() * 80) + 30 },
    { status: "resolved", count: Math.floor(Math.random() * 150) + 100 },
    { status: "closed", count: Math.floor(Math.random() * 200) + 150 },
  ];

  // Generate fake ticket priority data
  const ticketPriority = [
    { priority: "high", count: Math.floor(Math.random() * 50) + 20 },
    { priority: "medium", count: Math.floor(Math.random() * 100) + 80 },
    { priority: "low", count: Math.floor(Math.random() * 80) + 50 },
  ];

  // Generate fake ticket trend data for the last 7 days
  const ticketTrend = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const tickets = Math.floor(Math.random() * 30) + 10;
    const resolved = Math.floor(Math.random() * 25) + 5;

    return {
      date: dateStr,
      tickets,
      resolved,
    };
  });

  // Generate fake department data
  const departments = ["Support", "Sales", "Technical", "Billing", "Product"];
  const departmentData = departments.map((name) => ({
    name,
    opened: Math.floor(Math.random() * 50) + 10,
    resolved: Math.floor(Math.random() * 40) + 20,
    closed: Math.floor(Math.random() * 30) + 15,
  }));

  // Generate fake top agents data
  const agentNames = [
    "Alex Johnson",
    "Sam Smith",
    "Jordan Lee",
    "Taylor Kim",
    "Casey Wong",
  ];
  const topAgents = agentNames.map((name, i) => ({
    id: i + 1,
    name,
    avatar: `/placeholder.svg?height=40&width=40&query=person${i}`,
    department: departments[Math.floor(Math.random() * departments.length)],
    resolvedTickets: Math.floor(Math.random() * 100) + 50,
    performance: Math.floor(Math.random() * 30) + 70,
    currentWorkload: Math.floor(Math.random() * 15) + 5,
    capacity: 20,
  }));

  // Generate fake SLA metrics
  const slaMetrics = [
    {
      name: "First Response Time",
      description: "Percentage of tickets with first response within SLA",
      value: Math.floor(Math.random() * 15) + 85,
      target: 90,
    },
    {
      name: "Resolution Time",
      description: "Percentage of tickets resolved within SLA",
      value: Math.floor(Math.random() * 20) + 75,
      target: 85,
    },
    {
      name: "Customer Satisfaction",
      description: "Percentage of satisfied customers based on surveys",
      value: Math.floor(Math.random() * 10) + 88,
      target: 90,
    },
  ];

  // Generate fake response time data
  const responseTimeData = {
    data: Array.from({ length: 14 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (13 - i));
      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      return {
        date: dateStr,
        responseTime: Math.floor(Math.random() * 20) + 5,
        resolutionTime: Math.floor(Math.random() * 8) + 2,
      };
    }),
    current: {
      responseTime: {
        value: Math.floor(Math.random() * 15) + 10,
        unit: "min",
        change: Math.floor(Math.random() * 10) + 1,
        changeDirection: Math.random() > 0.5 ? "decrease" : "increase",
      },
      resolutionTime: {
        value: Math.floor(Math.random() * 6) + 3,
        unit: "hrs",
        change: Math.floor(Math.random() * 15) + 5,
        changeDirection: Math.random() > 0.5 ? "decrease" : "increase",
      },
    },
  };

  // Generate fake recent tickets
  const ticketTitles = [
    "Cannot access my account",
    "Payment failed on checkout",
    "How do I reset my password?",
    "Feature request: Dark mode",
    "App crashes on startup",
    "Missing order confirmation",
    "Subscription renewal issue",
    "Data export not working",
    "Login issues after update",
    "Billing discrepancy on invoice",
  ];

  const recentTickets = Array.from({ length: 10 }, (_, i) => {
    const date = new Date();
    date.setHours(date.getHours() - Math.floor(Math.random() * 48));

    const statuses = ["opened", "reserved", "resolved", "closed"];
    const priorities = ["high", "medium", "low"];

    return {
      id: i + 1,
      title: ticketTitles[i],
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      createdAt: date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
      user: {
        name: `User ${i + 1}`,
        avatar: `/placeholder.svg?height=40&width=40&query=user${i}`,
      },
    };
  });

  // Generate fake satisfaction data
  const satisfactionData = {
    average: (Math.random() * 1.5 + 3.5).toFixed(1),
    distribution: Array.from({ length: 5 }, (_, i) => ({
      rating: (i + 1).toString(),
      count:
        Math.floor(Math.random() * (i === 3 || i === 4 ? 100 : 50)) +
        (i === 0 ? 5 : i === 1 ? 15 : i === 2 ? 30 : i === 3 ? 60 : 80),
    })),
  };

  // Compile all fake data
  return {
    isRealData: false, // Add this line to indicate this is fake data
    totalTickets: Math.floor(Math.random() * 1000) + 500,
    openTickets: Math.floor(Math.random() * 200) + 100,
    resolvedToday: Math.floor(Math.random() * 50) + 20,
    avgResponseTime: Math.floor(Math.random() * 20) + 10,
    ticketStatus,
    ticketPriority,
    ticketTrend,
    departmentData,
    topAgents,
    slaMetrics,
    responseTimeData,
    agentWorkload: topAgents,
    recentTickets,
    satisfactionData,
  };
}

export default function Dashboard() {
  const [dateRange, setDateRange] = useState("week");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Replace the fetchDashboardData function with this updated version:
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.log("No authentication token found, using fake data");
        setDashboardData(generateFakeData());
        setError(null);
        return;
      }

      try {
        const response = await api.get("/api/dashboard/stats");

        if (
          typeof response.data === "string" &&
          response.data.includes("<!DOCTYPE html>")
        ) {
          throw new Error("Received HTML response instead of JSON data");
        }

        if (!response.data || Object.keys(response.data).length === 0) {
          console.log("Empty response from API, using fake data");
          setDashboardData(generateFakeData());
        } else {
          setDashboardData(response.data);
        }

        setError(null);
      } catch (apiError) {
        console.error("API error, using fake data instead:", apiError);
        setDashboardData(generateFakeData());
        setError(null);
      }
    } catch (err) {
      console.error("Error details:", {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data,
      });

      // Use fake data instead of showing an error
      console.log("Using fake data due to error");
      setDashboardData(generateFakeData());
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Helper function to format numbers
  const formatNumber = (num) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
  };

  // Helper function to calculate percentage change
  const getChangeColor = (change) => {
    return change > 0 ? "text-emerald-600" : "text-rose-500";
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    const colors = {
      opened: "bg-indigo-500",
      reserved: "bg-amber-500",
      resolved: "bg-emerald-500",
      closed: "bg-slate-500",
    };
    return colors[status] || "bg-slate-300";
  };

  // Helper function to get priority color
  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-rose-500",
      medium: "bg-amber-500",
      low: "bg-emerald-500",
    };
    return colors[priority] || "bg-slate-300";
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDashboardData().finally(() => {
      setIsRefreshing(false);
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-24 w-24">
            <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-indigo-400 border-b-transparent border-l-transparent animate-spin animation-delay-200"></div>
            <div className="absolute inset-4 rounded-full border-4 border-t-transparent border-r-transparent border-b-indigo-300 border-l-transparent animate-spin animation-delay-400"></div>
          </div>
          <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    const fakeData = generateFakeData();
    setDashboardData(fakeData);
    setError(null);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircleIcon className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-amber-800 dark:text-amber-300">
                  Using Demo Data
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                  There was an error loading data from the API: {error}.
                  Displaying demo data for preview purposes.
                </p>
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  size="sm"
                  className="mt-2 bg-amber-100 dark:bg-amber-900/50 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/70"
                >
                  <RefreshCwIcon className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </div>
          </div>
          {/* The rest of the dashboard will render with fake data */}
        </div>
      </div>
    );
  }

  // Now let's modify the error handling to always show data
  // Replace the if (!dashboardData) block with:

  if (!dashboardData) {
    const fakeData = generateFakeData();
    setDashboardData(fakeData);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <InfoIcon className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-amber-800 dark:text-amber-300">
                  Using Demo Data
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                  No data was returned from the API. Displaying demo data for
                  preview purposes.
                </p>
              </div>
            </div>
          </div>
          {/* The rest of the dashboard will render with fake data */}
        </div>
      </div>
    );
  }

  // Transform API data for charts
  const ticketStatusData = (dashboardData?.ticketStatus || []).map((item) => ({
    name: item.status,
    value: item.count,
    color: getStatusColor(item.status),
  }));

  const ticketPriorityData = (dashboardData?.ticketPriority || []).map(
    (item) => ({
      name: item.priority,
      value: item.count,
      color: getPriorityColor(item.priority),
    })
  );

  const ticketTrendData = (dashboardData?.ticketTrend || []).map((item) => ({
    date: item.date,
    tickets: item.tickets || 0,
    resolved: item.resolved || 0,
  }));

  const functionData = (dashboardData?.functionData || []).map((fn) => ({
    name: fn.name || "Unknown",
    opened: fn.opened || 0,
    resolved: fn.resolved || 0,
    closed: fn.closed || 0,
  }));

  const topAgents = dashboardData?.topAgents || [];
  let slaMetrics = dashboardData?.slaMetrics || [];
  // If Customer Satisfaction is present in backend, add it to slaMetrics
  if (dashboardData?.satisfactionData?.average) {
    slaMetrics = [
      ...slaMetrics,
      {
        name: "Customer Satisfaction",
        description: "Average customer satisfaction rating (1-5 stars)",
        value: Math.round((dashboardData.satisfactionData.average / 5) * 100),
        target: 90,
      },
    ];
  }
  const responseTimeData = {
    data: (dashboardData?.responseTimeData?.data || []).map((item) => ({
      date: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      responseTime: item.responseTime || 0,
      resolutionTime: item.resolutionTime || 0,
    })),
    current: {
      responseTime: {
        value:
          dashboardData?.responseTimeData?.current?.responseTime?.value || 0,
        unit: "min",
        change:
          dashboardData?.responseTimeData?.current?.responseTime?.change || 0,
        changeDirection:
          dashboardData?.responseTimeData?.current?.responseTime
            ?.changeDirection || "increase",
      },
      resolutionTime: {
        value:
          dashboardData?.responseTimeData?.current?.resolutionTime?.value || 0,
        unit: "hrs",
        change:
          dashboardData?.responseTimeData?.current?.resolutionTime?.change || 0,
        changeDirection:
          dashboardData?.responseTimeData?.current?.resolutionTime
            ?.changeDirection || "increase",
      },
    },
  };

  const agentWorkload = dashboardData?.agentWorkload || [];
  const recentTickets = dashboardData?.recentTickets || [];
  const satisfactionData = {
    average: dashboardData?.satisfactionData?.average || 0,
    distribution: dashboardData?.satisfactionData?.distribution || [],
  };

  // Custom colors for charts
  const COLORS = {
    primary: {
      100: "#e0e7ff",
      200: "#c7d2fe",
      300: "#a5b4fc",
      400: "#818cf8",
      500: "#6366f1",
      600: "#4f46e5",
      700: "#4338ca",
      800: "#3730a3",
      900: "#312e81",
    },
    success: {
      100: "#d1fae5",
      500: "#10b981",
      700: "#047857",
    },
    warning: {
      100: "#fef3c7",
      500: "#f59e0b",
      700: "#b45309",
    },
    danger: {
      100: "#fee2e2",
      500: "#ef4444",
      700: "#b91c1c",
    },
    neutral: {
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pb-12">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500">
                Support Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>Last updated: April 18, 2025, 11:45 AM</span>
              </p>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1 shadow-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  className={
                    dateRange === "day"
                      ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400"
                      : ""
                  }
                  onClick={() => setDateRange("day")}
                >
                  Day
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={
                    dateRange === "week"
                      ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400"
                      : ""
                  }
                  onClick={() => setDateRange("week")}
                >
                  Week
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={
                    dateRange === "month"
                      ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400"
                      : ""
                  }
                  onClick={() => setDateRange("month")}
                >
                  Month
                </Button>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm"
                    >
                      <RefreshCwIcon
                        className={`h-4 w-4 ${
                          isRefreshing ? "animate-spin" : ""
                        }`}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh data</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm"
                  >
                    <MoreHorizontalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
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
                  <DropdownMenuItem>
                    <SettingsIcon className="mr-2 h-4 w-4" /> Dashboard settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Add this after the header section and before the Tabs component */}
      {!dashboardData?.isRealData && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <InfoIcon className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-amber-800 dark:text-amber-300">
                Demo Mode Active
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                You're viewing randomly generated demo data. Connect to a real
                API for actual metrics.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Tabs
          defaultValue="overview"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-900/30 dark:data-[state=active]:text-indigo-400"
            >
              <BarChart3Icon className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="tickets"
              className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-900/30 dark:data-[state=active]:text-indigo-400"
            >
              <TicketIcon className="h-4 w-4 mr-2" />
              Tickets
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-900/30 dark:data-[state=active]:text-indigo-400"
            >
              <ActivityIcon className="h-4 w-4 mr-2" />
              Performance
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent
            value="overview"
            className="space-y-6 animate-in fade-in-50"
          >
            {/* Key Stats */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="overflow-hidden bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-200 border-0">
                <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5">
                  <CardTitle className="text-sm font-medium">
                    Total Tickets
                  </CardTitle>
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                    <TicketIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold">
                    {formatNumber(dashboardData?.totalTickets || 0)}
                  </div>
                  <div className="flex items-center mt-2 text-sm">
                    <Badge
                      variant="outline"
                      className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-0"
                    >
                      <ArrowUpIcon className="h-3.5 w-3.5 mr-1" />
                      12% from last month
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-200 border-0">
                <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/5 dark:to-orange-500/5">
                  <CardTitle className="text-sm font-medium">
                    Open Tickets
                  </CardTitle>
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                    <LayersIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold">
                    {formatNumber(dashboardData?.openTickets || 0)}
                  </div>
                  <div className="flex items-center mt-2 text-sm">
                    <Badge
                      variant="outline"
                      className="bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-0"
                    >
                      <ArrowUpIcon className="h-3.5 w-3.5 mr-1" />
                      8% from last week
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-200 border-0">
                <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/5 dark:to-teal-500/5">
                  <CardTitle className="text-sm font-medium">
                    Resolved Today
                  </CardTitle>
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                    <CheckCircleIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold">
                    {formatNumber(dashboardData?.resolvedToday || 0)}
                  </div>
                  <div className="flex items-center mt-2 text-sm">
                    <Badge
                      variant="outline"
                      className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-0"
                    >
                      <ArrowUpIcon className="h-3.5 w-3.5 mr-1" />
                      23% from yesterday
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-200 border-0">
                <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-sky-500/10 to-blue-500/10 dark:from-sky-500/5 dark:to-blue-500/5">
                  <CardTitle className="text-sm font-medium">
                    Avg. Response Time
                  </CardTitle>
                  <div className="p-2 bg-sky-100 dark:bg-sky-900/30 rounded-full">
                    <ClockIcon className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold">
                    {dashboardData?.avgResponseTime || 0} min
                  </div>
                  <div className="flex items-center mt-2 text-sm">
                    <Badge
                      variant="outline"
                      className={`${
                        responseTimeData.current.responseTime
                          .changeDirection === "decrease"
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                          : "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400"
                      } border-0`}
                    >
                      {responseTimeData.current.responseTime.changeDirection ===
                      "decrease" ? (
                        <ArrowDownIcon className="h-3.5 w-3.5 mr-1" />
                      ) : (
                        <ArrowUpIcon className="h-3.5 w-3.5 mr-1" />
                      )}
                      {Math.abs(responseTimeData.current.responseTime.change)}%
                      from last week
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-11">
              {/* Status Distribution */}
              <Card className="col-span-3 overflow-hidden bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-200 border-0">
                <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Ticket Status</CardTitle>
                      <CardDescription>
                        Distribution of tickets by status
                      </CardDescription>
                    </div>
                    <PieChartIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ticketStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          innerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {ticketStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          formatter={(value, name) => [
                            `${value} tickets`,
                            name,
                          ]}
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            border: "none",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {ticketStatusData.map((status) => (
                      <div
                        key={status.name}
                        className="flex items-center gap-2"
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: status.color }}
                        ></div>
                        <span className="text-xs font-medium">
                          {status.name}: {status.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Ticket Trend */}
              <Card className="col-span-5 overflow-hidden bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-200 border-0">
                <CardHeader className="bg-gradient-to-r from-sky-500/10 to-blue-500/10 dark:from-sky-500/5 dark:to-blue-500/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Ticket Trend</CardTitle>
                      <CardDescription>
                        New vs. resolved tickets over time
                      </CardDescription>
                    </div>
                    <LineChartIcon className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={ticketTrendData}>
                        <defs>
                          <linearGradient
                            id="colorTickets"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#6366f1"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#6366f1"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                          <linearGradient
                            id="colorResolved"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#10b981"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#10b981"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 12 }}
                          tickLine={{ stroke: "#94a3b8" }}
                          axisLine={{ stroke: "#cbd5e1" }}
                        />
                        <YAxis
                          tick={{ fontSize: 12 }}
                          tickLine={{ stroke: "#94a3b8" }}
                          axisLine={{ stroke: "#cbd5e1" }}
                        />
                        <RechartsTooltip
                          formatter={(value, name) => [
                            value,
                            name === "tickets" ? "New Tickets" : "Resolved",
                          ]}
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            border: "none",
                          }}
                        />
                        <Legend
                          formatter={(value) => {
                            return (
                              <span className="text-xs font-medium">
                                {value === "tickets"
                                  ? "New Tickets"
                                  : "Resolved"}
                              </span>
                            );
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="tickets"
                          stroke="#6366f1"
                          fillOpacity={1}
                          fill="url(#colorTickets)"
                          strokeWidth={2}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                        <Area
                          type="monotone"
                          dataKey="resolved"
                          stroke="#10b981"
                          fillOpacity={1}
                          fill="url(#colorResolved)"
                          strokeWidth={2}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Tickets and Top Agents */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Recent Tickets */}
              <Card className="col-span-1 overflow-hidden bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-200 border-0">
                <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">
                        Recent Tickets
                      </CardTitle>
                      <CardDescription>Latest support requests</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                    >
                      <BellIcon className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-0 divide-y divide-slate-200 dark:divide-slate-700">
                      {recentTickets.map((ticket) => (
                        <div
                          key={ticket.id}
                          className="flex items-start space-x-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                        >
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{ticket.title}</p>
                              <div className="flex space-x-2">
                                <Badge
                                  className={`${getStatusColor(
                                    ticket.status
                                  )} text-white border-0`}
                                >
                                  {ticket.status}
                                </Badge>
                                <Badge
                                  className={`${getPriorityColor(
                                    ticket.priority
                                  )} text-white border-0`}
                                >
                                  {ticket.priority}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                              {ticket.description}
                            </p>
                            <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-500">
                              <div className="flex items-center space-x-1">
                                <Avatar className="h-5 w-5 border border-slate-200 dark:border-slate-700">
                                  <AvatarImage
                                    src={
                                      ticket?.user?.avatar ||
                                      "/placeholder.svg?height=40&width=40&query=user"
                                    }
                                    alt={ticket?.user?.name}
                                  />
                                  <AvatarFallback className="text-[10px]">
                                    {ticket?.user?.name?.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{ticket?.user?.name}</span>
                              </div>
                              <span>{ticket?.createdAt}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="bg-slate-50 dark:bg-slate-800/60 p-2">
                  <Button
                    variant="ghost"
                    className="w-full text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-300"
                  >
                    View All Tickets{" "}
                    <ChevronRightIcon className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              {/* Top Agents */}
              <Card className="col-span-1 overflow-hidden bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-200 border-0">
                <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/5 dark:to-teal-500/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">
                        Top Performing Agents
                      </CardTitle>
                      <CardDescription>
                        Based on resolved tickets
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                    >
                      <UsersIcon className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-0 divide-y divide-slate-200 dark:divide-slate-700">
                      {topAgents.map((agent, index) => (
                        <div
                          key={agent.id}
                          className="flex items-center space-x-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                        >
                          <div className="relative">
                            <Avatar className="h-10 w-10 border-2 border-emerald-100 dark:border-emerald-900/30">
                              <AvatarImage
                                src={
                                  agent.avatar ||
                                  `/placeholder.svg?height=40&width=40&query=person${index}`
                                }
                                alt={agent.name}
                              />
                              <AvatarFallback>
                                {agent.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {index < 3 && (
                              <div className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold border-2 border-white dark:border-slate-800">
                                {index + 1}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between">
                              <p className="font-medium">{agent.name}</p>
                              <p className="text-sm font-medium">
                                {agent.resolvedTickets} tickets
                              </p>
                            </div>
                            <div className="flex items-center text-xs text-slate-500 dark:text-slate-500">
                              <span>{agent.department}</span>
                              <span className="mx-2">•</span>
                              <span
                                className={`font-medium ${
                                  agent.performance >= 90
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-amber-600 dark:text-amber-400"
                                }`}
                              >
                                {agent.performance}% performance
                              </span>
                            </div>
                            <div className="relative pt-1">
                              <div className="overflow-hidden h-1.5 text-xs flex rounded-full bg-slate-200 dark:bg-slate-700">
                                <div
                                  style={{ width: `${agent.performance}%` }}
                                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all ${
                                    agent.performance >= 90
                                      ? "bg-emerald-500"
                                      : "bg-amber-500"
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
                <CardFooter className="bg-slate-50 dark:bg-slate-800/60 p-2">
                  <Button
                    variant="ghost"
                    className="w-full text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-300"
                  >
                    View All Agents{" "}
                    <ChevronRightIcon className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Tickets Tab */}
          <TabsContent
            value="tickets"
            className="space-y-6 animate-in fade-in-50"
          >
            {/* Search and Filter */}
            <Card className="bg-white dark:bg-slate-800 shadow-md border-0">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                    <Input
                      placeholder="Search tickets..."
                      className="pl-9 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select defaultValue="all-status">
                      <SelectTrigger className="w-[140px] bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700">
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
                      <SelectTrigger className="w-[140px] bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-priority">
                          All Priorities
                        </SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                    >
                      <FilterIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Function Distribution */}
            <Card className="bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-200 border-0">
              <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">
                      Tickets by Function
                    </CardTitle>
                    <CardDescription>
                      Distribution of tickets across functions
                    </CardDescription>
                  </div>
                  <BarChart3Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={functionData} barGap={8} barSize={20}>
                      <defs>
                        <linearGradient
                          id="barOpened"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#6366f1"
                            stopOpacity={1}
                          />
                          <stop
                            offset="100%"
                            stopColor="#818cf8"
                            stopOpacity={0.8}
                          />
                        </linearGradient>
                        <linearGradient
                          id="barResolved"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#10b981"
                            stopOpacity={1}
                          />
                          <stop
                            offset="100%"
                            stopColor="#34d399"
                            stopOpacity={0.8}
                          />
                        </linearGradient>
                        <linearGradient
                          id="barClosed"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#64748b"
                            stopOpacity={1}
                          />
                          <stop
                            offset="100%"
                            stopColor="#94a3b8"
                            stopOpacity={0.8}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        tickLine={{ stroke: "#94a3b8" }}
                        axisLine={{ stroke: "#cbd5e1" }}
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickLine={{ stroke: "#94a3b8" }}
                        axisLine={{ stroke: "#cbd5e1" }}
                      />
                      <RechartsTooltip
                        formatter={(value, name) => [
                          value,
                          name === "opened"
                            ? "Opened"
                            : name === "resolved"
                            ? "Resolved"
                            : "Closed",
                        ]}
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                          border: "none",
                        }}
                      />
                      <Legend
                        formatter={(value) => {
                          return (
                            <span className="text-xs font-medium">
                              {value === "opened"
                                ? "Opened"
                                : value === "resolved"
                                ? "Resolved"
                                : "Closed"}
                            </span>
                          );
                        }}
                      />
                      <Bar
                        dataKey="opened"
                        fill="url(#barOpened)"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="resolved"
                        fill="url(#barResolved)"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="closed"
                        fill="url(#barClosed)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Customer Satisfaction and SLA */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Customer Satisfaction */}
              <Card className="bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-200 border-0">
                <CardHeader className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/5 dark:to-orange-500/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">
                        Customer Satisfaction
                      </CardTitle>
                      <CardDescription>
                        Rating distribution (1-5 stars)
                      </CardDescription>
                    </div>
                    <StarIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center mb-6">
                    <div className="text-center p-6 bg-amber-50 dark:bg-amber-900/20 rounded-full w-28 h-28 flex flex-col items-center justify-center">
                      <div className="text-4xl font-bold text-amber-600 dark:text-amber-400">
                        {satisfactionData.average}
                      </div>
                      <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                        Average
                      </div>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.round(satisfactionData.average)
                                ? "text-amber-500"
                                : "text-slate-300 dark:text-slate-600"
                            }`}
                            fill={
                              i < Math.round(satisfactionData.average)
                                ? "currentColor"
                                : "none"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={satisfactionData.distribution}
                        barSize={30}
                      >
                        <defs>
                          <linearGradient
                            id="satisfactionGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#f59e0b"
                              stopOpacity={1}
                            />
                            <stop
                              offset="100%"
                              stopColor="#fbbf24"
                              stopOpacity={0.8}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          opacity={0.2}
                          vertical={false}
                        />
                        <XAxis
                          dataKey="rating"
                          tick={{ fontSize: 12 }}
                          tickLine={{ stroke: "#94a3b8" }}
                          axisLine={{ stroke: "#cbd5e1" }}
                        />
                        <YAxis
                          tick={{ fontSize: 12 }}
                          tickLine={{ stroke: "#94a3b8" }}
                          axisLine={{ stroke: "#cbd5e1" }}
                        />
                        <RechartsTooltip
                          formatter={(value, name) => [
                            `${value} ratings`,
                            `${name} stars`,
                          ]}
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            border: "none",
                          }}
                        />
                        <Bar
                          dataKey="count"
                          fill="url(#satisfactionGradient)"
                          radius={[4, 4, 0, 0]}
                          label={{
                            position: "top",
                            formatter: (value) => value,
                            fill: "#64748b",
                            fontSize: 12,
                          }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-5 gap-2 mt-4">
                    {satisfactionData.distribution.map((item) => (
                      <div key={item.rating} className="text-center">
                        <div className="text-xs font-medium flex justify-center">
                          {[...Array(Number.parseInt(item.rating))].map(
                            (_, i) => (
                              <StarIcon
                                key={i}
                                className="h-3 w-3 text-amber-500"
                                fill="currentColor"
                              />
                            )
                          )}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {item.count}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* SLA Compliance */}
              <Card className="bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-200 border-0">
                <CardHeader className="bg-gradient-to-r from-sky-500/10 to-blue-500/10 dark:from-sky-500/5 dark:to-blue-500/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">
                        SLA Compliance
                      </CardTitle>
                      <CardDescription>
                        Service level agreement metrics
                      </CardDescription>
                    </div>
                    <ShieldIcon className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-8">
                    {slaMetrics.map((metric, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <div>
                            <div className="font-medium flex items-center">
                              {metric.name}
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <InfoIcon className="h-3.5 w-3.5 ml-1 text-slate-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs">
                                      {metric.description}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {metric.description}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium flex items-center justify-end">
                              <span
                                className={
                                  metric.value >= metric.target
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-amber-600 dark:text-amber-400"
                                }
                              >
                                {metric.value}%
                              </span>
                              {metric.value >= metric.target ? (
                                <CheckIcon className="h-4 w-4 ml-1 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <XIcon className="h-4 w-4 ml-1 text-amber-600 dark:text-amber-400" />
                              )}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              Target: {metric.target}%
                            </div>
                          </div>
                        </div>
                        <Progress
                          value={metric.value}
                          max={100}
                          className="h-2 bg-slate-200 dark:bg-slate-700"
                        >
                          <div
                            className={`h-full ${
                              metric.value >= metric.target
                                ? "bg-emerald-500"
                                : "bg-amber-500"
                            }`}
                            style={{ width: `${metric.value}%` }}
                          />
                        </Progress>
                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span>0%</span>
                          <span>50%</span>
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
          <TabsContent
            value="performance"
            className="space-y-6 animate-in fade-in-50"
          >
            {/* Response & Resolution Time */}
            <Card className="bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-200 border-0">
              <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">
                      Response & Resolution Time
                    </CardTitle>
                    <CardDescription>
                      Average times over the last 6 weeks
                    </CardDescription>
                  </div>
                  <ClockIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={responseTimeData.data}>
                      <defs>
                        <linearGradient
                          id="responseTimeGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#6366f1"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#6366f1"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                        <linearGradient
                          id="resolutionTimeGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#8b5cf6"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#8b5cf6"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickLine={{ stroke: "#94a3b8" }}
                        axisLine={{ stroke: "#cbd5e1" }}
                      />
                      <YAxis
                        yAxisId="left"
                        orientation="left"
                        tick={{ fontSize: 12 }}
                        tickLine={{ stroke: "#94a3b8" }}
                        axisLine={{ stroke: "#cbd5e1" }}
                        label={{
                          value: "Response Time (min)",
                          angle: -90,
                          position: "insideLeft",
                          style: {
                            textAnchor: "middle",
                            fill: "#6366f1",
                            fontSize: 12,
                          },
                        }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fontSize: 12 }}
                        tickLine={{ stroke: "#94a3b8" }}
                        axisLine={{ stroke: "#cbd5e1" }}
                        label={{
                          value: "Resolution Time (hrs)",
                          angle: 90,
                          position: "insideRight",
                          style: {
                            textAnchor: "middle",
                            fill: "#8b5cf6",
                            fontSize: 12,
                          },
                        }}
                      />
                      <RechartsTooltip
                        formatter={(value, name) => [
                          value,
                          name === "responseTime"
                            ? "Response Time (min)"
                            : "Resolution Time (hrs)",
                        ]}
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                          border: "none",
                        }}
                      />
                      <Legend
                        formatter={(value) => {
                          return (
                            <span className="text-xs font-medium">
                              {value === "responseTime"
                                ? "Response Time (min)"
                                : "Resolution Time (hrs)"}
                            </span>
                          );
                        }}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="responseTime"
                        stroke="#6366f1"
                        strokeWidth={3}
                        activeDot={{ r: 8, strokeWidth: 0 }}
                        dot={{ r: 0 }}
                        fill="url(#responseTimeGradient)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="resolutionTime"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        dot={{ r: 0 }}
                        activeDot={{ r: 8, strokeWidth: 0 }}
                        fill="url(#resolutionTimeGradient)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-sm">
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Current Response Time
                    </div>
                    <div className="flex items-center mt-1">
                      <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {responseTimeData.current.responseTime.value}{" "}
                        {responseTimeData.current.responseTime.unit}
                      </div>
                      <div
                        className={`ml-2 flex items-center text-sm ${
                          responseTimeData.current.responseTime
                            .changeDirection === "decrease"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {responseTimeData.current.responseTime
                          .changeDirection === "decrease" ? (
                          <TrendingDownIcon className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingUpIcon className="h-4 w-4 mr-1" />
                        )}
                        {responseTimeData.current.responseTime.change}%
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Compared to previous period
                    </div>
                  </div>
                  <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-sm">
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Current Resolution Time
                    </div>
                    <div className="flex items-center mt-1">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {responseTimeData.current.resolutionTime.value}{" "}
                        {responseTimeData.current.resolutionTime.unit}
                      </div>
                      <div
                        className={`ml-2 flex items-center text-sm ${
                          responseTimeData.current.resolutionTime
                            .changeDirection === "decrease"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {responseTimeData.current.resolutionTime
                          .changeDirection === "decrease" ? (
                          <TrendingDownIcon className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingUpIcon className="h-4 w-4 mr-1" />
                        )}
                        {responseTimeData.current.resolutionTime.change}%
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Compared to previous period
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Agent Performance and Workload */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Agent Performance */}
              <Card className="bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-200 border-0">
                <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/5 dark:to-teal-500/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">
                        Agent Performance
                      </CardTitle>
                      <CardDescription>
                        Tickets resolved per agent
                      </CardDescription>
                    </div>
                    <ZapIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={agentWorkload}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                        barSize={16}
                      >
                        <defs>
                          <linearGradient
                            id="agentPerformanceGradient"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="0"
                          >
                            <stop
                              offset="0%"
                              stopColor="#10b981"
                              stopOpacity={1}
                            />
                            <stop
                              offset="100%"
                              stopColor="#34d399"
                              stopOpacity={0.8}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          opacity={0.2}
                          horizontal={false}
                        />
                        <XAxis
                          type="number"
                          tick={{ fontSize: 12 }}
                          tickLine={{ stroke: "#94a3b8" }}
                          axisLine={{ stroke: "#cbd5e1" }}
                        />
                        <YAxis
                          type="category"
                          dataKey="name"
                          tick={{ fontSize: 12 }}
                          tickLine={{ stroke: "#94a3b8" }}
                          axisLine={{ stroke: "#cbd5e1" }}
                        />
                        <RechartsTooltip
                          formatter={(value, name) => [
                            value,
                            "Resolved Tickets",
                          ]}
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            border: "none",
                          }}
                        />
                        <Bar
                          dataKey="resolvedTickets"
                          fill="url(#agentPerformanceGradient)"
                          radius={[0, 4, 4, 0]}
                          label={{
                            position: "right",
                            formatter: (value) => value,
                            fill: "#64748b",
                            fontSize: 12,
                          }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Agent Workload */}
              <Card className="bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-200 border-0">
                <CardHeader className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/5 dark:to-orange-500/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">
                        Current Workload
                      </CardTitle>
                      <CardDescription>
                        Tickets assigned per agent
                      </CardDescription>
                    </div>
                    <ClipboardListIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {agentWorkload.map((agent, index) => (
                      <div key={agent.id} className="space-y-2">
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2 border border-amber-200 dark:border-amber-900/30">
                              <AvatarImage
                                src={
                                  agent.avatar ||
                                  `/placeholder.svg?height=24&width=24&query=person${index}`
                                }
                                alt={agent.name}
                              />
                              <AvatarFallback className="text-[10px]">
                                {agent.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{agent.name}</span>
                          </div>
                          <div className="text-sm">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="font-medium">
                                    {agent.currentWorkload} / {agent.capacity}{" "}
                                    tickets
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {Math.round(
                                      (agent.currentWorkload / agent.capacity) *
                                        100
                                    )}
                                    % of capacity
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                        <Progress
                          value={(agent.currentWorkload / agent.capacity) * 100}
                          max={100}
                          className="h-2 bg-slate-200 dark:bg-slate-700"
                        >
                          <div
                            className={`h-full transition-all ${
                              agent.currentWorkload / agent.capacity > 0.9
                                ? "bg-rose-500"
                                : agent.currentWorkload / agent.capacity > 0.7
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{
                              width: `${
                                (agent.currentWorkload / agent.capacity) * 100
                              }%`,
                            }}
                          />
                        </Progress>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="bg-slate-50 dark:bg-slate-800/60 p-2">
                  <Button
                    variant="ghost"
                    className="w-full text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-700 dark:hover:text-amber-300"
                  >
                    View Workload Distribution{" "}
                    <ChevronRightIcon className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
