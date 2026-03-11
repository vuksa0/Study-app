import { Loader } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SpinnerProps {
  size?: string
  color?: string
}

interface SizeProps {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
}

interface FillProps {
  slate: string
  blue: string
  red: string
  green: string
  white: string
}

interface StrokeProps {
  slate: string
  blue: string
  red: string
  green: string
  white: string
}

const sizesClasses: SizeProps = {
  xs: "w-4 h-4",
  sm: "w-5 h-5",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-10 h-10",
}

const fillClasses = {
  slate: "fill-foreground",
  blue: "fill-blue-500",
  red: "fill-red-500",
  green: "fill-emerald-500",
  white: "fill-background",
} as FillProps

const strokeClasses = {
  slate: "stroke-foreground",
  blue: "stroke-blue-500",
  red: "stroke-red-500",
  green: "stroke-emerald-500",
  white: "stroke-background",
} as StrokeProps

export const Spinner = ({ size = "md", color = "slate" }: SpinnerProps) => {
  return (
    <div aria-label="Loading..." role="status">
      <Loader
        className={cn(
          "animate-spin",
          sizesClasses[size as keyof SizeProps],
          strokeClasses[color as keyof StrokeProps],
        )}
      />
    </div>
  )
}

export const RoundSpinner = ({ size = "md", color = "slate" }: SpinnerProps) => {
  return (
    <div aria-label="Loading..." role="status">
      <svg
        className={cn(
          "animate-spin",
          sizesClasses[size as keyof SizeProps],
          fillClasses[color as keyof FillProps],
        )}
        viewBox="3 3 18 18"
      >
        <path
          className="opacity-20"
          d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
        ></path>
        <path d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"></path>
      </svg>
    </div>
  )
}

export const Dots_v3 = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="size-3.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]"></div>
      <div className="size-3.5 animate-bounce rounded-full bg-current [animation-delay:-0.13s]"></div>
      <div className="size-3.5 animate-bounce rounded-full bg-current"></div>
    </div>
  )
}

export const Dots_v2 = () => (
  <div className="flex items-center justify-center">
    <div className="flex space-x-2">
      <motion.div
        className="size-3.5 rounded-full bg-current"
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.1, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        className="size-3.5 rounded-full bg-current"
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.1, ease: "easeInOut", repeat: Infinity, delay: 0.3 }}
      />
      <motion.div
        className="size-3.5 rounded-full bg-current"
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.1, ease: "easeInOut", repeat: Infinity, delay: 0.6 }}
      />
    </div>
  </div>
)
