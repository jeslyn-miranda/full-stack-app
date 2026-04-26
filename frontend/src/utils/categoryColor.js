const PALETTE = [
  '#d6bfa9', // beige (accent)
  '#a0c4ff', // soft blue
  '#ffd6a5', // apricot
  '#c7e9b0', // mint
  '#d6c2fb', // lavender
  '#f4bfc6', // rose
  '#bfeaea', // aqua
]

function hash(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

export function categoryColor(name) {
  if (!name) return 'var(--text-light)'
  return PALETTE[hash(name) % PALETTE.length]
}
