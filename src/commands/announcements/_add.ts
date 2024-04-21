import { TextInputBuilder } from '@discordjs/builders'
import { fetchT, TFunction } from '@sapphire/plugin-i18next'
import { Subcommand } from '@sapphire/plugin-subcommands'
import { ActionRowBuilder, ComponentType, ModalBuilder } from 'discord.js'
import ow from 'ow'
import { nameSchema } from '../../schemas/OwSchemas.js'
import getModalComponents from '../../utils/getModalComponents.js'
import { Image, temporaryImgStorage } from '../../utils/Globals.js'
import { validateChatInput } from '../../utils/validateOptions.js'

export const imageFormats = ['.png', '.jpg', '.jpeg', '.gif', '.webp']
const schema = ow.object.exactShape({
  // eslint-disable-next-line sort/object-properties
  name: nameSchema,
  image: ow.optional.string.url.validate((string) => ({
    message: () => 'commands:add.notValidImage',
    validator: imageFormats.some((extension) => string.endsWith(extension))
  })).message(() => 'commands:add.notValidImage'),
  thumbnail: ow.optional.string.url.validate((string) => ({
    message: () => 'commands:add.notValidImage',
    validator: imageFormats.some((extension) => string.endsWith(extension))
  })).message(() => 'commands:add.notValidImage')
})

export async function add (interaction: Subcommand.ChatInputCommandInteraction) {
  const t: TFunction = await fetchT(interaction)
  const options = await validateChatInput(interaction, schema)
  if (!options) return
  const { image, name: id, thumbnail } = options

  if (image ?? thumbnail) {
    const images: Image[] = []
    if (image) {
      images.push({ type: 'IMAGE', url: image })
    }
    if (thumbnail) {
      images.push({ type: 'THUMBNAIL', url: thumbnail })
    }
    temporaryImgStorage.set(interaction.id, images)
  }

  const modal = new ModalBuilder()
    .setTitle(t('commands:add.modalTitle'))
    .setCustomId(`addAnnouncement:${interaction.id}:${Date.now()}:${id}`)

  const components = await getModalComponents(interaction)
  interaction.client.logger.debug('modal components', components)

  modal.setComponents(
    // ? Makes an actionRow for every textInput
    components
      .map((component) => new ActionRowBuilder<TextInputBuilder>({
        components: [{ ...component, type: ComponentType.TextInput }],
        type: ComponentType.ActionRow
      }))
  )

  try {
    await interaction.showModal(modal)
  }
  catch (error) {
    interaction.client.logger.error(error)
  }
}
