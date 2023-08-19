interface EditorProps {
  children?: React.ReactNode
}

export default function EditorLayout({ children }: EditorProps) {
  return (
    <div className="mx-auto grid max-w-6xl items-start gap-10 p-8">
      {children}
    </div>
  )
}
