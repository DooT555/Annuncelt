import { CommandInteraction, Message } from 'discord.js'
import { Announcement } from '../schemas/Announcement'
import Client from '../structures/Client'
import iso from 'iso-639-1'
import { TFunction } from 'i18next'

export default async function run (client: Client, interaction: CommandInteraction, t: TFunction): Promise<Message | void> {
  const id = interaction.options.getString('name')
  const announcement = await Announcement.findById(id).exec().catch(() => {})
  if (announcement == null) return await interaction.reply({ content: t('commands:add_translation.notFound'), ephemeral: true })

  const lang = interaction.options.getString('lang', true)
  if (!iso.getNativeName(lang)) return await interaction.reply({ content: t('commands:add_translation.notValidLanguage'), ephemeral: true })
  const title = interaction.options.getString('title', false) ?? undefined

  await interaction.deferReply()
  const botMsg = await interaction.channel!.send(t('commands:add_translation.sendAnnouncementDescription'))
  const msgCollector = await interaction.channel!.awaitMessages({
    filter: (msg) => msg.author.id === interaction.user.id,
    time: 840 * 1000, // 14 minutes
    max: 1
  })
  const description = msgCollector.first()?.content
  await botMsg.delete()
  if (!description) return await interaction.editReply(t('commands:add_translation.descriptionNotSended')) as Message
  if (description.length > 4096) return await interaction.editReply(t('commands:add_translation.descriptionMaxChars')) as Message

  announcement.translations.push({
    lang,
    title,
    description
  })
  announcement.save()

  interaction.editReply(t('commands:add_translation.done'))
}
