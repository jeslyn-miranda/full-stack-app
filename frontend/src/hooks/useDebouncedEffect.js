import { useEffect } from 'react'

export function useDebouncedEffect(fn, deps, delay = 1000) {
  useEffect(() => {
    const h = setTimeout(fn, delay)
    return () => clearTimeout(h)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
