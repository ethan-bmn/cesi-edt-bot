import puppeteer from 'puppeteer'
import type { CacheType, ChatInputCommandInteraction } from 'discord.js'
import type ScheduleEntry from './utils/ScheduleEntry.ts'
import { formatSchedule } from './formatSchedule.ts'

const ENT_EMAIL = process.env.ENT_EMAIL || 'not set'
const ENT_PASSWORD = process.env.ENT_PASSWORD || 'not set'
const ENT_URL = process.env.ENT_URL || 'not set'
const CHROMIUM_PATH = process.env.PUPPETEER_EXECUTABLE_PATH || 'not set'

export async function takeScreenshot(interaction: ChatInputCommandInteraction<CacheType>) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: CHROMIUM_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()

  await page.goto(ENT_URL)

  await page.setViewport({ width: 1920, height: 1080 })
  await page.locator('#login').fill(ENT_EMAIL)
  await page.locator('.submit').click()

  await page.locator('#passwordInput').fill(ENT_PASSWORD)
  await page.locator('#submitButton').click()

  const finalResponse = await page.waitForResponse(response =>
    response.url().includes('/api/seance/all')
  )
  const responseJson = await finalResponse.json() as ScheduleEntry[]

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
  const tableData: string[][] = [[], []]
  days.forEach((_item, index) => {
    const entry = responseJson[index]
    if (!entry || !tableData[0] || !tableData[1]) {
      console.error('What the fuck?')
      return
    }
    tableData[0].push(`${entry.salles[0]?.nomSalle || 'Salle inconnue'} - ${entry.intervenants[0]?.prenom || 'Intervenant'} ${entry.intervenants[0]?.nom || 'Inconnu'}`)
    tableData[1].push(entry.title)
  })

  return interaction.editReply(formatSchedule(days, tableData))
  // await interaction.editReply({
  //   files: [Buffer.from(screenshot)]
  // })
}