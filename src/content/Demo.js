import g from '../GameManager'

export const characters = {
    Testbot: {
        name: `Test Bot`,
        expressions: {
            default: `testbot\\happy.jpg`,
            happy: `testbot\\happy.jpg`,
            angry: `testbot\\angry.jpg`,
        },
    },
    Testbot2: {
        name: `Test Bot 2`,
        expressions: {
            default: `testbot\\angry.jpg`,
        },
    },
}

export const scenes = {
    DemoStart: async () => {
        await g.showText(`You can make text appear one line at a time.`)
        await g.showText([
            `Or you can make multiple lines appear...`,
            `In a sequence.`,
        ])

        await g.showText(`You can also attribute lines to a character.`, {speaker: `Testbot`})
        await g.showText([
            `And if you attribute a sequence of lines to a character...`,
            `They'll say all of them.`,
        ], {speaker: `Testbot`})

        g.setSpeaker(`Testbot`)
        await g.showText(`You can also attribute lines to a character by setting the speaker.`)
        await g.showText(`All lines will be attributed to them by default...`)
        g.setSpeaker(null)
        await g.showText(`Until you change the speaker again.`)
        
        await g.setSpeaker(`Testbot`)
        await g.showText(`You can also introduce a delay before something happens...`)
        await g.showText(`If you want to introudce a pregnant pause.`, {delay: 0})
        
        await g.showText(`You can play a sound once...`)
        await g.playSound(`button-bloop.mp3`)
        await g.showText(`Or, you can play a looping sound.`)
        g.playSound(`looping-music.mp3`, {loop: true})
        await g.showText(`You can stop the music later, if you need to.`)
        await g.stopSound(`looping-music.mp3`)

        await g.showText(`You can easily change the background image.`)
        await g.setBackground(`dots-bg-sample.jpg`)
        await g.showText(`You can also change the background image with a transition.`)
        await g.setBackground(`wood-bg-sample.jpg`, {transition: 'fade', speed: 1, delay: 1})
        await g.setBackground(`dots-bg-sample.jpg`, {transition: 'slide', speed: 2, direction: 'down', delay: 1})
        await g.setBackground(`dots-bg-sample.jpg`, {transition: 'slide', speed: 'fast', direction: 'right'})

        await g.showText(`It's easy to show a character's portrait, too.`)
        await g.showCharacter(`Testbot`, {direction: 'left', transition: 'slide', position: {left: 10, bottom: 0}, speed: 1, expression: 'default'})
        await g.showText(`If they have expressions configured, you can change which is shown.`)
        await g.setExpression(`Testbot`, `angry`)
        await g.showText(`You can also change expressions with a transition, or a delay, or both.`)
        await g.setExpression(`Testbot`, `happy`, {transition: 'fade', delay: 2})

        await g.showText(`You can also move them with a transition.`)
        await g.adjustCharacter(`Testbot`, {position: {right: 0}, transition: `slide`, speed: .1})
        await g.showText(`That can make room for other characters.`)
        await g.showCharacter(`Testbot2`, {level: -1, speed: .1, transition: `slide`, position: {left: 2, bottom: 0}})

        await g.showText(`Portraits can grow and shrink, and even move at the same time.`)
        await g.adjustCharacter(`Testbot2`, {scale: 2, speed: 1, delay: 1})
        await g.adjustCharacter(`Testbot2`, {scale: .5, speed: 1})
        await g.adjustCharacter(`Testbot2`, {scale: .5, position: {left: 8}, level: 3, speed: 1})

        await g.showText(`You can choose to focus on one or more characters, automatically hiding the others.`)
        await g.focusOn(`Testbot`, {opacity: .3, delay: .5})
        // You could also focus on multiple characters at once, like so:
        // await g.focusOn([`Testbot`, `Testbot2`], {delay: .5})
        await g.showText(`To remove focus, just focus on nothing.`)
        await g.focusOn(null, {speed: 2, delay: .5})
        
        await g.showText([
            `If you want two or more actions to happen at the same time, only "await" the last one.`,
            `If you wanted to simulate your characters jumping together, for example, you could do so like this.`,
        ])
        g.adjustCharacter(`Testbot`, {transition: 'slide', speed: .1, position: {bottom: 10}})
        await g.adjustCharacter(`Testbot2`, {transition: 'slide', speed: .1, position: {bottom: 10}})
        g.adjustCharacter(`Testbot`, {transition: 'slide', speed: .1, position: {bottom: 0}})
        await g.adjustCharacter(`Testbot2`, {transition: 'slide', speed: .1, position: {bottom: 0}})
        await g.showText([
            `Complex VNs may have lots of things happening at the same time.`,
            `You can call as many functions as are needed and they'll all start at once. Just be sure to await the last one, so the game can catch up.`,
            `"Awaiting" functions will make more sense if you experiment with it, so try it out.`,
        ], {delay: 1})

        await g.showText(`You can get rid of characters, when they're no longer needed.`)
        await g.removeCharacter(`Testbot2`, {transition: 'fade'})

        await g.showText([
            `If you'd like to have branching paths, you can prompt the player.`,
            `When they pick an option, they'll be taken to the appropriate scene.`,
        ])
        await g.prompt([
            [`Option 1`, `DemoOption1`],
            [`Option 2`, `DemoOption2`],
        ])
    },
    DemoOption1: async () => {
        await g.showText(`You can set flags, to reference information later.`)
        g.setFlag(`DemoOption`, 1)
        await g.showText(`You picked option ${g.getFlag(`DemoOption`)}.`)
        await g.showText(`You can also manually play a scene.`)
        g.play(`DemoEnd`)
    },
    DemoOption2: async () => {
        await g.showText(`You can set flags, to reference information later.`)
        g.setFlag(`DemoOption`, 2)
        await g.showText(`You picked option ${g.getFlag(`DemoOption`)}.`)
        await g.showText(`You can also manually play a scene.`)
        g.play(`DemoEnd`)
    },
    DemoEnd: async () => {
        await g.showText(`Flags persist across scenes. For example, you got to this scene after picking option ${g.getFlag(`DemoOption`)}.`)
        await g.showText(`The game is only saved when the scene changes. If you'd like your player to get frequent checkpoints, be sure to use lots of scenes.`)
        await g.setSpeaker(null)
        await g.showText(`That's enough for now. More features to come!`)
    },
}