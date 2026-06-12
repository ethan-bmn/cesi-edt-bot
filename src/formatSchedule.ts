export function formatSchedule(headers: string[], rows: string[][]): string {
  const blocks: string[] = []

  for (let col = 0; col < headers.length; col++) {
    const cells = rows
      .map(row => row[col]?.trim())
      .filter(Boolean)

    if (cells.length === 0) continue

    blocks.push(`> ${headers[col]}\n**${cells[0]}**\n${cells[1]}`)
  }

  return blocks.join('\n\n')
}