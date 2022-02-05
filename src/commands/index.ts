import { SlashCommandBuilder } from '@discordjs/builders'
import { getFixedT } from 'i18next'
import config from '../../config.json'

const t = getFixedT(config.defaultLanguage)

const HelpCommand = new SlashCommandBuilder()
  .setName('help')
  .setDescription(t('meta:help.description'))

const AnnouncementsCommands = new SlashCommandBuilder()
  .setName('announcements')
  .setDescription(t('meta:announcements.description'))
  .addSubcommand((subcommand) => {
    return subcommand
      .setName('add')
      .setDescription(t('meta:announcements.add.description'))
      .addStringOption((option) => {
        return option
          .setName('name')
          .setDescription(t('meta:announcements.add.options.name'))
          .setRequired(true)
      })
      .addStringOption((option) => {
        return option
          .setName('title')
          .setDescription(t('meta:announcements.add.options.title'))
          .setRequired(false)
      })
      .addStringOption((option) => {
        return option
          .setName('color')
          .setDescription(t('meta:announcements.add.options.color'))
      })
  })
  .addSubcommand((subcommand) => {
    return subcommand
      .setName('add_translation')
      .setDescription(t('meta:announcements.add_translation.description'))
      .addStringOption((option) => {
        return option
          .setName('name')
          .setDescription(t('meta:announcements.add.options.name'))
          .setRequired(true)
          .setAutocomplete(true)
      })
      .addStringOption((option) => {
        return option
          .setName('lang')
          .setDescription(t('meta:announcements.add_translation.options.lang'))
          .setRequired(true)
          .setAutocomplete(true)
      })
      .addStringOption((option) => {
        return option
          .setName('title')
          .setDescription(t('meta:announcements.add.options.title'))
          .setRequired(false)
      })
  })
  .addSubcommand((subcommand) => {
    return subcommand
      .setName('publish')
      .setDescription(t('meta:announcements.publish.description'))
      .addStringOption((option) => {
        return option
          .setName('name')
          .setDescription(t('meta:announcements.add.options.name'))
          .setRequired(true)
          .setAutocomplete(true)
      })
      .addChannelOption((option) => {
        return option
          .setName('channel')
          .setDescription(t('meta:announcements.publish.options.channel'))
          .setRequired(true)
          .addChannelType(0)
          .addChannelType(5)
          .addChannelType(10)
          .addChannelType(11)
          .addChannelType(12)
      })
  })
  .addSubcommand((subcommand) => {
    return subcommand
      .setName('list')
      .setDescription(t('meta:announcements.list.description'))
      .addBooleanOption((option) => {
        return option
          .setName('only_published')
          .setDescription(t('meta:announcements.list.options.only_published'))
          .setRequired(false)
      })
  })
  .addSubcommand((subcommand) => {
    return subcommand
      .setName('remove')
      .setDescription(t('meta:announcements.remove.description'))
      .addStringOption((option) => {
        return option
          .setName('name')
          .setDescription(t('meta:announcements.add.options.name'))
          .setRequired(true)
          .setAutocomplete(true)
      })
  })
  .addSubcommandGroup((subcommandGroup) => {
    return subcommandGroup
      .setName('managers')
      .setDescription(t('meta:announcements.managers.description'))
      .addSubcommand((subcommand) => {
        return subcommand
          .setName('add')
          .setDescription(t('meta:announcements.managers.add.description'))
          .addRoleOption((role) => {
            return role
              .setName('role')
              .setDescription(t('meta:announcements.managers.add.options.role'))
              .setRequired(true)
          })
      })
      .addSubcommand((subcommand) => {
        return subcommand
          .setName('remove')
          .setDescription(t('meta:announcements.managers.remove.description'))
          .addRoleOption((role) => {
            return role
              .setName('role')
              .setDescription(t('meta:announcements.managers.remove.options.role'))
              .setRequired(true)
          })
      })
  })

export default {
  Help: HelpCommand.toJSON(),
  Announcements: AnnouncementsCommands.toJSON()
}
