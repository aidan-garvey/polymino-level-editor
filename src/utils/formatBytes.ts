/**
 * Format the given number of bytes, converting to KB, MB or GB if the value is
 * large enough.
 * If the converted value is >= 100, it will be displayed as an integer.
 * Otherwise, fractional digits will be included to bring the total number of
 * digits up to 3.
 */
export const formatBytes = (bytes: number) => {
  let suffix = 'B'
  let amount = bytes
  if (amount >= 1024) {
    suffix = 'KB'
    amount /= 1024
  }
  if (amount >= 1024) {
    suffix = 'MB'
    amount /= 1024
  }
  if (amount >= 1024) {
    suffix = 'GB'
    amount /= 1024
  }

  // Use 3 digits (unless it's >= 1000 and < 1024, then allow 4)
  let amountStr = Math.floor(amount).toString()
  if (amount < 10) {
    amountStr = amount.toFixed(2)
  } else if (amount < 100) {
    amountStr = amount.toFixed(1)
  }

  return `${amountStr} ${suffix}`
}
