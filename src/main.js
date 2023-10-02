import './style.css'

import GameManager from './GameManager'
window.GameManager = GameManager
import configLoader from './configLoader'
import configs from './configs.js'
import {
  App,
  LineAttribution,
  BackgroundPanelImg,
  BackgroundPanelImgTransition,
  PortraitPanel,
  PromptBox,
  PromptList,
  MainMenu,
  NewGameButton,
  ContinueButton,
} from './util/UIElements'

const transitionSpeeds =  {
  slow: 3000,
  fast: 500,
}

const playingAudios = {}

const hideMainMenu = () => {
  App.style.display = 'block'
  MainMenu.style.display = 'none'
}

const updateLineText = (text, index, interval) => {
  const LineText = document.getElementById('line-text')
  if (index >= text.length) {
    const doneEvent = new CustomEvent('lineTextDone')
    GameManager.dispatchEvent(doneEvent)
    return
  }
  LineText.innerHTML += text[index++]
  setTimeout(function () { updateLineText(text, index, interval) }, interval)
}

const combineAnimArgs = (argsList) => {
  const onFinishList = []
  let actionFrames = 0
  let transitionActionFrames = 0
  for (const args of argsList) {
    if (args.onFinish) {
      onFinishList.push(args.onFinish)
    }
    actionFrames = Math.max(args.actions?.length, actionFrames)
    transitionActionFrames = Math.max(args.transitionActions?.length, transitionActionFrames)
  }

  // Insert dummy frames to align animations
  for (const args of argsList) {
    if (args.actions && args.actions.length < actionFrames) {
      for (let i = 0; i < args.actions.length - actionFrames; i++) {
        const splitIdx = Math.floor(args.actions.length / 2)
        args.actions = [...args.actions.slice(0, splitIdx), null, ...args.actions.slice(splitIdx)]
      }
    }
    if (args.transitionActions) {
      for (let i = 0; i < args.transitionActions.length - transitionActionFrames; i++) {
        const splitIdx = Math.floor(args.transitionActions.length / 2)
        args.transitionActions = [...args.transitionActions.slice(0, splitIdx), null, ...args.transitionActions.slice(splitIdx)]
      }
    }
  }

  // Combine frames for each animation
  const actions = actionFrames ? Array.from({length: actionFrames}, () => ({})) : null
  const transitionActions = transitionActionFrames ? Array.from({length: transitionActionFrames}, () => ({})) : null
  for (const args of argsList) {
    if (args.actions && args.actions.length > 0) {
      for (let i = 0; i < args.actions.length; i++) {
        if (args.actions[i]) {
          for (const tf in args.actions[i]) {
            actions[i][tf] = actions[i][tf] ? actions[i][tf] + ' ' + args.actions[i][tf] : args.actions[i][tf]
          }
        }
      }
    }
    if (args.transitionActions) {
      for (let i = 0; i < args.transitionActions.length; i++) {
        if (args.transitionActions[i]) {
          for (const tf in args.transitionActions[i]) {
            transitionActions[i][tf] = transitionActions[i][tf] ? transitionActions[i][tf] + ' ' + args.transitionActions[i][tf] : args.transitionActions[i][tf]
          }
        }
      }
    }
  }

  return {
    actions, transitionActions, onFinishList
  }
}

const playAnim = (panel, transitionPanel, actions, transitionActions, speed, doneEvent, onFinish) => {
  if (isNaN(speed)) {
    speed = transitionSpeeds[speed]
    speed = speed ? speed : 1000
  } else {
    speed = speed * 1000
  }
  const duration = speed ? speed : 1000

  let anim
  if (panel && actions && actions.length > 0) {
    anim = panel.animate(
      actions,
      {duration, iterations: 1},
    )
  }

  if (transitionPanel && transitionActions && transitionActions.length > 0) {
    transitionPanel.animate(
      transitionActions,
      {duration, iterations: 1},
    )
  }

  if (anim) {
    anim.onfinish = (e) => {
      if (onFinish) {
        if (typeof onFinish == 'function') {
          onFinish()
        } else if (onFinish.length > 0) {
          for (const m of onFinish) {
            m()
          }
        }
      }
      GameManager.dispatchEvent(doneEvent)
    }
  }
}

// Replace one image with another using a slide transition
const slide = (panel, transitionPanel, newImgSrc, direction) => {
  transitionPanel.src = newImgSrc

  let startX = 0, startY = 0
  switch (direction) {
    case 'down':
      startY = -100
      break
    case 'up':
      startY = 100
      break
    case 'right':
      startX = -100
      break
    case 'left':
      startX = 100
      break
  }
  
  return {
    actions: [
      {transform: "translate(0%, 0%)"},
      {transform: `translate(${-1 * startX}%, ${-1 * startY}%)`},
    ],
    transitionActions: [
      {transform: `translate(${startX}%, ${startY}%)`, opacity: 1},
      {transform: `translate(0%, 0%)`, opacity: 1},
    ],
    onFinish: () => {
      panel.src = newImgSrc
    }
  }
}

