// Import the karaoke script file before this script is imported.
/* globals updateKaraoke */

// Save elements into global variables so they don't need to be queried from the DOM each animation frame.
PLAYER = document.querySelector('[data-element=audio-player]')
const HERO_VIDEO = document.querySelector<HTMLVideoElement>('.hero-george_video video')

// These values should be applied to the `data-animation` attribute of the element that triggers the animation.
const HERO_VIDEO_ANIMATION = 'hero-video'
const YOUR_LITTLE_ONE_ANIMATION = 'your-little-one'
const SAMPLE_QUESTION_PRIA_ANIMATION = 'sample-question-pria'

const ANIMATIONS: Record<AnimationName, AnimationInfo> = {
    [HERO_VIDEO_ANIMATION]: {
        duration: 129000,
        expectedAudioSrc: null,
        karaoke: null,
        progressBar: null,
        progressBarSelector: '.hero-mute-button_progress circle',
        startAnimation: heroAnimation,
        steps: []
    },
    /**
     * Sample question animations.
     * Manually set the utterance start time to 0 to ensure that the quote populates on page load, even before the audio
     * starts playing.
     * Each animation should have only one set of speakerElements with the key of `1`.
     * The speaker's id should also be `1`.
     * Leave the `container`, `quote`, and `progressBar` properties as null, they will need to be programmatically
     * retrieved.
     */
    [SAMPLE_QUESTION_PRIA_ANIMATION]: {
        cleanupAnimation: () => sampleQuestionAnimationCleanup(SAMPLE_QUESTION_PRIA_ANIMATION),
        duration: 9805,
        expectedAudioSrc: 'https://heyartifact-assets.s3.us-west-2.amazonaws.com/webflow/sample-questions/pria_what+has+she+taught+you.mp3',
        karaoke: {
            speakerElements: {
                1: {
                    container: null,
                    quote: null
                }
            },
            textVariant: 'h4',
            utterances: [{
                'start': 0,
                'end': 9310,
                'speaker': 1,
                'words': [
                    {'text': 'I\'m', 'start': 70, 'end': 202},
                    {'text': 'skipping', 'start': 226, 'end': 502},
                    {'text': 'ahead', 'start': 526, 'end': 714},
                    {'text': 'a', 'start': 752, 'end': 846},
                    {'text': 'little', 'start': 848, 'end': 1014},
                    {'text': 'bit,', 'start': 1052, 'end': 1326},
                    {'text': 'but', 'start': 1388, 'end': 1866},
                    {'text': 'what', 'start': 1988, 'end': 2310},
                    {'text': 'have', 'start': 2360, 'end': 2538},
                    {'text': 'you', 'start': 2564, 'end': 2682},
                    {'text': 'learned', 'start': 2696, 'end': 2902},
                    {'text': 'about', 'start': 2926, 'end': 3114},
                    {'text': 'parenting', 'start': 3152, 'end': 3850},
                    {'text': 'through', 'start': 3970, 'end': 4254},
                    {'text': 'Clementine', 'start': 4292, 'end': 4966},
                    {'text': 'specifically?', 'start': 5038, 'end': 5638},
                    {'text': 'I', 'start': 5674, 'end': 5766},
                    {'text': 'know', 'start': 5768, 'end': 5862},
                    {'text': 'you', 'start': 5876, 'end': 5982},
                    {'text': 'have', 'start': 5996, 'end': 6102},
                    {'text': 'two', 'start': 6116, 'end': 6294},
                    {'text': 'other', 'start': 6332, 'end': 6534},
                    {'text': 'kids,', 'start': 6572, 'end': 6882},
                    {'text': 'but', 'start': 6956, 'end': 7158},
                    {'text': 'what', 'start': 7184, 'end': 7338},
                    {'text': 'has', 'start': 7364, 'end': 7518},
                    {'text': 'she', 'start': 7544, 'end': 7734},
                    {'text': 'taught', 'start': 7772, 'end': 7978},
                    {'text': 'you', 'start': 8014, 'end': 8178},
                    {'text': 'about', 'start': 8204, 'end': 8394},
                    {'text': 'being', 'start': 8432, 'end': 8634},
                    {'text': 'a', 'start': 8672, 'end': 8802},
                    {'text': 'mom', 'start': 8816, 'end': 8958},
                    {'text': 'and', 'start': 8984, 'end': 9102},
                    {'text': 'a', 'start': 9116, 'end': 9222},
                    {'text': 'dad?', 'start': 9236, 'end': 9310}
                ]
            }],
            utterancesStartOffset: 0
        },
        progressBar: null,
        progressBarSelector: '',
        startAnimation: () => sampleQuestionAnimation(SAMPLE_QUESTION_PRIA_ANIMATION),
        steps: []
    },
    [YOUR_LITTLE_ONE_ANIMATION]: {
        duration: 44000,
        expectedAudioSrc: '',
        karaoke: {
            speakerElements: {
                1: {
                    container: document.querySelector('#your-little-one-karaoke-container .speaker-1-container'),
                    quote: document.querySelector('#your-little-one-karaoke-container .speaker-1-container .speaker-quote')
                },
                2: {
                    container: document.querySelector('#your-little-one-karaoke-container .speaker-2-container'),
                    quote: document.querySelector('#your-little-one-karaoke-container .speaker-2-container .speaker-quote')
                }
            },
            textVariant: 'subtitle-1',
            utterances: [
                {
                    'start': 10844,
                    'end': 11374,
                    'speaker': 1,
                    'words': [
                        {
                            'text': 'Peru?',
                            'start': 10844,
                            'end': 11374
                        }
                    ]
                },
                {
                    'start': 11482,
                    'end': 17238,
                    'speaker': 2,
                    'words': [
                        {'text': 'What', 'start': 11482, 'end': 11754},
                        {'text': 'was', 'start': 11792, 'end': 11922},
                        {'text': 'it', 'start': 11936, 'end': 12078},
                        {'text': 'about', 'start': 12104, 'end': 12402},
                        {'text': 'him', 'start': 12476, 'end': 12858},
                        {'text': 'from', 'start': 12944, 'end': 13158},
                        {'text': 'the', 'start': 13184, 'end': 13338},
                        {'text': 'window,', 'start': 13364, 'end': 13786},
                        {'text': 'from', 'start': 13858, 'end': 14058},
                        {'text': 'afar', 'start': 14084, 'end': 14758},
                        {'text': 'that', 'start': 14914, 'end': 15162},
                        {'text': 'made', 'start': 15176, 'end': 15282},
                        {'text': 'you', 'start': 15296, 'end': 15438},
                        {'text': 'realize,', 'start': 15464, 'end': 15898},
                        {'text': 'there\'s', 'start': 15994, 'end': 16186},
                        {'text': 'somebody', 'start': 16198, 'end': 16410},
                        {'text': 'I', 'start': 16460, 'end': 16566},
                        {'text': 'want', 'start': 16568, 'end': 16662},
                        {'text': 'to', 'start': 16676, 'end': 16746},
                        {'text': 'get', 'start': 16748, 'end': 16842},
                        {'text': 'to', 'start': 16856, 'end': 16926},
                        {'text': 'know.', 'start': 16928, 'end': 17238}
                    ]
                }
            ],
            utterancesStartOffset: 10838
        },
        progressBar: null,
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

const CURRENT_ANIMATION_INFO: CurrentAnimationInfo = {
    karaokeState: null,
    name: null,
    timeScrolledIntoView: null
}

let FAILED_KARAOKE_UPDATE_ATTEMPTS = 0


/**
 * Even with the correct import order and with the `defer` attribute applied, `updateKaraoke` may not be ready to be
 * invoked by the time the animation starts.
 */
function attemptUpdateKaraoke(karaokeAnimationInfo: KaraokeAnimationInfo, animationTime: number) {
    if (typeof updateKaraoke !== 'undefined') {
        updateKaraoke(karaokeAnimationInfo, animationTime)
    } else {
        FAILED_KARAOKE_UPDATE_ATTEMPTS++
        // Assuming the animation runs at 60 FPS, this will give about ten seconds of cushion before sending a Sentry
        // error.
        if (FAILED_KARAOKE_UPDATE_ATTEMPTS === 600) {
            Sentry.captureMessage('`updateKaraoke` was not loaded properly.', 'warning')
        }
    }
}


function setRadialProgressBar(animation: AnimationInfo, animationTime: number) {
    const audioProgress = animationTime / animation.duration
    const audioProgressBar = $<SVGCircleElement>(animation.progressBarSelector)
    const strokeOffset = (1 - audioProgress) * 2 * Math.PI * parseInt(audioProgressBar.attr('r'))
    audioProgressBar.css({ strokeDashoffset: strokeOffset })
}


function heroAnimation() {
    const animation = ANIMATIONS[HERO_VIDEO_ANIMATION]

    setRadialProgressBar(animation, HERO_VIDEO.currentTime * 1000)

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
        attemptUpdateKaraoke(animation.karaoke, animationTime)

        window.requestAnimationFrame(yourLittleOneAnimation)
    }
}


function sampleQuestionAnimation(animationName: AnimationName) {
    const animation = ANIMATIONS[animationName]
    const isAudioPlaying = !PLAYER.paused && (PLAYER.querySelector('source').src === animation.expectedAudioSrc)
    if (isAudioPlaying) {
        const animationTime = isAudioPlaying ? PLAYER.currentTime * 1000 : 0
        setRadialProgressBar(animation, animationTime)
        attemptUpdateKaraoke(animation.karaoke, animationTime)
        window.requestAnimationFrame(() => sampleQuestionAnimation(animationName))
    } else {
        animation.cleanupAnimation()
    }
}

// Set the animation back to the initial state.
function sampleQuestionAnimationCleanup(animationName: AnimationName) {
    const animation = ANIMATIONS[animationName]
    setRadialProgressBar(animation, 0)
    attemptUpdateKaraoke(animation.karaoke, 0)
    // TODO: Prevent this from overwriting CURRENT_ANIMATION_INFO.
}


// Trigger the animation to start when the play button is scrolled into view.
function onPlayButtonIntersection(entries: IntersectionObserverEntry[]) {
    const playButtonEntry = entries[0]
    const animationName = (playButtonEntry.target as HTMLElement).dataset['animation'] as AnimationName
    if (playButtonEntry.isIntersecting && animationName in ANIMATIONS) {
        // Start a new animation when it scrolls into view.
        CURRENT_ANIMATION_INFO.karaokeState = null
        CURRENT_ANIMATION_INFO.name = animationName
        let timeOffset = 0
        if (PLAYER.querySelector('source').src === ANIMATIONS[animationName].expectedAudioSrc && !PLAYER.paused) {
            timeOffset = PLAYER.currentTime * 1000
        }
        CURRENT_ANIMATION_INFO.timeScrolledIntoView = (new Date()).valueOf() - timeOffset
        ANIMATIONS[YOUR_LITTLE_ONE_ANIMATION].startAnimation()
    } else if (!playButtonEntry.isIntersecting && CURRENT_ANIMATION_INFO.name === animationName) {
        // Stop an animation when it scrolls out of view.
        CURRENT_ANIMATION_INFO.karaokeState = null
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

    const yourLittleOnePlayButton = document.querySelector('.your-little-one_conversation_button')
    observer.observe(yourLittleOnePlayButton)

    ANIMATIONS[YOUR_LITTLE_ONE_ANIMATION].expectedAudioSrc = yourLittleOnePlayButton.querySelector<HTMLElement>(
        '[data-element=url]'
    ).innerText

    const audioSourceToAnimationMap: Record<string, AnimationName> = {}
    const sampleQuestionsSlider = $('.sample-questions-slider');
    [SAMPLE_QUESTION_PRIA_ANIMATION].forEach((animationName: AnimationName) => {
        audioSourceToAnimationMap[ANIMATIONS[animationName].expectedAudioSrc] = animationName
        // The components for these animations are programmatically created from the CMS collection, so they cannot be
        // reliably found with a class or id. Use the audio URL to find the slide associated with this animation.
        const slide = sampleQuestionsSlider.find(
            `div[data-element='url']:contains('${ANIMATIONS[animationName].expectedAudioSrc}')`
        ).closest('.sample-questions-slide')

        ANIMATIONS[animationName].progressBar = slide.find('.sample-question_button-progress')[0]
        ANIMATIONS[animationName].karaoke.speakerElements[1].container = slide.find('.sample-question_quote-container')[0]
        ANIMATIONS[animationName].karaoke.speakerElements[1].quote = slide.find('.sample-question_quote')[0]

        // Set the initial state of the animation.
        ANIMATIONS[animationName].cleanupAnimation()
    })


    $(PLAYER).on('play', () => {
        const playerSource = $(PLAYER).find('source').attr('src')
        if (playerSource in audioSourceToAnimationMap) {
            sampleQuestionAnimation(audioSourceToAnimationMap[playerSource])
        }
    })
})()
