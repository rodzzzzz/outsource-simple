interface ResumeProps {
  children?: React.ReactNode
}

export default function ResumeLayout({ children }: ResumeProps) {
  return (
    <div className="mx-auto grid max-w-6xl items-start gap-10 p-8">
      {children}
    </div>
  )
}
