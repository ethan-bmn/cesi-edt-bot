import { REST, Routes, Client, Events, GatewayIntentBits } from 'discord.js'

const TOKEN = process.env.DISCORD_TOKEN || 'not set'
const CLIENT_ID = process.env.DISCORD_CLIENT_ID || 'not set'


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
      await interaction.reply('Pong!')
    }
  })

  await client.login(TOKEN)
}

await main()