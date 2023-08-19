interface CheckoutProps {
  children?: React.ReactNode
}

export default function CheckoutLayout({ children }: CheckoutProps) {
  return (
    <div className="mx-auto grid max-w-6xl items-start gap-10 px-8">
      {children}
    </div>
  )
}
