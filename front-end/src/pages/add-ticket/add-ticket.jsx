"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Remove this line:
// import { useToast } from "@/components/ui/use-toast"

// Add this line:
import { useToast } from "@chakra-ui/react";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import Header from "../header/header";
import {
  FileUp,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  PlusCircle,
  FileText,
  X,
} from "lucide-react";

// File preview component
const FilePreview = ({ file, onRemove }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!file) return;

    // Create preview for image files
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  const getFileIcon = () => {
    if (file.type.startsWith("image/")) {
      return preview ? (
        <img
          src={preview || "/placeholder.svg"}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />
      ) : (
        <FileText className="h-8 w-8 text-blue-500" />
      );
    }

    if (file.type.includes("pdf")) {
      return <FileText className="h-8 w-8 text-red-500" />;
    }

    if (file.type.includes("word") || file.type.includes("doc")) {
      return <FileText className="h-8 w-8 text-blue-600" />;
    }

    if (
      file.type.includes("excel") ||
      file.type.includes("sheet") ||
      file.type.includes("csv")
    ) {
      return <FileText className="h-8 w-8 text-green-600" />;
    }

    return <FileText className="h-8 w-8 text-gray-500" />;
  };

  return (
    <div className="relative flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md bg-white">
        {getFileIcon()}
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="truncate text-sm font-medium">{file.name}</p>
        <p className="text-xs text-gray-500">
          {(file.size / 1024).toFixed(1)} KB
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-6 w-6 rounded-full hover:bg-gray-200"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Remove file</span>
      </Button>
    </div>
  );
};

FilePreview.propTypes = {
  file: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export const NewTicket = () => {
  const [formData, setFormData] = useState({
    title: "",
    problem_id: "",
    description: "",
    status: "published",
    attachement: null,
  });

  const navigate = useNavigate();
  // Replace this line:
  // const { toast } = useToast()

  // With this line:
  const toast = useToast();

  const [problems, setProblems] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const storedClientID = localStorage.getItem("id");
    if (storedClientID) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        clientID: storedClientID,
      }));
    }
  }, []);

  // Fetch problems from API when component mounts
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/problems/getProblems"
        );
        setProblems(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching problems:", error);

        toast({
          title: "Error fetching problems",
          description:
            "Failed to load problem categories. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        setLoading(false);
      }
    };

    fetchProblems();
  }, [toast]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSelectChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      problem_id: value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prevData) => ({
        ...prevData,
        attachement: e.target.files[0],
      }));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData((prevData) => ({
        ...prevData,
        attachement: e.dataTransfer.files[0],
      }));
    }
  };

  const removeFile = () => {
    setFormData((prevData) => ({
      ...prevData,
      attachement: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setUploadProgress(0);

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("problem_id", formData.problem_id);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("clientID", formData.clientID);

    if (formData.attachement) {
      formDataToSend.append("attachement", formData.attachement);
    }

    try {
      const token = localStorage.getItem("accessToken");

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + Math.random() * 15;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/tickets",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      toast({
        title: "Ticket Created Successfully",
        description:
          "Your ticket has been submitted and will be reviewed shortly.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
        icon: <CheckCircle2 className="h-5 w-5" />,
      });

      // Reset form
      setFormData({
        title: "",
        problem_id: "",
        description: "",
        status: "published",
        attachement: null,
      });

      // Delay navigation to show success state
      setTimeout(() => {
        navigate("/tickets/ticketlist");
      }, 1000);
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast({
        title: "Failed to Create Ticket",
        description:
          "There was an error submitting your ticket. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
        icon: <AlertCircle className="h-5 w-5" />,
      });
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <>
      <Header
        name="Mezrioui Hakim"
        greeting="Have a nice day"
        role="super-admin"
        profile="https://img.freepik.com/photos-premium/photo-profil-vecteur-plat-homme-elegant-generee-par-ai_606187-310.jpg"
      />

      <div className="mx-auto max-w-3xl px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 inline-flex items-center gap-1 text-gray-600 hover:text-gray-900"
          onClick={() => navigate("/tickets/ticketlist")}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Tickets
        </Button>

        <Card className="overflow-hidden border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 pb-8 pt-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">
                  Create New Ticket
                </CardTitle>
                <CardDescription className="mt-1 text-green-100">
                  Submit a new support request
                </CardDescription>
              </div>
              <div className="rounded-full bg-white/20 p-3">
                <PlusCircle className="h-6 w-6" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative -mt-6 space-y-6 rounded-t-xl bg-white px-6 pt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Ticket Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter a descriptive title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="problem" className="text-sm font-medium">
                    Problem Category <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.problem_id}
                    onValueChange={handleSelectChange}
                    disabled={loading}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue
                        placeholder={
                          loading
                            ? "Loading problems..."
                            : "Select a problem category"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(problems).map((type) => (
                        <SelectGroup key={type}>
                          <SelectLabel>{type}</SelectLabel>
                          {problems[type].map((problem) => (
                            <SelectItem
                              key={problem.id}
                              value={problem.id.toString()}
                            >
                              {problem.name}{" "}
                              {problem.specification
                                ? `- ${problem.specification}`
                                : ""}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Please provide detailed information about your issue"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="min-h-[120px] resize-y border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file" className="text-sm font-medium">
                    Attachment (Optional)
                  </Label>
                  <div
                    className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
                      dragActive
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      id="file"
                      type="file"
                      name="attachement"
                      onChange={handleFileChange}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                    <div className="flex flex-col items-center justify-center text-center">
                      <FileUp className="mb-2 h-8 w-8 text-gray-400" />
                      <p className="mb-1 text-sm font-medium text-gray-700">
                        Drag and drop your file here or click to browse
                      </p>
                      <p className="text-xs text-gray-500">
                        Supports images, documents, and PDFs up to 10MB
                      </p>
                    </div>
                  </div>

                  {formData.attachement && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3"
                    >
                      <FilePreview
                        file={formData.attachement}
                        onRemove={removeFile}
                      />
                    </motion.div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/tickets/ticketlist")}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Create Ticket"
                  )}
                </Button>
              </div>

              {submitting && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2"
                >
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="mt-1 text-right text-xs text-gray-500">
                    {uploadProgress < 100 ? "Uploading..." : "Complete!"}
                  </p>
                </motion.div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
