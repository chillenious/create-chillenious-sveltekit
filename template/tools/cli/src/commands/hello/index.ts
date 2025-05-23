import {Args, Command, Flags} from '@oclif/core'

export default class Hello extends Command {
    static override args = {
        person: Args.string({description: 'person to say hello to'}),
    }

    static override description = 'Say hello'

    static override examples = [
        `$ pnpm run cli hello
Hello world!
`,
        `$ pnpm run cli hello friend --from oclif
Hello friend from oclif!
`,
    ]

    static override flags = {
        from: Flags.string({char: 'f', description: 'whom is saying hello', required: false}),
    }

    async run(): Promise<void> {
        const {args, flags} = await this.parse(Hello)

        const person = args.person ?? 'world'
        const from = flags.from ? ` from ${flags.from}` : ''

        this.log(`Hello ${person}${from}!`)
    }
}
