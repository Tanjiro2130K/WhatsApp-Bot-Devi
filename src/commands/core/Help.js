import BaseCommand from '../../libs/BaseCommand.js';

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
        });
    }

    exec = async (M, parsedArgs) => {
        if (!parsedArgs.text) {
            const commands = this.handler.commands.keys();
            const categories = {};
            for (const command of commands) {
                const info = this.handler.commands.get(command);
                if (!command) continue;
                if (!info?.config?.category || info.config.category === 'dev') continue;
                if (Object.keys(categories).includes(info.config.category)) categories[info.config.category].push(info);
                else {
                    categories[info.config.category] = [];
                    categories[info.config.category].push(info);
                }
            }

            // Anime-styled text
            let text = `🌸 *Ohayō, Senpai 👋🏻 (❤️ω❤️) ${M.sender.username}!*\n\n🎀 *Welcome to ${this.client.util.capitalize(this.client.config.name)}, your kawaii helper bot!* 🎀\n\n🎋 *Support us by showing some love on whhatsapp = \n\n✨ *Prefix:* ( ${this.client.config.prefix} )\n\n⚡️ Here’s the magical list of commands:\n\n`;
            const keys = Object.keys(categories);
            for (const key of keys)
                text += `┌ ◦ *${this.emojis[keys.indexOf(key)]}「${key.toUpperCase()}」${this.emojis[keys.indexOf(key)]}*\n${categories[
                    key
                ]
                    .map(
                        (command) =>
                            `*${this.client.config.prefix}${this.replaceWithCustomAlphabet(command.config?.command)}* _${command.config.description.usage ?? ''}_`
                    )
                    .join('\n')}\n\n`;

            text += `🌸 *Notes:*\n➪ *Use ${this.client.config.prefix}help <command name>* to explore the wonders of each command.\n➪ Eg: *${this.client.config.prefix}help profile*\n➪ <> *denotes required and [ ] denotes optional — do not include them while using the commands.*`;

            // Add anime-themed image URL
            const imageUrl = 'https://fighter-programmer-uploaderf.hf.space/file/image-tmrxltotrrh.jpg'; // Replace with any anime-themed image URL
            await this.client.sendMessage(M.chat, {
                image: { url: imageUrl },
                caption: text
            });

            return;
        }
        const key = parsedArgs.text.toLowerCase();
        const command = this.handler.commands.get(key) || this.handler.aliases.get(key);
        if (!command) return void (await M.reply(`❌ *Gomenasai, Senpai!* No Command or Alias Found *"${key}"*`));
        const cmdStatus = (await this.client.DB.command.get(command.config?.command)) ?? {
            isDisabled: false,
            reason: ''
        };
        return void (await M.reply(`🟥 *Command:* ${command.config.command}
🟧 *Category:* ${command.config.category}
🟨 *Aliases:* ${command.config.aliases ? command.config.aliases.join(', ').trim() : 'None'}
🟩 *PrivateChat:* ${command.config.dm ? 'True' : 'False'}
🟦 *Admin:* ${command.config.adminOnly ? 'True' : 'False'}
⬛ *Status:* ${cmdStatus.isDisabled} - ${cmdStatus.reason}
🟪 *Usage:* ${this.client.config.prefix}${command.config.command} ${command.config.description.usage ?? ''}
⬜ *Description:* ${command.config.description?.content}`));
    };

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
        };
        const words = sentence.split(' ');
        const replacedWords = words.map((word) => {
            const letters = word.split('');
            const replacedLetters = letters.map((letter) => {
                const lowercaseLetter = letter.toLowerCase();
                return customAlphabetMap[lowercaseLetter] || letter;
            });
            return replacedLetters.join('');
        });
        return replacedWords.join(' ');
    };

    emojis = ['🌟', '🎀', '🔮', '👑', '🎈', '⚙️', '🍀', '💈', '🔰'];
}