// Fades from current image to new image
const fade = (panel, transitionPanel, newImgSrc, cleanupTransitionPanel = false) => {
  transitionPanel.src = newImgSrc
  return {
    actions: [
      {opacity: "1"},
      {opacity: "0"},
    ],
    transitionActions: [
      {opacity: "0"},
      {opacity: "1"},
    ],
    onFinish: () => {
      panel.src = newImgSrc
      if (cleanupTransitionPanel) {
        transitionPanel.remove()
      }
    }
  }
}

// Slides in from off screen
const slideIn = (panel, direction) => {
  let xStart = 0, yStart = 0
  switch (direction) {
    case 'left':
      xStart = `calc(100dvw - ${panel.getBoundingClientRect().left}px)`
      break
    case 'right':
      xStart = `calc(-100dvw + ${panel.getBoundingClientRect().right}px)`
      break
    case 'up':
      yStart = `calc(100dvh + ${panel.getBoundingClientRect().top}px)`
      break
    case 'down':
      yStart = `calc(-100dvh - ${panel.getBoundingClientRect().bottom}px)`
      break
  }

  return {
    actions: [
      {transform: `translate(${xStart}, ${yStart}`},
      {transform: `translate(0, 0)`},
    ],
  }
}

// Slides in from off screen
const slideOut = (panel, direction) => {
  let xStart = 0, yStart = 0
  switch (direction) {
    case 'left':
      xStart = `calc(-${panel.getBoundingClientRect().right}px)`
      break
    case 'right':
      xStart = `calc(100dvw - ${panel.getBoundingClientRect().left}px)`
      break
    case 'up':
      yStart = `calc(-${panel.getBoundingClientRect().bottom}px)`
      break
    case 'down':
      yStart = `calc(100dvh - ${panel.getBoundingClientRect().top}px)`
      break
  }

  return {
    actions: [
      {transform: `translate(0, 0)`},
      {transform: `translate(${xStart}, ${yStart}`},
    ],
  }
}

// Fades without a supporting transition
const fadeIn = (panel, startOpacity = 0, newOpacity = 1) => {
  return {
    actions: [
      {opacity: `${startOpacity}`},
      {opacity: `${newOpacity}`},
    ],
    onFinish: () => {
      panel.style.opacity = newOpacity
    },
  }
}
const fadeOut = (panel, startOpacity = 1, newOpacity = 0) => {
  return {
    actions: [
      {opacity: `${startOpacity}`},
      {opacity: `${newOpacity}`},
    ],
    onFinish: () => {
      panel.style.opacity = newOpacity
    },
  }
}

// Slides from current position to new position
const slideTo = (panel, destination) => {
  const before = panel.getBoundingClientRect()
  const beforeL = before.left
  const beforeT = before.top

  for (const dir in destination) {
    switch (dir) {
      case 'right':
        panel.style.removeProperty('left')
        panel.style.right = destination[dir] + 'dvw'
        break
      case 'left':
        panel.style.removeProperty('right')
        panel.style.left = destination[dir] + 'dvw'
        break
      case 'top':
        panel.style.removeProperty('bottom')
        panel.style.top = destination[dir] + 'dvh'
        break
      case 'bottom':
        panel.style.removeProperty('top')
        panel.style.bottom = destination[dir] + 'dvh'
        break
    }
  }

  const after = panel.getBoundingClientRect()
  const afterL = after.left
  const afterT = after.top

  return {
    actions: [
      {transform: `translate(${Math.floor(beforeL - afterL)}px, ${Math.floor(beforeT - afterT)}px)`},
      {transform: `translate(0px, 0px)`},
    ],
  }
}

const scale = (panel, newScale) => {
  return {
    actions: [
      {transform: `scale(1)`},
      {transform: `scale(${newScale})`},
    ],
    onFinish: () => {
      const origScale = panel.style.scale ? panel.style.scale : 1
      panel.style.scale = origScale * newScale
    }
  }
}

App.addEventListener('click', () => {
  GameManager.dispatchEvent(new CustomEvent('proceed'))
})

