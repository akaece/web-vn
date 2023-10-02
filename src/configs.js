const configs = {
  appTitle: 'Demo VN',
  startScene: 'DemoStart',

  /* Put any font families you want to use here. */
  fonts: [
    'Anton',
    'Patrick Hand SC',
  ],

  /* Main menu configs */
  mainMenuBackground: 'star-pattern.png',
  mainMenuBackgroundSize: 350,
  sidebarBackground: 'green-stones-pattern.jpg',
  sidebarBackgroundSize: 550,
  sidebarPosition: {
    top: 0,
    // bottom: 0,
    // left: 0,
    // right: 0,
  },
  sidebarTopOffset: 40,
  sidebarFont: `'Anton', sans-serif`,
  sidebarFontSize: 4,
  sidebarFontColor: 'white',
  sidebarFontOutline: `2px black`,
  sidebarButtonHoverSound: `button-bloop.mp3`,
  sidebarButtonClickSound: `button-click.mp3`,
  mainMenuLogoImage: `logo-placeholder.png`,
  mainMenuLogoPosition: {
    top: 10,
    // bottom: 0,
    // left: 0,
    right: 10,
  },
  mainMenuLogoSize: 40, // Width in screen %

  /* Game display configs */
  // speakerBoxImage: `speaker-box.png`,
  speakerBoxImageSize: 150,
  speakerBoxLeft: 15,
  speakerBoxBottom: 20,
  speakerBoxWidth: 12,
  speakerBoxHeight: 2,
  speakerBoxFont: `'Anton', sans-serif`,
  speakerBoxFontSize: 1.1,
  speakerBoxFontColor: 'whitesmoke',
  speakerBoxFontOutline: `1px black`,
  speakerBoxRounding: '10px',
  
  // promptBoxImage: `prompt-box.png`,
  promptBoxImageSize: 250,
  promptBoxRight: 15,
  promptBoxBottom: 20,
  promptBoxWidth: 15,
  promptBoxFont: `'Anton', sans-serif`,
  promptBoxFontSize: 2,
  promptBoxFontColor: 'whitesmoke',
  promptBoxFontOutline: `1px black`,
  promptBoxHoverFontOutline: `1px pink`,
  promptBoxRounding: '15px',

  textBoxImage: `diamonds-transparent.png`,
  textBoxImageSize: 250,
  textBoxBottom: 5,
  textBoxWidth: 75,
  textBoxHeight: 15,
  textBoxFont: `'Patrick Hand SC', cursive;`,
  textBoxFontSize: 1.5,
  textBoxFontWeight: 1000,
  textBoxFontColor: 'whitesmoke',
  textBoxFontOutline: `1px black`,
  textBoxRounding: '15px',
  textBoxPadding: .5,
}

export default configs