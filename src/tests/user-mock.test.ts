import { PermissionsBitField } from 'discord.js'
import { describe, expect, it } from 'vitest'
import { setupBot } from './client-mock.js'
import { mockGuild } from './guild-mock.js'
import { mockGuildMember, mockUser } from './user-mock.js'

describe('User Mock', () => {
  it('should create a mocked user', async () => {
    const client = await setupBot()
    const user = mockUser(client)
    expect(user).toBeDefined()
    expect(client.users.cache.get(user.id)).toBeDefined()
  })
})
describe('Member Mock', () => {
  it('should create a basic member', async () => {
    const client = await setupBot()
    const member = mockGuildMember({ client })
    expect(member).toBeDefined()
    expect(client.users.cache.get(member.id)).toBeDefined()
    expect(client.guilds.cache.get(member.guild.id)).toBeDefined()
    expect(member.guild.members.cache.get(member.id)).toBeDefined()
  })
  it('should create a member with a custom user', async () => {
    const client = await setupBot()
    const user = mockUser(client)
    const member = mockGuildMember({ client, user })
    expect(member).toBeDefined()
    expect(client.users.cache.get(member.id)).toBeDefined()
    expect(client.guilds.cache.get(member.guild.id)).toBeDefined()
    expect(member.guild.members.cache.get(member.id)).toBeDefined()
  })
  it('should create a member with a custom guild', async () => {
    const client = await setupBot()
    const guild = mockGuild(client)
    const member = mockGuildMember({ client, guild })
    expect(member).toBeDefined()
    expect(client.users.cache.get(member.id)).toBeDefined()
    expect(client.guilds.cache.get(member.guild.id)).toBeDefined()
    expect(member.guild.members.cache.get(member.id)).toBeDefined()
  })
  it('should create a member with a custom user and guild', async () => {
    const client = await setupBot()
    const user = mockUser(client)
    const guild = mockGuild(client)
    const member = mockGuildMember({ client, guild, user })
    expect(member).toBeDefined()
    expect(client.users.cache.get(member.id)).toBeDefined()
    expect(client.guilds.cache.get(member.guild.id)).toBeDefined()
    expect(member.guild.members.cache.get(member.id)).toBeDefined()
  })
})

describe('Member Mock', () => {
  it('should create a default member', async () => {
    const client = await setupBot()
    const member = mockGuildMember({ client })
    expect(member).toBeDefined()
    expect(client.users.cache.get(member.id)).toBeDefined()
    expect(client.guilds.cache.get(member.guild.id)).toBeDefined()
    expect(member.guild.members.cache.get(member.id)).toBeDefined()
  })
  it('should own the created guild', async () => {
    const client = await setupBot()
    const member = mockGuildMember({ client })
    expect(member).toBeDefined()
    expect(member.permissions.bitfield.toString()).toBe(
      PermissionsBitField.All.toString()
    )
    expect(member.guild.ownerId).toBe(member.id)
  })
  it('should create a member with manage server permissions', async () => {
    const client = await setupBot()
    const owner = mockGuildMember({ client })
    const manager = mockGuildMember({
      client,
      guild: owner.guild,
      permissions: PermissionsBitField.resolve('ManageGuild')
    })
    expect(manager).toBeDefined()
    expect(manager.permissions.has('ManageGuild')).toBe(true)
  })
  it('should create an administrator member', async () => {
    const client = await setupBot()
    const owner = mockGuildMember({ client })
    const admin = mockGuildMember({
      client,
      guild: owner.guild,
      permissions: PermissionsBitField.resolve('Administrator')
    })
    expect(admin).toBeDefined()
    expect(admin.permissions.has('Administrator')).toBe(true)
  })
  it('should create a normal member', async () => {
    const client = await setupBot()
    const owner = mockGuildMember({ client })
    const member = mockGuildMember({ client, guild: owner.guild })
    expect(member).toBeDefined()
    expect(member.permissions.has('Administrator')).toBe(false)
    expect(member.permissions.has('ManageGuild')).toBe(false)
    expect(member.permissions.has('AddReactions')).toBe(true)
    expect(member.permissions.has(PermissionsBitField.Default)).toBeTruthy()
  })
})
