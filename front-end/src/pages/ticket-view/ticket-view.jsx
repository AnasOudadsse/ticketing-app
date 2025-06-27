"use client";

import { useState, useEffect, useRef, Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { format, formatDistanceToNow } from "date-fns";
import { useToast } from "@chakra-ui/react";
import PropTypes from "prop-types";
import Header from "../header/header";
import { Dialog, Transition } from "@headlessui/react";

// Icons
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  PaperClipIcon,
  PrinterIcon,
  TagIcon,
  UserCircleIcon,
  UserPlusIcon,
  XCircleIcon,
  XMarkIcon,
  CheckIcon,
  ChevronRightIcon,
  ArrowDownTrayIcon,
  ClockIcon as ClockIconOutline,
} from "@heroicons/react/24/outline";
import { ClockIcon as ClockIconMini } from "@heroicons/react/20/solid";
import { StarIcon } from "@heroicons/react/24/solid";

// Status badge component
const StatusBadge = ({ status }) => {
  let bgColor, textColor, icon, label;

  switch (status) {
    case "opened":
      bgColor = "bg-emerald-100";
      textColor = "text-emerald-800";
      icon = <ExclamationTriangleIcon className="h-4 w-4 text-emerald-600" />;
      label = "Open";
      break;
    case "reserved":
      bgColor = "bg-amber-100";
      textColor = "text-amber-800";
      icon = <ClockIcon className="h-4 w-4 text-amber-600" />;
      label = "Reserved";
      break;
    case "resolved":
      bgColor = "bg-blue-100";
      textColor = "text-blue-800";
      icon = <CheckCircleIcon className="h-4 w-4 text-blue-600" />;
      label = "Resolved";
      break;
    case "closed":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      icon = <XCircleIcon className="h-4 w-4 text-red-600" />;
      label = "Closed";
      break;
    default:
      bgColor = "bg-gray-100";
      textColor = "text-gray-800";
      icon = null;
      label = status;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${bgColor} ${textColor}`}
    >
      {icon}
      {label}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

// Priority badge component
const PriorityBadge = ({ priority }) => {
  let bgColor, textColor, label;

  switch (priority?.toLowerCase()) {
    case "high":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      label = "High Priority";
      break;
    case "medium":
      bgColor = "bg-amber-100";
      textColor = "text-amber-800";
      label = "Medium Priority";
      break;
    case "low":
      bgColor = "bg-emerald-100";
      textColor = "text-emerald-800";
      label = "Low Priority";
      break;
    default:
      bgColor = "bg-gray-100";
      textColor = "text-gray-800";
      label = "Normal Priority";
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${bgColor} ${textColor}`}
    >
      {label}
    </span>
  );
};

PriorityBadge.propTypes = {
  priority: PropTypes.string,
};

// Avatar component
const Avatar = ({ name, size = "md" }) => {
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  return (
    <div
      className={`flex ${sizeClasses[size]} items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 font-medium text-white`}
    >
      {getInitials(name)}
    </div>
  );
};

Avatar.propTypes = {
  name: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
};

// Button component
const Button = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 focus:ring-emerald-500",
    secondary:
      "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-emerald-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    success:
      "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500",
    warning: "bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500",
    info: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
  };

  const sizeClasses = {
    sm: "text-xs px-2.5 py-1.5 rounded-md",
    md: "text-sm px-4 py-2 rounded-md",
    lg: "text-base px-6 py-3 rounded-md",
    icon: "p-2 rounded-full",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "danger",
    "success",
    "warning",
    "info",
    "ghost",
  ]),
  size: PropTypes.oneOf(["sm", "md", "lg", "icon"]),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.string,
};

// Skeleton component
const Skeleton = ({ className = "", ...props }) => {
  return (
    <div
      className={`animate-pulse rounded bg-gray-200 ${className}`}
      {...props}
    />
  );
};

Skeleton.propTypes = {
  className: PropTypes.string,
};

// Tab component
const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
              activeTab === index
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center">
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
};

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
    })
  ).isRequired,
  activeTab: PropTypes.number.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

