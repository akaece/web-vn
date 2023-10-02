import configs from './configs.js'
import {
    PromptBox,
    MainMenu,
    MainMenuLogo,
    MainMenuSidebar,
    SpeakerBox,
    DialoguePanel,
} from './util/UIElements'

const configLoader = () => {
    let families = ''
    let c = 0
    if (configs.fonts) {
        for (const font of configs.fonts) {
            const j = c++ ? '&' : '?'
            families += `${j}family=${font.replaceAll(' ', '+')}`
        }
        const link = document.createElement('link')
        link.setAttribute('rel', 'stylesheet')
        link.setAttribute('type', 'text/css')
        link.setAttribute('href', `https://fonts.googleapis.com/css${families}`)
        document.head.append(link)
    }

    if (configs.appTitle) {
        document.title = configs.appTitle
    }
    if (configs.mainMenuBackground) {
        MainMenu.style.backgroundImage = `url("img/ui/${configs.mainMenuBackground}")`
    }
    if (configs.mainMenuBackgroundSize) {
        MainMenu.style.backgroundSize = `${configs.mainMenuBackgroundSize}px`
    }
    if (configs.sidebarBackground) {
        MainMenuSidebar.style.backgroundImage = `url("img/ui/${configs.sidebarBackground}")`
    }
    if (configs.sidebarBackgroundSize) {
        MainMenuSidebar.style.backgroundSize = `${configs.sidebarBackgroundSize}px`
    }
    if (configs.sidebarPosition) {
        for (const p in configs.sidebarPosition) {
        const unit = ['left', 'right'].includes(p) ? 'dvw' : 'dvh'
        MainMenuSidebar.style[p] = `${configs.sidebarPosition[p]}${unit}`
        }
    }
    if (configs.sidebarTopOffset) {
        MainMenuSidebar.style.paddingTop = `${configs.sidebarTopOffset}dvh`
    }
    if (configs.sidebarFont) {
        MainMenuSidebar.style.fontFamily = configs.sidebarFont
    }
    if (configs.sidebarFontSize) {
        MainMenuSidebar.style.fontSize = `${configs.sidebarFontSize}em`
    }
    if (configs.sidebarFontColor) {
        MainMenuSidebar.style.color = configs.sidebarFontColor
    }
    if (configs.sidebarFontOutline) {
        MainMenuSidebar.style['-webkit-text-stroke'] = configs.sidebarFontOutline
    }
    if (configs.sidebarHoverFontOutline) {
        for (const b of MainMenuSidebar.children) {
            b.style['--sidebar-hover-stroke'] = configs.sidebarHoverFontOutline
        }
    }
    if (configs.sidebarButtonHoverSound) {
        for (const b of MainMenuSidebar.children) {
            b.addEventListener("mouseover", (e) => {
                const audio = new Audio(`audio\\${configs.sidebarButtonHoverSound}`)
                audio.play()
            })
        }
    }
    if (configs.sidebarButtonClickSound) {
        const audio = new Audio(`audio\\${configs.sidebarButtonClickSound}`)
        for (const b of MainMenuSidebar.children) {
            b.addEventListener("click", (e) => {
                audio.play()
            })
        }
    }
    if (configs.mainMenuLogoImage) {
        MainMenuLogo.src = `img\\ui\\${configs.mainMenuLogoImage}`
    }
    if (configs.mainMenuLogoPosition) {
        for (const p in configs.mainMenuLogoPosition) {
        const unit = ['left', 'right'].includes(p) ? 'dvw' : 'dvh'
        MainMenuLogo.style[p] = `${configs.mainMenuLogoPosition[p]}${unit}`
        }
    }
    if (configs.mainMenuLogoSize) {
        MainMenuLogo.style.width = `${configs.mainMenuLogoSize}dvw`
    }
    
    if (configs.speakerBoxImage) {
        SpeakerBox.style.backgroundImage = `url("img/ui/${configs.speakerBoxImage}")`
    }
    if (configs.speakerBoxImage) {
        SpeakerBox.style.backgroundSize = `${configs.speakerBoxImageSize}px`
    }
    if (configs.speakerBoxLeft) {
        SpeakerBox.style.left = `${configs.speakerBoxLeft}dvw`
    }
    if (configs.speakerBoxBottom) {
        SpeakerBox.style.bottom = `${configs.speakerBoxBottom}dvh`
    }
    if (configs.speakerBoxWidth) {
        SpeakerBox.style.width = `${configs.speakerBoxWidth}em`
    }
    if (configs.speakerBoxHeight) {
        SpeakerBox.style.height = `${configs.speakerBoxHeight}em`
    }
    if (configs.speakerBoxFont) {
        SpeakerBox.style.fontFamily = configs.speakerBoxFont
    }
    if (configs.speakerBoxFontSize) {
        SpeakerBox.style.fontSize = `${configs.speakerBoxFontSize}em`
    }
    if (configs.speakerBoxFontColor) {
        SpeakerBox.style.color = configs.speakerBoxFontColor
    }
    if (configs.speakerBoxFontOutline) {
        SpeakerBox.style['-webkit-text-stroke'] = configs.speakerBoxFontOutline
    }
    if(configs.speakerBoxRounding) {
        SpeakerBox.style.borderRadius = configs.speakerBoxRounding
    }
    
    if (configs.promptBoxImage) {
        PromptBox.style.backgroundImage = `url("img/ui/${configs.promptBoxImage}")`
    }
    if (configs.promptBoxImage) {
        PromptBox.style.backgroundSize = `${configs.promptBoxImageSize}px`
    }
    if (configs.promptBoxLeft) {
        PromptBox.style.left = `${configs.promptBoxLeft}dvw`
    }
    if (configs.promptBoxBottom) {
        PromptBox.style.bottom = `${configs.promptBoxBottom}dvh`
    }
    if (configs.promptBoxWidth) {
        PromptBox.style.width = `${configs.promptBoxWidth}em`
    }
    if (configs.promptBoxFont) {
        PromptBox.style.fontFamily = configs.promptBoxFont
    }
    if (configs.promptBoxFontSize) {
        PromptBox.style.fontSize = `${configs.promptBoxFontSize}em`
    }
    if (configs.promptBoxFontColor) {
        PromptBox.style.color = configs.promptBoxFontColor
    }
    if (configs.promptBoxFontOutline) {
        PromptBox.style['-webkit-text-stroke'] = configs.promptBoxFontOutline
    }
    if(configs.promptBoxRounding) {
        PromptBox.style.borderRadius = configs.promptBoxRounding
    }
    
    if (configs.textBoxImage) {
        DialoguePanel.style.backgroundImage = `url("img/ui/${configs.textBoxImage}")`
    }
    if (configs.textBoxImage) {
        DialoguePanel.style.backgroundSize = `${configs.textBoxImageSize}px`
    }
    if (configs.textBoxBottom) {
        DialoguePanel.style.bottom = `${configs.textBoxBottom}dvh`
    }
    if (configs.textBoxWidth) {
        DialoguePanel.style.minWidth = `${configs.textBoxWidth}dvw`
        DialoguePanel.style['margin-left'] = `${(100 - configs.textBoxWidth) / 2}dvw`
        DialoguePanel.style['margin-right'] = `${(100 - configs.textBoxWidth) / 2}dvw`
    }
    if (configs.textBoxHeight) {
        DialoguePanel.style.height = `${configs.textBoxHeight}dvh`
    }
    const LineText = document.getElementById('line-text')
    if (configs.textBoxFont) {
        LineText.style.fontFamily = configs.textBoxFont
    }
    if (configs.textBoxFontSize) {
        LineText.style.fontSize = `${configs.textBoxFontSize}em`
    }
    if (configs.textBoxFontColor) {
        LineText.style.color = configs.textBoxFontColor
    }
    if (configs.textBoxFontWeight) {
        LineText.style.fontWeight = configs.textBoxFontWeight
    }
    if (configs.textBoxFontOutline) {
        LineText.style['-webkit-text-stroke'] = configs.textBoxFontOutline
    }
    if (configs.textBoxRounding) {
        DialoguePanel.style.borderRadius = configs.textBoxRounding
    }
    if (configs.textBoxPadding) {
        LineText.style.padding = configs.textBoxPadding
    }
}

export default configLoader