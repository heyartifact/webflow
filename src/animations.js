// Save elements into global variables so they don't need to be queried from the DOM each animation frame.
PLAYER = document.querySelector('[data-element=audio-player]')
const HERO_VIDEO = document.querySelector('.hero-george_video video')

// These values should be applied to the `data-animation` attribute of the element that triggers the animation.
const HERO_VIDEO_ANIMATION = 'hero-video'
const YOUR_LITTLE_ONE_ANIMATION = 'your-little-one'

const ANIMATIONS = {
    [HERO_VIDEO_ANIMATION]: {
        duration: 129000,
        expectedAudioSrc: null,
        progressBarSelector: '.hero-mute-button_progress circle',
        startAnimation: heroAnimation,
        steps: []
    },
    [YOUR_LITTLE_ONE_ANIMATION]: {
        duration: 44000,
        expectedAudioSrc: '',
        progressBarSelector: '.your-little-one_conversation_button_progress circle',
        startAnimation: yourLittleOneAnimation,
        steps: [
            {start: 500, end: 3000, id: 'ylo-text-1'},
            {start: 3000, end: 5250, id: 'ylo-text-2'},
            {start: 5500, end: 8000, id: 'ylo-text-3'},
            {start: 8000, end: 11000, id: 'ylo-text-4'},
            {start: 11000, end: 15500, id: 'ylo-text-5'},
            {start: 15500, end: 18750, id: 'ylo-text-6'},
            {start: 18750, end: 21750, id: 'ylo-text-7'},
            {start: 21750, end: 24500, id: 'ylo-text-8'},
            {start: 24500, end: 27000, id: 'ylo-text-9'},
            {start: 27000, end: 29500, id: 'ylo-text-10'},
            {start: 29500, end: 33000, id: 'ylo-text-11'},
            {start: 33000, end: 35000, id: 'ylo-text-12'},
            {start: 35000, end: 39000, id: 'ylo-text-13'}
        ]
    }
}

const CURRENT_ANIMATION_INFO = {
    name: null,
    timeScrolledIntoView: null
}


function setRadialProgressBar(animation, animationTime) {
    const audioProgress = animationTime / animation.duration
    const audioProgressBar = $(animation.progressBarSelector)
    const strokeOffset = (1 - audioProgress) * 2 * Math.PI * audioProgressBar.attr('r')
    audioProgressBar.css({ strokeDashoffset: strokeOffset })
}


function heroAnimation() {
    const animation = ANIMATIONS[HERO_VIDEO_ANIMATION]

    setRadialProgressBar(animation, HERO_VIDEO.currentTime)

    window.requestAnimationFrame(heroAnimation)
}


function yourLittleOneAnimation() {
    if (CURRENT_ANIMATION_INFO.name === YOUR_LITTLE_ONE_ANIMATION) {
        const animation = ANIMATIONS[YOUR_LITTLE_ONE_ANIMATION]
        const isAudioPlaying = !PLAYER.paused && (PLAYER.querySelector('source').src === animation.expectedAudioSrc)

        // animationTime represents the current progress into the animation.
        // If the appropriate audio is playing, animationTime is the number of milliseconds from the player's
        // currentTime.
        // Otherwise, animationTime is the number of milliseconds since the animation was scrolled into view (and using
        // the modulo operator to account for looping animations).
        const animationTime = (
            isAudioPlaying ?
                PLAYER.currentTime * 1000 :
                ((new Date()).valueOf() - CURRENT_ANIMATION_INFO.timeScrolledIntoView) % animation.duration
        )

        for (const step of animation.steps) {
            const element = document.getElementById(step.id)
            if (animationTime >= step.start && animationTime < step.end) {
                element.style.opacity = '1'
            } else {
                element.style.opacity = '0'
            }
        }

        setRadialProgressBar(animation, animationTime)

        window.requestAnimationFrame(yourLittleOneAnimation)
    }
}


// Trigger the animation to start when the play button is scrolled into view.
function onPlayButtonIntersection(entries) {
    const playButtonEntry = entries[0]
    const animationName = playButtonEntry.target.dataset['animation']
    if (playButtonEntry.isIntersecting && animationName in ANIMATIONS) {
        CURRENT_ANIMATION_INFO.name = animationName
        let timeOffset = 0
        if (PLAYER.querySelector('source').src === ANIMATIONS[animationName].expectedAudioSrc && !PLAYER.paused) {
            timeOffset = PLAYER.currentTime * 1000
        }
        CURRENT_ANIMATION_INFO.timeScrolledIntoView = (new Date()).valueOf() - timeOffset
        ANIMATIONS[YOUR_LITTLE_ONE_ANIMATION].startAnimation()
    } else if (CURRENT_ANIMATION_INFO.name === animationName) {
        CURRENT_ANIMATION_INFO.name = null
        CURRENT_ANIMATION_INFO.timeScrolledIntoView = null
    }
}

// Set up the animations.
(() => {
    heroAnimation()

    const observer = new IntersectionObserver(onPlayButtonIntersection, {
        root: null,
        threshold: 0.5
    })

    // TODO: Finish the your-little-one block before enabling this animation.
    // const yourLittleOnePlayButton = document.querySelector('.your-little-one_conversation_button')
    // observer.observe(yourLittleOnePlayButton)

    // ANIMATIONS[YOUR_LITTLE_ONE_ANIMATION].expectedAudioSrc = yourLittleOnePlayButton.querySelector(
    //     '[data-element=url]'
    // ).innerText
})()
