function random(
  length: number,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890',
): string {
  if (length <= 0) {
    return ''
  }

  if (!characters || characters.length === 0) {
    throw new Error('The characters string cannot be empty')
  }

  // More efficient version using Array.from
  return Array.from({ length }, () => {
    const randomIndex = Math.floor(Math.random() * characters.length)
    return characters[randomIndex]
  }).join('')
}

random.ALPHANUMERIC =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
random.ALPHABETIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
random.ALPHANUMERIC_LOW = 'abcdefghijklmnopqrstuvwxyz1234567890'
random.ALPHABETIC_LOW = 'abcdefghijklmnopqrstuvwxyz'

export { random }
