interface JobProps {
  children?: React.ReactNode
}

export default function JobLayout({ children }: JobProps) {
  return (
    <div className="grid items-start max-w-6xl gap-10 p-8 mx-auto">
      {children}
    </div>
  )
}
