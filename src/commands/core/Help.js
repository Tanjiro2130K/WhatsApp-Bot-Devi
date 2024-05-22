import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'help',
            aliases: ['menu', 'h'],
            category: 'core',
            description: {
                content: 'Displays the menu',
                usage: '[command]'
            },
            dm: true,
            exp: 1
        })
    }

    exec = async (M, parsedArgs) => {
        if (!parsedArgs.text) {
            const commands = this.handler.commands.keys()
            const categories = {}
            for (const command of commands) {
                const info = this.handler.commands.get(command)
                if (!command) continue
                if (!info?.config?.category || info.config.category === 'dev') continue
                if (Object.keys(categories).includes(info.config.category)) categories[info.config.category].push(info)
                else {
                    categories[info.config.category] = []
                    categories[info.config.category].push(info)
                }
            }
            let text = `👋🏻 (❤️ω❤️) Konnichiwa, senpai ${M.sender.username}! this is ${this.client.util.capitalize(this.client.config.name)}\n\n🎋 *Support us by following us on instagram:* https://www.instagram.com/_ne_itachi_?igsh=a2t3dWl6am9jdGpv\n\n💡 My Prefix is *( ${this.client.config.prefix} )*\n\n    ⇓ *📪 Command list 📪* ⇓\n\n`
            const keys = Object.keys(categories)
            for (const key of keys)
                text += `┌ ◦ *${this.emojis[keys.indexOf(key)]}「${key.toUpperCase()}」${this.emojis[keys.indexOf(key)]}*\n${categories[
                    key
                ]
                    .map(
                        (command) =>
                            `*${this.client.config.prefix}${this.replaceWithCustomAlphabet(command.config?.command)}* _${command.config.description.usage ?? ''}_`
                    )
                    .join('\n')}\n\n`

            return void (await M.replyRaw({
                image: {
                    url: 'https://telegra.ph/file/656bec8e98c7ea9b05e8c.jpg'
                },
                caption: `${text}*📇 Notes:*\n*➪ Use ${this.client.config.prefix}help <command name> from help the list to see its description and usage*\n*➪ Eg: ${this.client.config.prefix}help profile*\n*➪ <> means required and [ ] means optional, don't include <> or [ ] when using command.*`,
                contextInfo: {
                    externalAdReply: {
                        title: `${this.client.util.capitalize(this.client.config.name)}'s Commands`,
                        body: '',
                        thumbnail: await this.client.util.fetchBuffer('https://telegra.ph/file/b82c7d8df5a816014db75.jpg'),
                        mediaType: 1,
                        mediaUrl: '',
                        sourceUrl: '',
                        ShowAdAttribution: true
                    }
                }
            }))
        }
        const key = parsedArgs.text.toLowerCase()
        const command = this.handler.commands.get(key) || this.handler.aliases.get(key)
        if (!command) return void (await M.reply(`❌ No Command of Alias Found *"${key}"*`))
        const cmdStatus = (await this.client.DB.command.get(command.config?.command)) ?? {
            isDisabled: false,
            reason: ''
        }
        return void (await M.reply(`🟥 *Command: ${command.config.command}*
🟧 *Category: ${command.config.category}*
🟨 *Aliases: ${command.config.aliases ? command.config.aliases.join(', ').trim() : 'None'}*
🟩 *PrivateChat: ${command.config.dm ? 'True' : 'False'}*
🟦 *Admin: ${command.config.adminOnly ? 'True' : 'False'}*
⬛ *Status: ${cmdStatus.isDisabled}* - ${cmdStatus.reason}
🟪 *Usage: ${this.client.config.prefix}${command.config.command} ${command.config.description.usage ?? ''}*
⬜ *Description: ${command.config.description?.content}*`))
    }

    replaceWithCustomAlphabet = (sentence) => {
        const customAlphabetMap = {
            a: 'ᴀ',
            b: 'ʙ',
            c: 'ᴄ',
            d: 'ᴅ',
            e: 'ᴇ',
            f: 'ꜰ',
            g: 'ɢ',
            h: 'ʜ',
            i: 'ɪ',
            j: 'ᴊ',
            k: 'ᴋ',
            l: 'ʟ',
            m: 'ᴍ',
            n: 'ɴ',
            o: 'ᴏ',
            p: 'ᴘ',
            q: 'φ',
            r: 'ʀ',
            s: 'ꜱ',
            t: 'ᴛ',
            u: 'ᴜ',
            v: 'ᴠ',
            w: 'ᴡ',
            x: 'x',
            y: 'ʏ',
            z: 'ᴢ'
        }
        const words = sentence.split(' ')
        const replacedWords = words.map((word) => {
            const letters = word.split('')
            const replacedLetters = letters.map((letter) => {
                const lowercaseLetter = letter.toLowerCase()
                return customAlphabetMap[lowercaseLetter] || letter
            })
            return replacedLetters.join('')
        })
        return replacedWords.join(' ')
    }

    emojis = ['🍁', '🌼', '🍀', '🪻', '🎈', '⚙️', '🍂', '💈', '🔰']
}
