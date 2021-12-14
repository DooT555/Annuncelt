import { CommandInteraction } from 'discord.js'
import Announcement from '../schemas/Announcement'
import Client from '../structures/Client'

export default async function run(client: Client, interaction: CommandInteraction) {
  if (!interaction.channel) return 
  await interaction.deferReply()
  const name = interaction.options.getString('name', true)
  const lang = interaction.options.getString('lang', true)
  const title = interaction.options.getString('title', false)

  await interaction.channel.send('Manda un mensaje con la descripción')
  const msgCollector = await interaction.channel.awaitMessages({
    filter: (msg) => msg.author.id === interaction.user.id,
    time: 30 * 1000,
    max: 1
  })
  const description = msgCollector.first()?.content

  const announcement = await Announcement.findOne({ name })
  if (!announcement) return
  announcement.translations.push({
    lang,
    title: title ?? undefined,
    description
  })
  // TODO: Hacer comprobación de error en todos los cambios a la db
  announcement.save()

  interaction.editReply('Se ha añadido la traducción del anuncio correctamente!')
}