GameManager.loadScenes().then(() => {
  GameManager.addEventListener('showText', (e) => {
    if (e.detail.speaker) {
      LineAttribution.innerHTML = e.detail.speaker
    } else {
      LineAttribution.innerHTML = ''
    }
    updateLineText(e.detail.text, 0, 10) // TODO: Make text speed configurable
  })

  GameManager.addEventListener('changeBackground', (e) => {
    const newImgSrc = `img\\background\\${e.detail.background}`
    if (!e.detail.options?.transition) {
      BackgroundPanelImg.src = newImgSrc
      return
    }
    let transitions = e.detail.options?.transition
    if (typeof transitions == 'string') {
      transitions = [transitions]
    }
    const animArgs = []
    for (const transition of transitions) {
      switch (transition) {
        case 'fade':
          animArgs.push(
            fade(BackgroundPanelImg, BackgroundPanelImgTransition, newImgSrc)
          )
          break
        case 'slide':
          animArgs.push(
            slide(BackgroundPanelImg, BackgroundPanelImgTransition, newImgSrc, e.detail.options?.direction)
          )
          break
      }
    }
    const combined = combineAnimArgs(animArgs)
    playAnim(
      BackgroundPanelImg,
      BackgroundPanelImgTransition,
      combined.actions,
      combined.transitionActions,
      e.detail.options?.speed,
      new CustomEvent('setBackgroundDone'),
      combined.onFinishList,
    )
  })

  GameManager.addEventListener('prompt', (e) => {
    PromptList.innerHTML = ''
    PromptBox.style.display = 'block'
    for (const choice of e.detail.choices) {
      const displayText = choice[0]
      const sceneId = choice[1]
      const choiceNode = document.createElement('div')
      choiceNode.innerHTML = displayText
      choiceNode.classList.add('game-prompt-option')
      if (configs.promptBoxHoverFontOutline) {
        choiceNode.style.setProperty('--prompt-hover-stroke', configs.promptBoxHoverFontOutline)
      }
      choiceNode.onclick = (e) => {
        GameManager.play(sceneId)
        PromptBox.style.display = 'none'
        GameManager.dispatchEvent(new CustomEvent('promptDone'))
      }
      PromptList.appendChild(choiceNode)
    }
  })

  GameManager.addEventListener('adjustCharacter', (e) => {
    const portraitNode = document.getElementById(e.detail.characterName)
    if (e.detail.options?.level) {
      portraitNode.style['z-index'] = e.detail.options?.level
    }
    const animArgs = []
    if (e.detail.options?.position) {

      animArgs.push(
        slideTo(portraitNode, e.detail.options.position)
      )
    }
    if(e.detail.options?.scale) {
      animArgs.push(
        scale(portraitNode, e.detail.options.scale)
      )
    }
    const combined = combineAnimArgs(animArgs)
    playAnim(
      portraitNode,
      null,
      combined.actions,
      combined.transitionActions,
      e.detail.options?.speed,
      new CustomEvent('adjustCharacterDone'),
      combined.onFinishList,
    )
  })

  GameManager.addEventListener('removeCharacter', (e) => {
    let transitions = e.detail.options?.transition
    if (typeof transitions == 'string') {
      transitions = [transitions]
    }

    const portraitNode = document.getElementById(e.detail.characterName)
    const animArgs = []
    for (const transition of transitions) {
      switch (transition) {
        case 'slide':
          animArgs.push(
            slideOut(portraitNode, e.detail.options?.direction)
          )
          break
        case 'fade':
          animArgs.push(
            fadeOut(portraitNode)
          )
          break
      }
    }
    const combined = combineAnimArgs(animArgs)
    combined.onFinishList.push(() => portraitNode.remove())
    playAnim(
      portraitNode,
      null,
      combined.actions,
      combined.transitionActions,
      e.detail.options?.speed,
      new CustomEvent('removeCharacterDone'),
      combined.onFinishList,
    )
  })

  GameManager.addEventListener('updateFocus', (e) => {
    const focusing = Object.keys(e.detail.focusedOn).length > 0
    let focusScale
    if (focusing) {
      focusScale = e.detail.options.scale !== undefined ? e.detail.options.scale : 1.1
    } else {
      focusScale = 1
    }
    const focusOpacity = e.detail.options.opacity !== undefined ? e.detail.options.opacity : .8
    for (const portraitNode of PortraitPanel.children) {
      const animArgs = []
      if (e.detail.focusedOn[portraitNode.id] || !focusing) {
        if (focusScale !== undefined) {
          const currentScale = portraitNode.style.scale ? portraitNode.style.scale : 1
          animArgs.push(scale(portraitNode, focusScale / currentScale))
          animArgs.push(fadeIn(portraitNode, portraitNode.style.opacity ?? 1, 1))
        }
      } else {
        if (focusScale !== undefined) {
          animArgs.push(scale(portraitNode, 1 / focusScale))
        }
        if (focusOpacity !== undefined) {
          const origOpacity = portraitNode.style.opacity
          const args = fadeOut(portraitNode, origOpacity, focusOpacity)
          args.onFinish = () => {
            portraitNode.style.opacity = focusOpacity
          }
          animArgs.push(args)
        }
      }
      const combined = combineAnimArgs(animArgs)
      playAnim(
        portraitNode,
        null,
        combined.actions,
        combined.transitionActions,
        e.detail.options?.speed,
        new CustomEvent('updateFocusDone'),
        combined.onFinishList,
      )
    }
  })

  GameManager.addEventListener('showCharacter', (e) => {
    let transitions = e.detail.options?.transition
    if (typeof transitions == 'string') {
      transitions = [transitions]
    }

    const portraitNode = document.createElement('img')
    portraitNode.id = e.detail.characterName
    portraitNode.style = `max-height: 95%; position: absolute;`
    if (e.detail.options?.level) {
      portraitNode.style['z-index'] = e.detail.options?.level
    }
    for (const dir in e.detail.options?.position) {
      const unit = dir in ['top', 'bottom'] ? 'dvh' : 'dvw'
      const val = `${e.detail.options?.position[dir]}${unit}`
      portraitNode.style[dir] = val
    }
    const expressionName = e.detail.options.expression ? e.detail.options.expression : 'default'
    const expressionImg = e.detail.character.expressions[expressionName]
    portraitNode.src = `img\\character\\${expressionImg}`
    PortraitPanel.appendChild(portraitNode)

    if (!transitions) {
      return
    }

    const animArgs = []
    for (const transition of transitions) {
      switch (transition) {
        case 'slide':
          animArgs.push(
            slideIn(portraitNode, e.detail.options?.direction)
          )
          break
        case 'fade':
          animArgs.push(
            fadeIn(portraitNode)
          )
          break
      }
    }
    const combined = combineAnimArgs(animArgs)
    playAnim(
      portraitNode,
      null,
      combined.actions,
      combined.transitionActions,
      e.detail.options?.speed,
      new CustomEvent('showCharacterDone'),
      combined.onFinishList,
    )
  })

  GameManager.addEventListener('setExpression', (e) => {
    const panel = document.getElementById(e.detail.characterName)
    const newImgSrc = `img\\character\\${e.detail.expression}`
    if (!e.detail.options?.transition) {
      panel.src = newImgSrc
      return
    }

    let transitions = e.detail.options?.transition
    if (typeof transitions == 'string') {
      transitions = [transitions]
    }

    const characterPanel = document.getElementById(`${e.detail.characterName}-div`)
    const transitionPanel = panel.cloneNode()
    transitionPanel.src = newImgSrc
    PortraitPanel.appendChild(transitionPanel)

    const animArgs = []
    for (const transition of transitions) {
      switch (transition) {
        case 'fade':
          animArgs.push(
            fade(panel, transitionPanel, `img\\character\\${e.detail.expression}`, true)
          )
          break
      }
    }
    const combined = combineAnimArgs(animArgs)
    playAnim(
      panel,
      transitionPanel,
      combined.actions,
      combined.transitionActions,
      e.detail.options?.speed,
      new CustomEvent('setExpressionDone'),
      combined.onFinishList,
    )
  })

  GameManager.addEventListener('playSound', (e) => {
    const existing = GameManager.loopingAudio[e.detail.soundName]
    if (existing) {
      existing.pause()
    }
    const audio = new Audio(`audio\\${e.detail.soundName}`)
    if (e.detail.options.loop) {
      GameManager.loopingAudio[e.detail.soundName] = e.detail.options
      audio.loop = true
    }
    audio.addEventListener('ended', () => {
      console.log('asdfasdfasd')
      GameManager.dispatchEvent(new CustomEvent('playSoundDone'))
    })
    audio.play()
    playingAudios[e.detail.soundName] = audio
  })

  GameManager.addEventListener('stopSound', (e) => {
    const existing = playingAudios[e.detail.soundName]
    if (existing) {
      existing.pause()
      delete playingAudios[e.detail.soundName]
    }
  })

  /* Load UI settings from configs */
  configLoader()

  NewGameButton.addEventListener('click', async () => {
    await GameManager.cleanAndReboot()
    hideMainMenu()
  })
  
  ContinueButton.addEventListener('click', async () => {
    await GameManager.loadGame()
    hideMainMenu()
  })

  if (!localStorage.getItem('lastScene')) {
    ContinueButton.style.display = 'none'
  }

  const menuButtons = document.querySelectorAll('.menu-button')
  for (const b of menuButtons) {
    // Setup menu buttons - style changes, sounds, etc.
  }

  if (configs.startScene) {
    GameManager.startScene = configs.startScene
  }
  GameManager.saveData = {}
  //GameManager.loadGame()
})