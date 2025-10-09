"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { CheckCircle2 } from "lucide-react"

interface OnboardingSuccessCelebrationProps {
  userName?: string
  message?: string
  subMessage?: string
}

export function OnboardingSuccessCelebration({
  userName,
  message = "You're All Set!",
  subMessage = "Welcome to Vendora — redirecting you to your dashboard",
}: OnboardingSuccessCelebrationProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number; duration: number }>>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Generate confetti particles
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 1,
    }))
    setParticles(newParticles)
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
      {/* Confetti Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute top-0 w-2 h-2 rounded-full animate-confetti"
          style={
            {
              left: `${particle.x}%`,
              "--delay": `${particle.delay}s`,
              "--duration": `${particle.duration}s`,
              background: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"][Math.floor(Math.random() * 5)],
            } as React.CSSProperties
          }
        />
      ))}

      {/* Glassmorphic Success Card */}
      <div className="relative bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl px-12 py-14 text-center max-w-md mx-4 animate-in zoom-in slide-in-from-bottom-4 duration-500">
        {/* Animated Success Icon */}
        <div className="relative mx-auto mb-6 h-24 w-24">
          {/* Outer ring animation */}
          <div className="absolute inset-0 rounded-full bg-green-100/50 animate-ping" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 animate-in zoom-in duration-700" />

          {/* Checkmark with draw animation */}
          <div className="relative h-full w-full flex items-center justify-center animate-in zoom-in duration-500 delay-200">
            <CheckCircle2 className="h-16 w-16 text-green-600 animate-draw-check" />
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-3">
          <h3 className="font-serif text-3xl font-bold text-gray-900 animate-in slide-in-from-bottom-2 duration-500 delay-300">
            {message}
          </h3>

          {userName && (
            <p className="text-lg font-medium text-gray-700 animate-in slide-in-from-bottom-2 duration-500 delay-400">
              Welcome, {userName}!
            </p>
          )}

          <p className="text-sm text-gray-600 animate-in slide-in-from-bottom-2 duration-500 delay-500">{subMessage}</p>
        </div>

        {/* Loading dots */}
        <div className="flex justify-center gap-1.5 mt-6 animate-in fade-in duration-500 delay-700">
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
        </div>

        {/* Decorative gradient glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-green-400/20 via-blue-400/20 to-purple-400/20 rounded-2xl blur-xl -z-10 animate-pulse" />
      </div>

      <style jsx>{`
				@keyframes confetti {
					0% {
						transform: translateY(0) rotate(0deg);
						opacity: 1;
					}
					100% {
						transform: translateY(100vh) rotate(720deg);
						opacity: 0;
					}
				}

				@keyframes draw-check {
					0% {
						stroke-dasharray: 0 100;
						opacity: 0;
						transform: scale(0.8);
					}
					50% {
						opacity: 1;
					}
					100% {
						stroke-dasharray: 100 100;
						opacity: 1;
						transform: scale(1);
					}
				}

				.animate-confetti {
					animation: confetti var(--duration, 2s) ease-in var(--delay, 0s)
						forwards;
				}

				.animate-draw-check {
					animation: draw-check 0.8s ease-out forwards;
				}
			`}</style>
    </div>,
    document.body
  )
}
