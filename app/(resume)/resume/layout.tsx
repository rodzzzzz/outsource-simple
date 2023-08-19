interface ResumeProps {
  children?: React.ReactNode
}

export default function ResumeLayout({ children }: ResumeProps) {
  return (
    <div className="grid items-start max-w-6xl gap-10 px-8 py-8 mx-auto">
      {children}
    </div>
  )
}
