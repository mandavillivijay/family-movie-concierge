import type { ReactNode } from 'react'
import { BackButton } from './BackButton'
import { ProgressDots } from './ProgressDots'

interface WizardLayoutProps {
  title: string
  subtitle?: string
  step: number
  totalSteps: number
  onBack?: () => void
  children: ReactNode
  footer?: ReactNode
}

export function WizardLayout({ title, subtitle, step, totalSteps, onBack, children, footer }: WizardLayoutProps) {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-col px-5 pb-6 pt-3">
      <div className="mb-2 flex items-center gap-2">
        <div className="w-11">{onBack ? <BackButton onClick={onBack} /> : null}</div>
        <div className="flex-1">
          <ProgressDots total={totalSteps} current={step} />
        </div>
        <div className="w-11" />
      </div>

      <div className="mt-4 mb-6 text-center">
        <h1 className="text-2xl font-semibold text-slate-50">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
      </div>

      <div className="flex-1">{children}</div>

      {footer ? <div className="mt-6">{footer}</div> : null}
    </div>
  )
}
