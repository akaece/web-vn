const contentModules = import.meta.glob('./content/**/*.js')

import parser from './Parser'
import {
    LineText,
    BackgroundPanelImg,
    PortraitPanel,
} from './util/UIElements'

function getPromiseFromEvent(item, event) {
    return new Promise((resolve) => {
        const listener = () => {
            item.removeEventListener(event, listener);
            resolve();
        }
        item.addEventListener(event, listener);
    })
}

class GameManager extends EventTarget {
    currentScene = ''
    focusing = false
    startScene = 'DemoStart'
    constructor() {
      super()
  
      // Game object stores
      this.characters = {}
      this.scenes = {}
      this.focusedOn = {}
      this.loopingAudio = {}
    }
  
    start() {
        this.play(this.currentScene)
    }
  
    async loadScenes() {
      for (const path in contentModules) {
        const mod = await contentModules[path]()
        const {
          characters,
          scenes,
        } = mod
        this.characters = { ...this.characters, ...characters }
        this.scenes = { ...this.scenes, ...scenes }
      }
    }

    save() {
        localStorage.setItem('lastScene', this.currentScene)
        localStorage.setItem('flags', JSON.stringify(this.flags))
        localStorage.setItem('backgroundSrc', BackgroundPanelImg.src)
        localStorage.setItem('speaker', this.speaker)
        localStorage.setItem('loopingAudio', JSON.stringify(this.loopingAudio))

        const characters = {}
        for (const portraitPanel of PortraitPanel.children) {
            characters[portraitPanel.id] = portraitPanel.outerHTML
        }
        localStorage.setItem('characters', JSON.stringify(characters))
    }
  
    loadGame() {
      this.currentScene = localStorage.getItem('lastScene') ?? this.startScene
      this.flags = JSON.parse(localStorage.getItem('flags') ?? '{}')
      const backgroundSrc = localStorage.getItem('backgroundSrc')
      if(backgroundSrc) {
        BackgroundPanelImg.src = backgroundSrc
      }
      const speaker = localStorage.getItem('speaker')
      if (speaker) {
        this.speaker = speaker
      }
      const characters = JSON.parse(localStorage.getItem('characters') ?? '{}')
      for (const c in characters) {
        const portraitNode = document.createElement('img')
        PortraitPanel.appendChild(portraitNode)
        portraitNode.outerHTML = characters[c]
      }
      const loopingAudio = JSON.parse(localStorage.getItem('loopingAudio') ?? '{}')
      for (const a in loopingAudio) {
        this.playSound(a, loopingAudio[a])
      }

      this.start()
    }
  
    cleanAndReboot() {
        localStorage.clear()
        BackgroundPanelImg.src = '' // TODO: replace with default config
        this.speaker = ''
        PortraitPanel.innerHTML = ''
        this.loadGame()
    }

    async play(sceneId) {
        //If scene returns a function, store it and run when next scene is played
        if (this.cleanupFunc) this.cleanupFunc()
        this.currentScene = sceneId
        const scene = this.scenes[sceneId]
        if (!scene) {
          console.log(`Error: no scene found for ID ${sceneId}`)
          return
        }
        this.cleanupFunc = await scene()
        this.save()
      }

    sendEvent(event) {
        const delay = event.detail.options?.delay
        return new Promise((resolve) => {
            if (delay) {
                setTimeout(() => {
                    this.dispatchEvent(event)
                    resolve()
                }, delay * 1000)
            } else {
                this.dispatchEvent(event)
                resolve()
            }
        })
    }

    /* Content functions */
    async showText(text, options = {}) {
        if (!Array.isArray(text)) {
            text = [text]
        }
        let speaker = options.speaker ? options.speaker : this.speaker
        speaker = this.characters[speaker]?.name ? this.characters[speaker].name : speaker
        for (const t of text) {
            LineText.innerHTML = ''
            const parsed = parser(t, this)
            const showEvent = new CustomEvent('showText', {
                detail: {
                    text: parsed,
                    options,
                    speaker,
                }
            })
            this.sendEvent(showEvent)
    
            await getPromiseFromEvent(this, 'lineTextDone')
            await getPromiseFromEvent(this, 'proceed')
        }
    }

    async prompt(choices, options) {
        const promptEvent = new CustomEvent('prompt', {
            detail: {
                choices,
                options,
            },
        })
        this.dispatchEvent(promptEvent)
        await getPromiseFromEvent(this, 'promptDone')
    }

    async setBackground(background, options = {}) {
        await this.sendEvent(new CustomEvent('changeBackground', {
            detail: {
                background,
                options,
            }
        }))
        if (options.transition) {
            await getPromiseFromEvent(this, 'setBackgroundDone')
        }
    }

    async showCharacter(characterName, options = {}) {
        const character = this.characters[characterName]
        await this.sendEvent(new CustomEvent('showCharacter', {
            detail: {
                characterName,
                character,
                options,
            }
        }))
        if (options.transition) {
            await getPromiseFromEvent(this, 'showCharacterDone')
        }
    }

    async removeCharacter(characterName, options = {}) {
        await this.sendEvent(new CustomEvent('removeCharacter', {
            detail: {
                characterName,
                options,
            }
        }))
        if (options.transition) {
            await getPromiseFromEvent(this, 'removeCharacterDone')
        }
    }

    async setExpression(characterName, expressionName, options = {}) {
        const character = this.characters[characterName]
        await this.sendEvent(new CustomEvent('setExpression', {
            detail: {
                characterName,
                expression: character.expressions[expressionName],
                options,
            }
        }))
        if (options.transition) {
            await getPromiseFromEvent(this, 'setExpressionDone')
        }
    }

    async setSpeaker(characterName) {
        this.speaker = characterName
    }

    async adjustCharacter(characterName, options = {}) {
        const character = this.characters[characterName]
        await this.sendEvent(new CustomEvent('adjustCharacter', {
            detail: {
                characterName,
                character,
                options,
            }
        }))
        await getPromiseFromEvent(this, 'adjustCharacterDone')
    }

    setFlag(name, value) {
        this.flags[name] = value
    }
    
    getFlag(name) {
        return this.flags[name]
    }

    async focusOn(inFocus, options = {}) {
        this.focusing = true
        this.focusedOn = {}
        if (inFocus) {
            if (typeof inFocus === 'string') {
                inFocus = [inFocus]
            }
            for (const c of inFocus) {
                this.focusedOn[c] = true
            }
        } else {
            this.focusing = false
        }
        await this.sendEvent(new CustomEvent('updateFocus', {
            detail: {
                focusedOn: this.focusedOn,
                options,
            }
        }))
        await getPromiseFromEvent(this, 'updateFocusDone')
    }

    async playSound(soundName, options = {}) {
        await this.sendEvent(new CustomEvent('playSound', {
            detail: {
                soundName,
                options,
            }
        }))
        if (!options.loop) {
            await getPromiseFromEvent(this, 'playSoundDone')
        }
    }

    async stopSound(soundName, options = {}) {
        await this.sendEvent(new CustomEvent('stopSound', {
            detail: {
                soundName,
                options,
            }
        }))
        delete this.loopingAudio[soundName]
    }
}

export default new GameManager()
