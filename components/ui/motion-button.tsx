'use client'

import { FC } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: unknown[]) { return twMerge(clsx(inputs)) }

interface Props {
  label: string
  variant?: 'primary' | 'secondary'
  classes?: string
  animate?: boolean
  delay?: number
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
}

const MotionButton: FC<Props> = ({ label, variant = 'primary', classes, onClick, type = 'button', disabled }) => {
  const isPrimary = variant !== 'secondary'
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-full px-7 py-3 text-[15px] font-semibold tracking-tight transition-opacity hover:opacity-80 active:scale-[0.97] duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
        isPrimary
          ? 'bg-[#111111] text-white'
          : 'bg-white text-[#111111] border border-[#111111]',
        classes
      )}
    >
      {label}
    </button>
  )
}

export default MotionButton
