import { REST, Routes, Client, Events, GatewayIntentBits } from 'discord.js'
import { takeScreenshot } from './entManager.ts'

const TOKEN = process.env.DISCORD_TOKEN || 'not set'
const CLIENT_ID = process.env.DISCORD_CLIENT_ID || 'not set'

const preAnswers = [
  'Ça arrive...',
  'Donne moi deux petites secondes.',
  'Je tourne sur un i5, soyez patients !',
  'Change pas de main, je sens que ça vient !',
  'Je finis ma clope, j\'arrive',
  'Très bien — je t\'envoie ton emploi du temps ! (tokens expirés, veuillez améliorer votre abonnement ou attendez 5h24m)'
]

async function main() {

  const commands = [
    {
      name: 'edt',
      description: 'Envoie l\'emploi du temps de la semaine en cours',
    },
  ]

  const rest = new REST({ version: '10' }).setToken(TOKEN)

  try {
    console.log('Started refreshing application (/) commands.')

    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands })

    console.log('Successfully reloaded application (/) commands.')
  } catch (error) {
    console.error(error)
  }


  const client = new Client({ intents: [GatewayIntentBits.Guilds] })

  client.on(Events.ClientReady, readyClient => {
    console.log(`Logged in as ${readyClient.user.tag}!`)
  })

  client.on(Events.InteractionCreate, async interaction => {
    console.log(interaction)
    if (!interaction.isChatInputCommand()) return

    if (interaction.commandName === 'edt') {
      const preAnswer = preAnswers[Math.floor(Math.random() * preAnswers.length)]
      if (preAnswer === undefined) {
        console.error('Something went REALLY wrong here.')
        return
      }
      await interaction.reply(`${preAnswer} \n https://paypal.me/ethanbmn0605`)
      await takeScreenshot(interaction)
    }
  })

  await client.login(TOKEN)
}

await main()