import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework'
import { fetchT } from '@sapphire/plugin-i18next'
import { ButtonInteraction, EmbedBuilder, HexColorString, SelectMenuInteraction } from 'discord.js'
import { Announcement } from '../schemas/Announcement.js'

export class ButtonHandler extends InteractionHandler {
  public constructor (context: InteractionHandler.LoaderContext, options: InteractionHandler.Options) {
    super(context, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.SelectMenu
    })
  }

  public override async run (interaction: ButtonInteraction, result: InteractionHandler.ParseResult<this>) {
    return await interaction.reply(result)
  }

  public override async parse (interaction: SelectMenuInteraction) {
    if (!interaction.customId.startsWith('selectLang:')) return this.none()
    const announcementId = interaction.customId.split(':')[1]
    const t = await fetchT(interaction)
    const announcement = await Announcement.findById(announcementId).exec()
    if (!announcement) return this.some({ content: t('common:announcementNotFound'), ephemeral: true })

    const translationId = interaction.values[0]
    const translation = announcement
      .translations.find((translation) => translation._id?.toString() === translationId)
    if (!translation) return this.some({ content: t('common:translationNotFound'), ephemeral: true })

    const embed = new EmbedBuilder()
      .setColor(announcement.color as HexColorString ?? 'Blurple')
    if (translation.title) embed.setTitle(translation.title)
    if (translation.description) embed.setDescription(translation.description)
    if (translation.footer) embed.setFooter({ text: translation.footer })
    if (announcement.url && translation.title) embed.setURL(announcement.url)
    if (translation.url && translation.title) embed.setURL(translation.url)
    if (announcement.image) embed.setImage(announcement.image)
    if (announcement.thumbnail) embed.setThumbnail(announcement.thumbnail)
    if (translation.image) embed.setImage(translation.image)
    if (translation.thumbnail) embed.setThumbnail(translation.thumbnail)

    return this.some({
      embeds: [embed],
      ephemeral: true
    })
  }
}
