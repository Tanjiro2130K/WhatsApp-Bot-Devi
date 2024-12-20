import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'repo',
            category: 'core',
            description: {
                content: 'Gives you the repo link'
            },
            dm: true,
            exp: 10
        })
    }

    exec = async (M) => {
        const { open_issues_count, forks_count, stargazers_count, updated_at } = await this.client.util.fetch(
            `https://github.com/yudataguy/Awesome-Japanese`
        )
        return void (await M.replyRaw({
            text: '*🫦 come dm*',
            contextInfo: {
                externalAdReply: {
                    title: `Updated at ${updated_at}`,
                    body: `openIssues: ${open_issues_count}\nForks: ${forks_count}\nStars: ${stargazers_count}`,
                    thumbnail: await this.client.util.fetchBuffer('https://rammpntxxx-up.hf.space/file/image-fwebg0ddvrk.jpg'),
                    mediaType: 1,
                    mediaUrl: '',
                    sourceUrl: 'https://github.com/yudataguy/Awesome-Japanese',
                    ShowAdAttribution: true
                }
            }
        }))
    }
}
