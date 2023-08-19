import { useEffect, useState } from "react"

const useDebounceEffect = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line
  }, [value])

  return debouncedValue
}

export default useDebounceEffect