// Helper to convert DB datetime to UTC string
const toUTCDateString = (dateStr) => {
  if (!dateStr || typeof dateStr !== "string") return "—";
  // If already ISO (contains 'T' and ends with 'Z'), use as is
  if (dateStr.includes("T") && dateStr.endsWith("Z")) {
    const dateObj = new Date(dateStr);
    return isNaN(dateObj)
      ? "—"
      : dateObj.toLocaleString("en-US", { timeZone: "UTC" });
  }
  // Otherwise, convert MySQL format to ISO
  const iso = dateStr.replace(" ", "T") + "Z";
  const dateObj = new Date(iso);
  return isNaN(dateObj)
    ? "—"
    : dateObj.toLocaleString("en-US", { timeZone: "UTC" });
};

export const TicketView = () => {
  const [ticket, setTicket] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [supportUsers, setSupportUsers] = useState([]);
  const [selectedSupportUser, setSelectedSupportUser] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const [rating, setRating] = useState(ticket?.satisfaction_rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showRatingUI, setShowRatingUI] = useState(false);

  // New rating states
  const [responseTimeRating, setResponseTimeRating] = useState(
    ticket?.response_time_rating || 0
  );
  const [resolutionQualityRating, setResolutionQualityRating] = useState(
    ticket?.resolution_quality_rating || 0
  );
  const [communicationRating, setCommunicationRating] = useState(
    ticket?.communication_rating || 0
  );
  const [wouldRecommend, setWouldRecommend] = useState(
    ticket?.would_recommend || null
  );

  const toast = useToast();
  const { id } = useParams();
  const navigate = useNavigate();
  const logged_id = localStorage.getItem("id");
  const cancelButtonRef = useRef(null);

  // Fetch the user's role from the API
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("http://127.0.0.1:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserRole(response.data.role);
      } catch (error) {
        console.error("Error fetching user role:", error);
        toast({
          title: "Error",
          description: "Failed to fetch user data.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };
    fetchUserRole();
  }, [toast]);

  // Fetch ticket details
  useEffect(() => {
    const fetchTicket = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/tickets/get/${id}`
        );
        setTicket(response.data);
        setIsLoading(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch the ticket.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setIsLoading(false);
      }
    };
    fetchTicket();
  }, [id, toast]);

  useEffect(() => {
    if (
      userRole === "client" &&
      ["resolved", "closed"].includes(ticket?.status) &&
      String(ticket?.created_by) === String(logged_id) &&
      ticket?.satisfaction_rating == null
    ) {
      setShowRatingUI(true);
    } else {
      setShowRatingUI(false);
    }
  }, [ticket, userRole, logged_id]);

  // Fetch list of Support IT users
  const fetchSupportUsers = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/getSuppotIts"
      );
      setSupportUsers(response.data);
    } catch (error) {
      console.error("Error fetching support users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch support users.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Assign ticket
  const handleAssign = async () => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/tickets/${id}/assign`,
        { reserved_by: selectedSupportUser },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      toast({
        title: "Success",
        description: "Ticket assigned successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setIsAssignModalOpen(false);
      // Refresh ticket data
      const response = await axios.get(
        `http://127.0.0.1:8000/api/tickets/get/${id}`
      );
      setTicket(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign ticket.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleReserve = async () => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/tickets/${id}/reserve`, {
        reserved_by: logged_id,
      });
      toast({
        title: "Success",
        description: "The ticket has been reserved.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // Update local state
      const updatedTicket = { ...ticket, status: "reserved" };
      setTicket(updatedTicket);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reserve the ticket.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleResolve = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/tickets/${id}/resolve`, {
        resolved_by: logged_id,
      });
      toast({
        title: "Success",
        description: "The ticket has been resolved.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // Update local state
      const updatedTicket = { ...ticket, status: "resolved" };
      setTicket(updatedTicket);
      setIsResolveDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resolve the ticket.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsResolveDialogOpen(false);
    }
  };

  const handleCloseTicket = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/tickets/${id}/close`, {
        closed_by: logged_id,
      });
      toast({
        title: "Success",
        description: "The ticket has been closed.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // Update local state
      const updatedTicket = { ...ticket, status: "closed" };
      setTicket(updatedTicket);
      setIsCloseDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to close the ticket.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsCloseDialogOpen(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadImage = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/tickets/${ticket.id}/download-attachment`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `attachment_${ticket.id}.jpg`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download Started",
        description: "Your file is being downloaded.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error downloading attachment:", error);
      toast({
        title: "Error",
        description: "Failed to download attachment.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSubmitRating = async () => {
    setSubmitting(true);
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/tickets/${ticket.id}/rate`,
        {
          rating,
          comment,
          response_time_rating: responseTimeRating,
          resolution_quality_rating: resolutionQualityRating,
          communication_rating: communicationRating,
          would_recommend: wouldRecommend,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      toast({
        title: "Thank you!",
        description: "Your feedback has been submitted.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setShowRatingUI(false);
      setTicket({
        ...ticket,
        satisfaction_rating: rating,
        satisfaction_comment: comment,
        response_time_rating: responseTimeRating,
        resolution_quality_rating: resolutionQualityRating,
        communication_rating: communicationRating,
        would_recommend: wouldRecommend,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit rating.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Define tabs
  const tabs = [
    {
      label: "Description",
      icon: <DocumentTextIcon className="h-5 w-5" />,
    },
  ];

  // Add attachment tab if there's an attachment
  if (ticket?.attachement) {
    tabs.push({
      label: "Attachment",
      icon: <PaperClipIcon className="h-5 w-5" />,
    });
  }

  // Add rating tab if ticket is resolved/closed and user is the creator
  if (
    userRole === "client" &&
    ["resolved", "closed"].includes(ticket?.status) &&
    String(ticket?.created_by) === String(logged_id)
  ) {
    tabs.push({
      label: "Rating",
      icon: <StarIcon className="h-5 w-5" />,
    });
  }

  // Debug: log the values to check why rating tab might not show
  console.log("Debug Rating Tab:", {
    userRole,
    ticketStatus: ticket?.status,
    ticketCreatedBy: ticket?.created_by,
    loggedId: logged_id,
    shouldShowRating:
      userRole === "client" &&
      ["resolved", "closed"].includes(ticket?.status) &&
      String(ticket?.created_by) === String(logged_id),
    tabs: tabs,
  });

  // Debug: log the raw date values
  if (ticket) {
    console.log(
      "created_at:",
      ticket.created_at,
      "resolution_date:",
      ticket.resolution_date
    );
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <>
        <Header
          name="Loading..."
          greeting="Have a nice day"
          role=""
          profile="https://img.freepik.com/photos-premium/photo-profil-vecteur-plat-homme-elegant-generee-par-ai_606187-310.jpg"
        />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Skeleton className="mb-2 h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div>
                  <Skeleton className="mb-1 h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!ticket) {
    return (
      <>
        <Header
          name="Error"
          greeting="Have a nice day"
          role={userRole}
          profile="https://img.freepik.com/photos-premium/photo-profil-vecteur-plat-homme-elegant-generee-par-ai_606187-310.jpg"
        />
        <div className="mx-auto max-w-7xl px-4 py-8 text-center sm:px-6 lg:px-8">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Ticket Not Found
          </h1>
          <p className="mb-6 text-gray-600">
            The ticket you're looking for could not be found or has been
            deleted.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate("/tickets/ticketlist")}
          >
            <ArrowLeftIcon className="mr-2 h-5 w-5" />
            Back to Tickets
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        name={ticket.creator?.name}
        greeting="Have a nice day"
        role={userRole}
        profile="https://img.freepik.com/photos-premium/photo-profil-vecteur-plat-homme-elegant-generee-par-ai_606187-310.jpg"
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb navigation */}
        <nav className="mb-6 flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <button
                onClick={() => navigate("/tickets/ticketlist")}
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Tickets
              </button>
            </li>
            <li>
              <ChevronRightIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </li>
            <li>
              <span className="text-sm font-medium text-gray-900">
                Ticket #{ticket.id}
              </span>
            </li>
          </ol>
        </nav>

        {/* Page header */}
        <div className="mb-6 flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {ticket?.problem?.specification || ticket?.problem?.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={ticket.status} />
              {ticket.priority && <PriorityBadge priority={ticket.priority} />}
              <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                Ticket #{ticket.id}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsHistoryDrawerOpen(true)}
              className="inline-flex items-center rounded-full border border-gray-300 bg-white p-2 text-gray-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              title="View History"
            >
              <ClockIconOutline className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">View History</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center rounded-full border border-gray-300 bg-white p-2 text-gray-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              title="Print Ticket"
            >
              <PrinterIcon className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Print Ticket</span>
            </button>
            <Button
              variant="secondary"
              onClick={() => navigate("/tickets/ticketlist")}
            >
              <ArrowLeftIcon className="mr-2 h-5 w-5" />
              Back to List
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column - Ticket details */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Ticket Details</h2>
                  <span className="text-sm text-emerald-100">
                    Created {format(new Date(ticket.created_at), "MMM d, yyyy")}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <Tabs
                  tabs={tabs}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />

                <div className="mt-6">
                  {/* Description Tab */}
                  {activeTab === 0 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="mb-2 text-lg font-medium text-gray-900">
                          Problem Description
                        </h3>
                        <p className="whitespace-pre-wrap text-gray-700">
                          {ticket.description}
                        </p>
                      </div>

                      <hr className="my-6 border-gray-200" />

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <p className="mb-1 flex items-center text-sm font-medium text-gray-500">
                            <TagIcon className="mr-2 h-4 w-4" /> Category
                          </p>
                          <p className="text-gray-900">
                            {ticket?.problem?.type || "Uncategorized"}
                          </p>
                        </div>

                        <div>
                          <p className="mb-1 flex items-center text-sm font-medium text-gray-500">
                            <CalendarIcon className="mr-2 h-4 w-4" /> Created
                          </p>
                          <p className="text-gray-900">
                            {toUTCDateString(ticket.created_at)}
                          </p>
                        </div>

                        <div>
                          <p className="mb-1 flex items-center text-sm font-medium text-gray-500">
                            <UserCircleIcon className="mr-2 h-4 w-4" /> Created
                            By
                          </p>
                          <p className="text-gray-900">
                            {ticket.creator?.name || "Unknown"}
                          </p>
                        </div>

                        {ticket.support_it && (
                          <div>
                            <p className="mb-1 flex items-center text-sm font-medium text-gray-500">
                              <UserCircleIcon className="mr-2 h-4 w-4" />{" "}
                              Assigned To
                            </p>
                            <p className="text-gray-900">
                              {ticket.support_it?.name || "Unassigned"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {/* Attachment Tab */}
                  {activeTab === 1 && ticket.attachement && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Attached File
                      </h3>

                      <div className="overflow-hidden rounded-lg border border-gray-200">
                        {ticket.image && (
                          <div
                            className="relative cursor-pointer"
                            onClick={() => setIsImageModalOpen(true)}
                          >
                            <img
                              src={ticket.image || "/placeholder.svg"}
                              alt="Ticket Attachment"
                              className="h-auto w-full max-h-[400px] object-cover transition-transform duration-300 hover:scale-[1.02]"
                            />
                            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/60 p-2 text-white">
                              <span className="text-sm">Click to enlarge</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadImage();
                                }}
                                className="rounded-full bg-white/20 p-1.5 hover:bg-white/30"
                              >
                                <ArrowDownTrayIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )}

                        {!ticket.image && ticket.attachement && (
                          <div className="flex flex-col items-center justify-center bg-gray-50 p-8">
                            <DocumentTextIcon className="mb-4 h-12 w-12 text-gray-400" />
                            <p className="mb-4 text-gray-700">
                              File attachment available for download
                            </p>
                            <Button variant="primary" onClick={downloadImage}>
                              <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
                              Download Attachment
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {/* Rating Tab */}
                  {activeTab === (ticket?.attachement ? 2 : 1) &&
                    userRole === "client" &&
                    ["resolved", "closed"].includes(ticket?.status) &&
                    String(ticket?.created_by) === String(logged_id) && (
                      <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900">
                          Customer Satisfaction
                        </h3>

                        {/* Show rating UI for unrated tickets */}
                        {!ticket.satisfaction_rating && showRatingUI && (
                          <div className="bg-gray-50 rounded-lg p-6">
                            <div className="mb-6">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Overall Experience (1-5 stars)
                              </label>
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <StarIcon
                                    key={star}
                                    className={`h-8 w-8 cursor-pointer transition-colors ${
                                      (hoverRating || rating) >= star
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                  />
                                ))}
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                {rating > 0 && `${rating} out of 5 stars`}
                              </p>
                            </div>

                            {/* Response Time Rating */}
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Response Time (1-5 stars)
                              </label>
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <StarIcon
                                    key={star}
                                    className={`h-6 w-6 cursor-pointer transition-colors ${
                                      responseTimeRating >= star
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                    onClick={() => setResponseTimeRating(star)}
                                  />
                                ))}
                              </div>
                            </div>

                            {/* Resolution Quality Rating */}
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Resolution Quality (1-5 stars)
                              </label>
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <StarIcon
                                    key={star}
                                    className={`h-6 w-6 cursor-pointer transition-colors ${
                                      resolutionQualityRating >= star
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                    onClick={() =>
                                      setResolutionQualityRating(star)
                                    }
                                  />
                                ))}
                              </div>
                            </div>

                            {/* Communication Rating */}
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Communication (1-5 stars)
                              </label>
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <StarIcon
                                    key={star}
                                    className={`h-6 w-6 cursor-pointer transition-colors ${
                                      communicationRating >= star
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                    onClick={() => setCommunicationRating(star)}
                                  />
                                ))}
                              </div>
                            </div>

                            {/* Would Recommend */}
                            <div className="mb-4">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={wouldRecommend === true}
                                  onChange={(e) =>
                                    setWouldRecommend(e.target.checked)
                                  }
                                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                  I would recommend this service to others
                                </span>
                              </label>
                            </div>

                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Additional Comments (Optional)
                              </label>
                              <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                rows={3}
                                placeholder="Share your feedback about the service..."
                              />
                            </div>

                            <button
                              onClick={handleSubmitRating}
                              disabled={rating === 0 || submitting}
                              className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {submitting ? "Submitting..." : "Submit Rating"}
                            </button>
                          </div>
                        )}

                        {/* Show submitted rating */}
                        {ticket.satisfaction_rating && (
                          <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-lg font-medium text-gray-900">
                                Your Rating
                              </h4>
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <StarIcon
                                    key={star}
                                    className={`h-6 w-6 ${
                                      star <= ticket.satisfaction_rating
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                                <span className="ml-2 text-sm text-gray-600">
                                  {ticket.satisfaction_rating} out of 5 stars
                                </span>
                              </div>
                            </div>

                            {ticket.satisfaction_comment && (
                              <div className="mb-4">
                                <h5 className="text-sm font-medium text-gray-700 mb-2">
                                  Your Comment
                                </h5>
                                <p className="text-gray-600 bg-gray-50 p-3 rounded-md">
                                  {ticket.satisfaction_comment}
                                </p>
                              </div>
                            )}

                            <div className="text-xs text-gray-500">
                              Rated on{" "}
                              {new Date(ticket.updated_at).toLocaleDateString()}
                            </div>
                          </div>
                        )}

                        {/* Show ticket assignment information */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-3">
                            Ticket Assignment Information
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Created by:</span>
                              <span className="font-medium">
                                {ticket.creator?.name || "Unknown"}
                              </span>
                            </div>
                            {ticket.reservedBy && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Assigned to:
                                </span>
                                <span className="font-medium">
                                  {ticket.reservedBy.name}
                                </span>
                              </div>
                            )}
                            {ticket.resolvedBy && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Resolved by:
                                </span>
                                <span className="font-medium">
                                  {ticket.resolvedBy.name}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Show message if rating is not available */}
                        {!ticket.satisfaction_rating && !showRatingUI && (
                          <div className="text-center py-8">
                            <p className="text-gray-500">
                              Rating is not available for this ticket.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                </div>
              </div>

              <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                <div className="flex justify-end">
                  <div className="flex space-x-3">
                    {userRole === "client" && ticket.status === "opened" && (
                      <Button
                        variant="danger"
                        onClick={() => setIsCloseDialogOpen(true)}
                      >
                        <LockClosedIcon className="mr-2 h-5 w-5" />
                        Close Ticket
                      </Button>
                    )}

                    {["admin", "supportIt"].includes(userRole) && (
                      <>
                        {ticket.status === "opened" && (
                          <Button variant="info" onClick={handleReserve}>
                            <ClockIconMini className="mr-2 h-5 w-5" />
                            Reserve Ticket
                          </Button>
                        )}

                        {ticket.status === "reserved" && (
                          <Button
                            variant="success"
                            onClick={() => setIsResolveDialogOpen(true)}
                          >
                            <CheckIcon className="mr-2 h-5 w-5" />
                            Resolve Ticket
                          </Button>
                        )}
                      </>
                    )}

                    {userRole === "admin" && ticket.status === "opened" && (
                      <Button
                        variant="primary"
                        onClick={() => {
                          setIsAssignModalOpen(true);
                          fetchSupportUsers();
                        }}
                      >
                        <UserPlusIcon className="mr-2 h-5 w-5" />
                        Assign Ticket
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Ticket info */}
          <div className="space-y-6">
            {/* Creator info */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
                <h3 className="text-base font-medium text-gray-900">
                  Ticket Creator
                </h3>
              </div>

              <div className="px-4 py-5 sm:px-6">
                <div className="flex items-center">
                  <Avatar name={ticket.creator?.name} className="mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {ticket.creator?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {ticket.creator?.email || "No email provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket status */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
                <h3 className="text-base font-medium text-gray-900">
                  Ticket Status
                </h3>
              </div>

              <div className="px-4 py-5 sm:px-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Status:</span>
                    <StatusBadge status={ticket.status} />
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Created:</span>
                    <span className="text-sm text-gray-900">
                      {toUTCDateString(ticket.created_at)}
                    </span>
                  </div>

                  {ticket.resolution_date && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Resolved:</span>
                      <span className="text-sm text-gray-900">
                        {toUTCDateString(ticket.resolution_date)}
                      </span>
                    </div>
                  )}

                  {ticket.reservedBy && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">
                        Assigned to:
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {ticket.reservedBy.name}
                      </span>
                    </div>
                  )}

                  {ticket.resolvedBy && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">
                        Resolved by:
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {ticket.resolvedBy.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
                <h3 className="text-base font-medium text-gray-900">
                  Categories & Tags
                </h3>
              </div>

              <div className="px-4 py-5 sm:px-6">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                    {ticket?.problem?.type || "General"}
                  </span>
                  <span className="inline-flex items-center rounded-md bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    {ticket?.problem?.specification || ticket?.problem?.name}
                  </span>
                  {ticket.priority && (
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ${
                        ticket.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : ticket.priority === "medium"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {ticket.priority} priority
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      <Transition show={isImageModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsImageModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-transparent text-left shadow-xl transition-all">
                  <button
                    type="button"
                    className="absolute right-2 top-2 rounded-full bg-black/20 p-1 text-white hover:bg-black/40"
                    onClick={() => setIsImageModalOpen(false)}
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                  <img
                    src={ticket.image || "/placeholder.svg"}
                    alt="Ticket Attachment"
                    className="h-auto w-full max-h-[80vh] object-contain"
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Assign Modal */}
      <Transition show={isAssignModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsAssignModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500/75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Assign Ticket
                      </Dialog.Title>
                      <div className="mt-4">
                        <p className="mb-4 text-left text-sm text-gray-600">
                          Select a Support IT to assign this ticket:
                        </p>
                        <select
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                          onChange={(e) =>
                            setSelectedSupportUser(e.target.value)
                          }
                          value={selectedSupportUser}
                        >
                          <option value="">Select Support IT</option>
                          {supportUsers.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                      <Button
                        variant="primary"
                        onClick={handleAssign}
                        disabled={!selectedSupportUser}
                        className="sm:col-start-2"
                      >
                        <UserPlusIcon className="mr-2 h-5 w-5" />
                        Assign
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setIsAssignModalOpen(false)}
                        className="mt-3 sm:col-start-1 sm:mt-0"
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Resolve Dialog */}
      <Transition show={isResolveDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsResolveDialogOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500/75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 sm:mx-0 sm:h-10 sm:w-10">
                      <CheckIcon
                        className="h-6 w-6 text-emerald-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Resolve Ticket
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to mark this ticket as resolved?
                          This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <Button
                      variant="success"
                      onClick={handleResolve}
                      className="sm:ml-3"
                    >
                      <CheckIcon className="mr-2 h-5 w-5" />
                      Resolve Ticket
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setIsResolveDialogOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* History Drawer */}
      <Transition show={isHistoryDrawerOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsHistoryDrawerOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500/75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-lg font-medium text-gray-900">
                            Ticket History
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                              onClick={() => setIsHistoryDrawerOpen(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3 rounded-lg bg-emerald-50 p-4">
                            <DocumentTextIcon className="h-6 w-6 text-emerald-600" />
                            <div>
                              <h4 className="font-medium text-gray-900">
                                Ticket Created
                              </h4>
                              <p className="text-sm text-gray-600">
                                {toUTCDateString(ticket.created_at)} by{" "}
                                {ticket.creator?.name}
                              </p>
                            </div>
                          </div>

                          {ticket.status !== "opened" && (
                            <div className="flex items-start space-x-3 rounded-lg bg-amber-50 p-4">
                              <ClockIcon className="h-6 w-6 text-amber-600" />
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  Ticket Reserved
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {ticket.reserved_at
                                    ? toUTCDateString(ticket.reserved_at)
                                    : "Date not recorded"}
                                  {ticket.support_it
                                    ? ` by ${ticket.support_it.name}`
                                    : ""}
                                </p>
                              </div>
                            </div>
                          )}

                          {(ticket.status === "resolved" ||
                            ticket.status === "closed") && (
                            <div className="flex items-start space-x-3 rounded-lg bg-blue-50 p-4">
                              <CheckCircleIcon className="h-6 w-6 text-blue-600" />
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  Ticket Resolved
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {ticket.resolved_at
                                    ? toUTCDateString(ticket.resolved_at)
                                    : "Date not recorded"}
                                  {ticket.resolved_by
                                    ? ` by Support Staff`
                                    : ""}
                                </p>
                              </div>
                            </div>
                          )}

                          {ticket.status === "closed" && (
                            <div className="flex items-start space-x-3 rounded-lg bg-red-50 p-4">
                              <XCircleIcon className="h-6 w-6 text-red-600" />
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  Ticket Closed
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {ticket.closed_at
                                    ? toUTCDateString(ticket.closed_at)
                                    : "Date not recorded"}
                                  {ticket.closed_by
                                    ? ` by ${
                                        ticket.closed_by === ticket.created_by
                                          ? "Creator"
                                          : "Support Staff"
                                      }`
                                    : ""}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                        <div className="flex justify-end space-x-3">
                          <Button
                            variant="secondary"
                            onClick={() => setIsHistoryDrawerOpen(false)}
                          >
                            Close
                          </Button>
                          <Button variant="primary" onClick={handlePrint}>
                            <PrinterIcon className="mr-2 h-5 w-5" />
                            Print History
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Confirmation Dialogs */}
      <Transition show={isCloseDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsCloseDialogOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500/75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Close Ticket
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to close this ticket? This
                          action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <Button
                      variant="danger"
                      onClick={handleCloseTicket}
                      className="sm:ml-3"
                    >
                      Close Ticket
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setIsCloseDialogOpen(false)}
                      className="mt-3 sm:mt-0"
                    >
                      Cancel
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default TicketView;
