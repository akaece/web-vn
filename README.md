# web-vn
A JS toolkit for developing VNs that are playable in the browser.

## Setup
1. Install `git` and clone the repository.
2. Install [Node](https://nodejs.org/en/download/current).
3. Enter the repo directory and execute `npm install`.
4. To run your project locally, execute `npm run dev --host`.
5. Click the link that appears to open it in your browser.

## Customization

### Content
 * The script for the demo that will begin playing by default is [here](https://github.com/akaece/web-vn/blob/main/src/content/Demo.js). It's recommended that you follow along in the script as it plays to see what the main functions are.
 * When you're ready to write your own script, copy Template.js in `src/content/`, and write your scenes in the new file.
    * You can keep your scenes in as many sub-directories and files as you like to keep your scenes organized.
 * Any images and sounds your project needs can go in the appropriate sub-folders of `public/img` and `public/audio`.
 * Check out the documentation below for an explanation of the different functions you can call in your scripts.

### Configurations
 * You can customize the look and feel of the UI by updating `src/configs.js` and adding files to `public/img/ui`.
 * TBD: Documentation for each config option.
    * Hopefully, most of them are self-explanatory enough for now.

## Script Functions
Below is a list of the different functions your script may call.
 * Note that these functions, unless otherwise specified, are `async`. That just means that you can specify whether you want your script to wait for them to finish before continuing by putting `await` in front of them. See [the demo script](https://github.com/akaece/web-vn/blob/main/src/content/Demo.js) for some examples of how you can control the timing of different events to happen one-by-one or all at once.

Any awaitable function will have an optional parameter called `delay`, which is a number of seconds that the game will wait before executing that command.

| Command | Description | Optional Parameters | Notes |
| --- | --- | --- | --- |
| `g.showText(text, options)` | Displays text in the game's main text box. | speaker: A string of text or a character identifier. | `text` may be a string or an array of strings. If it's an array, they will be sent in sequence. |
| `g.setSpeaker(speaker)` | Sets the default speaker, for display in the speaker box. | | Not awaitable; always executed immediately. |
| `g.playSound(soundFile, options)` | Plays an audio file. | loop: `true` if you want the sound to play repeatedly | If awaited, execution will continue at the end of the file. (Unless loop is true, in which case, execution continues immediately.) |
| `g.stopSound(soundFile)` | Stops an audio file from playing. | | |
| `g.setBackground(backgroundImage, options)` | Sets a background image file as the active background. | transition: `fade` to fade in, `slide` to slide in. <br /><br /> direction: The direction the background will slide in from, if `transition: 'slide'` is given. (`up`, `down`, `left`, or `right`.) <br /><br /> speed: The time (in seconds) that a specified transition should take. | |
| `g.showCharacter(character, options)` | Adds a specified character's portrait to the scene. | transition: `fade` to fade in, `slide` to slide in. <br /><br /> direction: The direction the portrait will slide in from, if `transition: 'slide'` is given. (`up`, `down`, `left`, or `right`.) <br /><br /> speed: The time (in seconds) that a specified transition should take. <br /><br /> expression: The expression that the character should appear as. | |
| `g.setExpression(character, expression, options)` | Changes a character's portrait to another expression. | transition: `fade` if the portrait should fade slowly instead of instantly changing. <br /><br /> speed: The speed (in seconds) that a specified transition should take. <br /><br /> level: Controls whether a portrait will appear over or under others. 0 is the default level. | |
| `g.adjustCharacter(character, options)` | Updates a character's portrait on the screen. | speed: The time (in seconds) that a specified transition should take. <br /><br /> level: Controls whether a portrait will appear over or under others. 0 is the default level. <br /><br /> scale: The new scale of the portrait, specified as a ratio of its current scale. <br /><br /> position: The new position of the portrait, given in distances from the edges of the screen. Specified as an object with `top`, `bottom`, `left`, and `right` fields. | Each `position` object field is optional. For example, to move a portrait to the right side of the screen, you only need to specify `position: {right: 0}` |
| `g.focusOn(characters, options)` | "Focuses" on a character or multiple characters, shrinking and fading other characters. | speed: The time (in seconds) that focusing should take. <br /><br /> scale: How much the in-focus characters are scaled up relative to the out-of-focus ones. <br /><br /> opacity: The new opacity for out-of-focus characters. | The effects of focus on all characters can be removed by calling `g.focusOn(null)` |
| `g.prompt(choices)` | Prompts the player with an array of choices. When the player clicks one, the corresponding scene is selected. | | Choices are specified as arrays - for example, `['Choice 1', 'DemoOption1']` will play the scene DemoOption1 when the player clicks "Choice 1". |
| `g.play(scene)` | Immediately begins playing the specified scene. | | This should almost always come at the end of another scene function. |
| `g.setFlag(name, value)` | Sets a 'flag' value that will be saved and can be referenced later. | | Not awaitable; always executed immediately. |
| `g.getFlag(name)` | Returns a 'flag' value that was previously saved. | | Not awaitable; always executed immediately. |




## Packaging & Deployment
TBD: Include instructions for uploading packages to common web targets (itch, gh pages).
TBD: Instructions for generating executable version for Steam & other storefronts.

