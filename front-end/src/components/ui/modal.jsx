"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

const modalVariants = cva(
  "relative z-50 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 overflow-hidden max-h-[85vh] overflow-y-auto",
  {
    variants: {
      size: {
        default: "w-full max-w-lg",
        sm: "w-full max-w-sm",
        lg: "w-full max-w-2xl",
        xl: "w-full max-w-4xl",
        full: "w-full h-full rounded-none",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
)

export function Modal({
  children,
  isOpen,
  onClose,
  title,
  size = "default",
  className,
  closeOnOutsideClick = true,
  showCloseButton = true,
  ...props
}) {
  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  // Handle outside click
  const handleOutsideClick = (e) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleOutsideClick}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            className={cn(modalVariants({ size }), className)}
            role="dialog"
            aria-modal="true"
            {...props}
          >
            {(title || showCloseButton) && (
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 pb-0 bg-white dark:bg-gray-800">
                {title && (
                  <motion.h2
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl font-semibold"
                  >
                    {title}
                  </motion.h2>
                )}
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8 rounded-full transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                )}
              </div>
            )}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
