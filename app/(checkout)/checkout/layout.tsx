interface CheckoutProps {
  children?: React.ReactNode
}

export default function CheckoutLayout({ children }: CheckoutProps) {
  return (
    <div className="grid items-start max-w-6xl gap-10 px-8 mx-auto">
      {children}
    </div>
  )
}
