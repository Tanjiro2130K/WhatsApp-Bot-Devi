import BaseCommand from '../../libs/BaseCommand.js';

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'tagall',
            category: 'moderation',
            description: {
                content: 'Ping Members'
            },
            exp: 1
        });
    }

    exec = async (M, { flags, text }) => {
        // Custom design to replace group name and sender tag
        const customDesign = `
﹧﹧  ﹧(ິ＼           ฺ          ❀۟           ฺ        ／ິ)
       ⫍   ──    ฺ  𝙵𝚄𝙲𝙺𝙸𝙽𝙶  ฺ   ──  ⫎
   ☆    
  ☆
   ⏝࣭࣭࣭࣭࣭ٜ᷼︶𝅄✼࣭࣭𝅄
         ☆
     ︶࣭࣭࣭࣭࣭ٜ᷼⏝        ꯭｜꯭  ꯭⎯꯭    ꯭⏤꯭    ꯭  ꯭ ᴛɪᴋᴜ   ꯭  ꯭ ꯭બ꯭  ꯭
`;

        // Correctly format senderNumber (although we are no longer using it)
        const senderNumber = M.sender && typeof M.sender === "string" && M.sender.includes('@')
            ? `@${M.sender.split('@')[0]}`
            : "@unknown"; // Default to @unknown if M.sender is not valid

        const admins = M.group?.admins || []; // Get admins
        const participants = M.group?.participants || []; // Get participants

        if ('admins' in flags) {
            // If the flag 'admins' is set, send a ping only to admins
            const adminTags = admins.map(admin => `⭐*${admin.split('@')[0]}*`).join('\n');
            return await M.reply(
                `${customDesign}\n\n🔹 *Summoned by:* ${senderNumber}\n\n✨ *Onii-chans, time to assemble!* ✨\n\n${adminTags}`,
                'text',
                undefined,
                undefined,
                admins
            );
        }

        // Ensure the user has admin permissions
        if (!M.isAdminMessage) {
            return await M.reply('❌ *Gomenasai, but you need to be an admin to summon everyone!*');
        }

        // Tag admins with `⭐*` and members with `*👤`
        const adminTags = admins.map(admin => `⭐ *${admin.split('@')[0]}*`).join('\n');
        const memberTags = participants
            .filter(member => !admins.includes(member)) // Exclude admins from members
            .map(member => `👤 *${member.split('@')[0]}*`)
            .join('\n');

        // Send the final message, tagging everyone with the custom design
        return await M.reply(
            `${customDesign}\n\n ⛩️ *Summoned by:* ${senderNumber}\n\n 💬 *ZeroTwo-🌸! Gather around~!* \n\n🍂 *${text || "Hello everyone, let's vibe together!"}* \n\n${adminTags}\n\n${memberTags}`,
            'text',
            undefined,
            undefined,
            participants
        );
    };
    
}
