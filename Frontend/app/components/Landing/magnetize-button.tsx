// @ts-nocheck
"use client"

import * as React from "react"
import { motion, useAnimation } from "framer-motion"
import { Magnet } from "lucide-react"
import { useEffect, useState, useCallback } from "react"

// Utility function to merge classnames
function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Button Component
const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }: any, ref: any) => {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  
  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  }
  
  const sizeStyles = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  }
  
  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant] || variantStyles.default,
        sizeStyles[size] || sizeStyles.default,
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

// MagnetizeButton Component
function MagnetizeButton({
  className,
  particleCount = 12,
  attractRadius = 50,
  children,
  ...props
}) {
  const [isAttracting, setIsAttracting] = useState(false)
  const [particles, setParticles] = useState([])
  const particlesControl = useAnimation()

  useEffect(() => {
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 360 - 180,
      y: Math.random() * 360 - 180,
    }))
    setParticles(newParticles)
  }, [particleCount])

  const handleInteractionStart = useCallback(async () => {
    setIsAttracting(true)
    await particlesControl.start({
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 10,
      },
    })
  }, [particlesControl])

  const handleInteractionEnd = useCallback(async () => {
    setIsAttracting(false)
    await particlesControl.start((i) => ({
      x: particles[i].x,
      y: particles[i].y,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    }))
  }, [particlesControl, particles])

  return (
    <Button
      className={cn(
        "min-w-40 relative touch-none",
        "bg-violet-100 dark:bg-violet-900",
        "hover:bg-violet-200 dark:hover:bg-violet-800",
        "text-violet-600 dark:text-violet-300",
        "border border-violet-300 dark:border-violet-700",
        "transition-all duration-300",
        className
      )}
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      {...props}
    >
      {particles.map((_, index) => (
        <motion.div
          key={index}
          custom={index}
          initial={{ x: particles[index].x, y: particles[index].y }}
          animate={particlesControl}
          className={cn(
            "absolute w-1.5 h-1.5 rounded-full",
            "bg-violet-400 dark:bg-violet-300",
            "transition-opacity duration-300",
            isAttracting ? "opacity-100" : "opacity-40"
          )}
        />
      ))}
      <span className="relative w-full flex items-center justify-center gap-2">
        <Magnet
          className={cn(
            "w-4 h-4 transition-transform duration-300",
            isAttracting && "scale-110"
          )}
        />
        {children || (isAttracting ? "Attracting" : "Hover me")}
      </span>
    </Button>
  )
}

// Demo Component
function MagnetizeButtonDemo() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <h2 className="text-2xl font-bold mb-4">Magnetize Button Demo</h2>
      
      {/* Default */}
      <div className="flex gap-4 items-center">
        <span className="w-32 text-sm">Default:</span>
        <MagnetizeButton particleCount={14} attractRadius={50} />
      </div>
      
      {/* Custom particle count */}
      <div className="flex gap-4 items-center">
        <span className="w-32 text-sm">More particles:</span>
        <MagnetizeButton particleCount={20} attractRadius={50}>
          Get Started
        </MagnetizeButton>
      </div>
      
      {/* Custom styling */}
      <div className="flex gap-4 items-center">
        <span className="w-32 text-sm">Custom colors:</span>
        <MagnetizeButton 
          particleCount={16}
          className="bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-300 border-blue-300 dark:border-blue-700"
        >
          Launch
        </MagnetizeButton>
      </div>
    </div>
  )
}

export default MagnetizeButton;
