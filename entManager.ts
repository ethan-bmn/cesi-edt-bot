import puppeteer from 'puppeteer'
import type { CacheType, ChatInputCommandInteraction } from 'discord.js'

const ENT_EMAIL = process.env.ENT_EMAIL || 'not set'
const ENT_PASSWORD = process.env.ENT_PASSWORD || 'not set'
const ENT_URL = process.env.ENT_URL || 'not set'

export async function takeScreenshot(interaction: ChatInputCommandInteraction<CacheType>) {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  await page.goto(ENT_URL)

  await page.setViewport({ width: 1920, height: 1080 })
  await page.locator('#login').fill(ENT_EMAIL)
  await page.locator('.submit').click()

  await page.locator('#passwordInput').fill(ENT_PASSWORD)
  await page.locator('#submitButton').click()

  await page.locator('.orejime-Button').click()

  const fileElement = await page.waitForSelector('#sans_encadres')

  if (!fileElement) {
    console.error('Could not find schedule')
    return
  }

  const screenshot = (await fileElement.screenshot({
    path: 'edt.png',
  }))

  await interaction.editReply({
    files: [Buffer.from(screenshot)]
  })

}