"use client"

import { useEffect, useState } from "react"
import { useToast } from "@chakra-ui/react"
import useHttp from "../customHook/useHttp"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { motion } from "framer-motion"
import {
  Loader2,
  AlertCircle,
  User,
  Mail,
  Lock,
  UserCog,
  Briefcase,
  Building,
  MapPin,
  CheckCircle2,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AddUserModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({})
  const [specialisations, setSpecialisation] = useState([])
  const [errors, setErrors] = useState({})
  const { sendRequest, loading } = useHttp()
  const toast = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [info, setInfo] = useState({
    fonctions: [],
    departements: [],
    localisations: [],
    specialisations: [],
  })

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({})
      setSpecialisation([])
      setErrors({})
      setActiveTab("basic")
    }
  }, [isOpen])

  // Fetch form options
  useEffect(() => {
    if (!isOpen) return

    const request = {
      url: "http://127.0.0.1:8000/api/getinfo",
      headers: {
        "Content-Type": "Application/Json",
      },
    }

    sendRequest(request, (data) => setInfo(data))
  }, [isOpen])

  const validateField = (name, value) => {
    let error = ""

    switch (name) {
      case "name":
        if (!value || value.length < 3) {
          error = "Name must be at least 3 characters"
        }
        break
      case "email":
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!emailRegex.test(value)) {
          error = "Please enter a valid email address"
        }
        break
      case "password":
        if (!value || value.length < 8) {
          error = "Password must be at least 8 characters"
        }
        break
      case "role":
        if (!value) {
          error = "Please select a role"
        }
        break
    }

    return error
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Validate field
    const error = validateField(name, value)
    setErrors({ ...errors, [name]: error })

    // Clear specialisations if role is not supportIt
    if (name === "role" && value !== "supportIt") {
      setSpecialisation([])
    }
  }

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value })

    // Validate field
    const error = validateField(name, value)
    setErrors({ ...errors, [name]: error })
  }

  const handleSpecialisationChange = (id, checked) => {
    if (checked) {
      setSpecialisation((prev) => [...prev, id.toString()])
    } else {
      setSpecialisation((prev) => prev.filter((specId) => specId !== id.toString()))
    }
  }

  // Update specialisations in formData when specialisations changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      specialisation_ids: specialisations,
    }))
  }, [specialisations])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate all fields
    const newErrors = {}
    let hasErrors = false

    for (const [key, value] of Object.entries(formData)) {
      const error = validateField(key, value)
      if (error) {
        newErrors[key] = error
        hasErrors = true
      }
    }

    // Check required fields
    const requiredFields = ["name", "email", "password", "role", "fonction_id", "departement_id", "localisation_id"]
    for (const field of requiredFields) {
      if (!formData[field]) {
        newErrors[field] = `This field is required`
        hasErrors = true
      }
    }

    if (hasErrors) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    const token = localStorage.getItem("accessToken")

    const request = {
      url: "http://127.0.0.1:8000/api/register",
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }

    sendRequest(request, (response) => {
      setIsSubmitting(false)

      if (response && !response.error) {
        toast({
          title: "Success",
          description: "User created successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        })

        if (onSuccess) onSuccess()
        onClose()
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create user",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        })
      }
    })
  }

  // Check if we can proceed to the next tab
  const canProceedToDetails = () => {
    const requiredBasicFields = ["name", "email", "password", "role"]
    return requiredBasicFields.every((field) => formData[field] && !errors[field])
  }

  // Progress indicator
  const getProgress = () => {
    const totalFields = 7 // Total required fields
    const filledFields = Object.keys(formData).filter(
      (key) =>
        formData[key] &&
        !errors[key] &&
        ["name", "email", "password", "role", "fonction_id", "departement_id", "localisation_id"].includes(key),
    ).length

    return Math.round((filledFields / totalFields) * 100)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New User" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {Object.values(errors).some((error) => error) && (
          <Alert variant="destructive" className="animate-pulse">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Please fix the errors in the form before submitting.</AlertDescription>
          </Alert>
        )}

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4 dark:bg-gray-700">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${getProgress()}%` }}
          ></div>
        </div>

        {/* Tabs for form sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Basic Info</span>
            </TabsTrigger>
            <TabsTrigger value="details" disabled={!canProceedToDetails()} className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>Details</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-6">
          {/* Basic Info Tab */}
          {activeTab === "basic" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div className="space-y-4">
                <div className="relative">
                  <Label htmlFor="name" className="flex items-center gap-2 text-base">
                    <User className="h-4 w-4 text-blue-500" />
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    className={`pl-3 h-11 mt-2 transition-all duration-200 ${errors.name ? "border-red-500 bg-red-50" : "focus:border-blue-500 focus:ring-blue-500"}`}
                    placeholder="Enter full name"
                    required
                  />
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 mt-1 flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3" /> {errors.name}
                    </motion.p>
                  )}
                </div>

                <div className="relative">
                  <Label htmlFor="email" className="flex items-center gap-2 text-base">
                    <Mail className="h-4 w-4 text-blue-500" />
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    className={`pl-3 h-11 mt-2 transition-all duration-200 ${errors.email ? "border-red-500 bg-red-50" : "focus:border-blue-500 focus:ring-blue-500"}`}
                    placeholder="user@example.com"
                    required
                  />
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 mt-1 flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3" /> {errors.email}
                    </motion.p>
                  )}
                </div>

                <div className="relative">
                  <Label htmlFor="password" className="flex items-center gap-2 text-base">
                    <Lock className="h-4 w-4 text-blue-500" />
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password || ""}
                    onChange={handleChange}
                    className={`pl-3 h-11 mt-2 transition-all duration-200 ${errors.password ? "border-red-500 bg-red-50" : "focus:border-blue-500 focus:ring-blue-500"}`}
                    placeholder="Minimum 8 characters"
                    required
                  />
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 mt-1 flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3" /> {errors.password}
                    </motion.p>
                  )}
                </div>

                <div className="relative">
                  <Label htmlFor="role" className="flex items-center gap-2 text-base">
                    <UserCog className="h-4 w-4 text-blue-500" />
                    Role <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.role || ""} onValueChange={(value) => handleSelectChange("role", value)}>
                    <SelectTrigger
                      className={`h-11 mt-2 transition-all duration-200 ${errors.role ? "border-red-500 bg-red-50" : "focus:border-blue-500 focus:ring-blue-500"}`}
                    >
                      <SelectValue placeholder="Select user role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin" className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                          A
                        </span>
                        <span>Admin</span>
                      </SelectItem>
                      <SelectItem value="supportIt" className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700">
                          S
                        </span>
                        <span>Support IT</span>
                      </SelectItem>
                      <SelectItem value="client" className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                          C
                        </span>
                        <span>Client</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 mt-1 flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3" /> {errors.role}
                    </motion.p>
                  )}
                </div>

                {formData.role === "supportIt" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <Label className="flex items-center gap-2 text-base">
                      <CheckCircle2 className="h-4 w-4 text-blue-500" />
                      Specialisations
                    </Label>
                    <div className="grid grid-cols-2 gap-3 border rounded-md p-4 bg-gray-50">
                      {info.specialisations.map((specialisation) => (
                        <div
                          key={specialisation.id}
                          className="flex items-center space-x-2 bg-white p-2 rounded-md border shadow-sm hover:shadow-md transition-shadow"
                        >
                          <Checkbox
                            id={`spec-${specialisation.id}`}
                            checked={specialisations.includes(specialisation.id.toString())}
                            onCheckedChange={(checked) => handleSpecialisationChange(specialisation.id, checked)}
                            className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                          />
                          <Label
                            htmlFor={`spec-${specialisation.id}`}
                            className="text-sm font-normal cursor-pointer select-none flex-1"
                          >
                            {specialisation.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab("details")}
                  disabled={!canProceedToDetails()}
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white"
                >
                  Next
                </Button>
              </div>
            </motion.div>
          )}

          {/* Details Tab */}
          {activeTab === "details" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="space-y-4">
                <div className="relative">
                  <Label htmlFor="fonction_id" className="flex items-center gap-2 text-base">
                    <Briefcase className="h-4 w-4 text-blue-500" />
                    Function <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.fonction_id || ""}
                    onValueChange={(value) => handleSelectChange("fonction_id", value)}
                  >
                    <SelectTrigger
                      className={`h-11 mt-2 transition-all duration-200 ${errors.fonction_id ? "border-red-500 bg-red-50" : "focus:border-blue-500 focus:ring-blue-500"}`}
                    >
                      <SelectValue placeholder="Select a function" />
                    </SelectTrigger>
                    <SelectContent>
                      {info.fonctions.map((fonction) => (
                        <SelectItem key={fonction.id} value={fonction.id.toString()}>
                          {fonction.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.fonction_id && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 mt-1 flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3" /> {errors.fonction_id}
                    </motion.p>
                  )}
                </div>

                <div className="relative">
                  <Label htmlFor="departement_id" className="flex items-center gap-2 text-base">
                    <Building className="h-4 w-4 text-blue-500" />
                    Department <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.departement_id || ""}
                    onValueChange={(value) => handleSelectChange("departement_id", value)}
                  >
                    <SelectTrigger
                      className={`h-11 mt-2 transition-all duration-200 ${errors.departement_id ? "border-red-500 bg-red-50" : "focus:border-blue-500 focus:ring-blue-500"}`}
                    >
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                      {info.departements.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id.toString()}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.departement_id && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 mt-1 flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3" /> {errors.departement_id}
                    </motion.p>
                  )}
                </div>

                <div className="relative">
                  <Label htmlFor="localisation_id" className="flex items-center gap-2 text-base">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.localisation_id || ""}
                    onValueChange={(value) => handleSelectChange("localisation_id", value)}
                  >
                    <SelectTrigger
                      className={`h-11 mt-2 transition-all duration-200 ${errors.localisation_id ? "border-red-500 bg-red-50" : "focus:border-blue-500 focus:ring-blue-500"}`}
                    >
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      {info.localisations.map((loc) => (
                        <SelectItem key={loc.id} value={loc.id.toString()}>
                          {loc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.localisation_id && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 mt-1 flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3" /> {errors.localisation_id}
                    </motion.p>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={() => setActiveTab("basic")}>
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create User"
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </form>
    </Modal>
  )
}
