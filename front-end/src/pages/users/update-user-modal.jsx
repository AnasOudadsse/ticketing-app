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
  UserCog,
  Briefcase,
  Building,
  MapPin,
  CheckCircle2,
  Save,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function UpdateUserModal({ isOpen, onClose, userId, onSuccess }) {
  const { sendRequest, loading } = useHttp()
  const [user, setUser] = useState({})
  const [specialisationIds, setSpecialisationIds] = useState([])
  const [errors, setErrors] = useState({})
  const toast = useToast()
  const [info, setInfo] = useState({
    fonctions: [],
    departements: [],
    localisations: [],
    specialisations: [],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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

  // Fetch user data
  useEffect(() => {
    if (!isOpen || !userId) return

    setIsLoading(true)
    const token = localStorage.getItem("accessToken")
    const request = {
      url: `http://127.0.0.1:8000/api/user/${userId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }

    sendRequest(request, (dataRec) => {
      setUser(dataRec)
      const sps = dataRec.specialisations || []
      setSpecialisationIds(sps.map((specialisation) => specialisation.id))
      setIsLoading(false)
    })
  }, [isOpen, userId])

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
    }

    return error
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setUser({
      ...user,
      [name]: value,
    })

    // Validate field
    const error = validateField(name, value)
    setErrors({ ...errors, [name]: error })
  }

  const handleSelectChange = (name, value) => {
    setUser({
      ...user,
      [name]: value,
    })
  }

  const handleSpecialisationChange = (id, checked) => {
    if (checked) {
      setSpecialisationIds((prev) => [...prev, id])
    } else {
      setSpecialisationIds((prev) => prev.filter((specId) => specId !== id))
    }
  }

  // Update specialisations in user object when specialisationIds changes
  useEffect(() => {
    setUser((prev) => ({
      ...prev,
      specialisation_ids: specialisationIds,
    }))
  }, [specialisationIds])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate all fields
    const newErrors = {}
    let hasErrors = false

    for (const [key, value] of Object.entries({
      name: user.name,
      email: user.email,
    })) {
      const error = validateField(key, value)
      if (error) {
        newErrors[key] = error
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
      url: `http://127.0.0.1:8000/api/users/${userId}`,
      method: "PUT",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }

    sendRequest(request, (response) => {
      setIsSubmitting(false)

      if (response.status === 200) {
        toast({
          title: "Success",
          description: response.message || "User updated successfully",
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
          description: response.message || "Failed to update user",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        })
      }
    })
  }

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Get role badge style
  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "supportIt":
        return "bg-green-100 text-green-800 border-green-200"
      case "client":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update User" size="lg">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
          <p className="text-gray-500">Loading user data...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User header with avatar */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <Avatar className="h-16 w-16 border-2 border-white shadow-md">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">{user.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500">{user.email}</span>
                {user.role && <Badge className={`${getRoleBadgeStyle(user.role)} ml-2`}>{user.role}</Badge>}
              </div>
            </div>
          </div>

          {Object.values(errors).some((error) => error) && (
            <Alert variant="destructive" className="animate-pulse">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Please fix the errors in the form before submitting.</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-500" />
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={user.name || ""}
                  onChange={handleChange}
                  className={`h-11 transition-all duration-200 ${errors.name ? "border-red-500 bg-red-50" : "focus:border-blue-500 focus:ring-blue-500"}`}
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

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-500" />
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={user.email || ""}
                  onChange={handleChange}
                  className={`h-11 transition-all duration-200 ${errors.email ? "border-red-500 bg-red-50" : "focus:border-blue-500 focus:ring-blue-500"}`}
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

              <div className="space-y-2">
                <Label htmlFor="role" className="flex items-center gap-2">
                  <UserCog className="h-4 w-4 text-blue-500" />
                  Role
                </Label>
                <Select value={user.role || ""} onValueChange={(value) => handleSelectChange("role", value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select a role" />
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
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="departement" className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-blue-500" />
                  Department
                </Label>
                <Select
                  value={user.departement_id?.toString() || ""}
                  onValueChange={(value) => handleSelectChange("departement_id", value)}
                >
                  <SelectTrigger className="h-11">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="localisation" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  Location
                </Label>
                <Select
                  value={user.localisation_id?.toString() || ""}
                  onValueChange={(value) => handleSelectChange("localisation_id", value)}
                >
                  <SelectTrigger className="h-11">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="fonction" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-blue-500" />
                  Function
                </Label>
                <Select
                  value={user.fonction_id?.toString() || ""}
                  onValueChange={(value) => handleSelectChange("fonction_id", value)}
                >
                  <SelectTrigger className="h-11">
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
              </div>
            </motion.div>
          </div>

          {user.role === "supportIt" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 overflow-hidden"
            >
              <Label className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-500" />
                Specialisations
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 border rounded-md p-4 bg-gray-50">
                {info.specialisations.map((specialisation) => (
                  <div
                    key={specialisation.id}
                    className="flex items-center space-x-2 bg-white p-2 rounded-md border shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Checkbox
                      id={`spec-${specialisation.id}`}
                      checked={specialisationIds.includes(specialisation.id)}
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

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
