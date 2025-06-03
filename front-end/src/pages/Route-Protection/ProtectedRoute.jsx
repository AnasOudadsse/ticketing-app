"use client"

import { useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"
import axios from "axios"
import { LoadingScreen } from "@/components/ui/loading-screen"

export const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken")

      if (!token) {
        setIsAuthenticated(false)
        return
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.status === 200) {
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error("Authentication check failed:", error)
        setIsAuthenticated(false)
      }
    }

    checkAuth()
  }, [])

  if (isAuthenticated === null) {
    return <LoadingScreen message="Authenticating" /> // Modern loading screen
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}
