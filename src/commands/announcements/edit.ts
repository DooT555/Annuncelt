import { fetchT, TFunction } from '@sapphire/plugin-i18next'
import { Subcommand } from '@sapphire/plugin-subcommands'
import { Modal } from 'discord.js'
import iso from 'iso-639-1'
import ow from 'ow'
import { MessageComponentTypes } from 'discord.js/typings/enums'
import { Announcement } from '../../schemas/Announcement'
import getModalComponents from '../../utils/getModalComponents'
import { reply } from '../../utils/reply'
import { validateChatInput } from '../../utils/validateOptions'

const schema = ow.object.exactShape({
  // eslint-disable-next-line sort/object-properties
  name: ow.string,
  lang: ow.optional.string.oneOf(iso.getAllCodes()).message(() => 'commands:add-translation.notValidLanguage')
})

export async function edit (interaction: Subcommand.ChatInputInteraction) {
  const t: TFunction = await fetchT(interaction)
  const options = await validateChatInput(interaction, schema)
  if (!options) return
  const { lang, name: id } = options

  let announcement = await Announcement.findById(id).exec().catch(() => {})
  if (!announcement) return await reply(interaction, { content: t('commands:publish.announcementNotFound'), type: 'negative' })
  // @ts-expect-error
  if (lang) announcement = announcement.translations.find((translation) => translation.lang === lang)

  const modal = new Modal()
    .setTitle(t('commands:edit.modalTitle'))
    .setCustomId(`editAnnouncement:${interaction.id}:${Date.now()}:${JSON.stringify([id, lang])}`)

  let components = (await getModalComponents(interaction))
  // ? Add values from announcement to modal components
  components = components.map((component) => ({
    ...component,
    // @ts-expect-error
    value: announcement[component.customId]
  }))

  // @ts-expect-error
  modal.setComponents([
    // ? Makes an actionRow for every textInput
    components
      .map((component) => ({
        components: [component],
        type: MessageComponentTypes.ACTION_ROW
      }))
  ])

  try {
    await interaction.showModal(modal)
  } catch (error) {
    console.error(error)
  }
}
