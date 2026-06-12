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
    let morningRoom = null
    let teachers= null
    let afternoonRoom = null

    let halfDay = false

    for (const entry of responseJson) {
      if (!halfDay) {
        morningRoom = entry.salles[0]?.nomSalle || 'Salle inconnue'
        if (entry.intervenants.length === 0) {
          teachers = 'Intervenant inconnu'
        } else {
          teachers = entry.intervenants.map(i => `${i.prenom} ${i.nom}`).join(', ')
        }
      } else {
        afternoonRoom = entry.salles[0]?.nomSalle || 'Salle inconnue'
      }
      halfDay = !halfDay
      if (!halfDay) {
        if (!entry || !tableData[0] || !tableData[1]) {
          console.error('What the fuck?')
          return
        }
        tableData[0].push(`${morningRoom} (Matin) / ${afternoonRoom} (Après-midi) - ${teachers}`)
        tableData[1].push(entry.title)
      }
    }

  return interaction.editReply(formatSchedule(days, tableData))


  //   console.log(halfDay, index)
  //   if (halfDay === 1) {
  //     halfDay = 0
  //     return
  //   }
  //   const entry = responseJson[index]
  //   if (!entry || !tableData[0] || !tableData[1] || halfDay > 1 || !responseJson[index + 1]) {
  //     console.error('What the fuck?')
  //     return
  //   }
  //   tableData[0].push(`${entry.salles[0]?.nomSalle || 'Salle inconnue'} (Matin) / ${responseJson[index + 1].salles[0]?.nomSalle || 'Salle inconnue'} (Après-midi)- ${entry.intervenants[0]?.prenom || 'Intervenant'} ${entry.intervenants[0]?.nom || 'Inconnu'}`)
  //   tableData[1].push(entry.title)
  //   halfDay++
  // })
  //
  // return interaction.editReply(formatSchedule(days, tableData))
  // // await interaction.editReply({
  // //   files: [Buffer.from(screenshot)]
  // // })
}