const PLAYER = document.querySelector('[data-element=audio-player]')
PLAYER.querySelector('source').src = '0'

const AUDIO_TOGGLES = document.querySelectorAll('[data-element=player-toggle]')

AUDIO_TOGGLES.forEach((podcastTrigger) => {
    podcastTrigger.addEventListener('click', setPlayer.bind(podcastTrigger))
})

// Helper to call a function declared in another JS file that should be loaded.
function getAnalyticsEventProperties(eventName, dataset, podcastTrigger) {
    if (typeof getEventProperties !== 'undefined') {
        // eslint-disable-next-line no-undef
        return getEventProperties(eventName, dataset, podcastTrigger)
    } else {
        console.warn('getEventProperties function not loaded!')
        return {}
    }
}

// Attempt to retrieve animation info, if it exists, and sync the audio player to the animation.
function syncAudioPlayerAndAnimation() {
    if (typeof CURRENT_ANIMATION_INFO !== 'undefined' && typeof ANIMATIONS !== 'undefined') {
        // eslint-disable-next-line no-undef
        if (CURRENT_ANIMATION_INFO.name in ANIMATIONS) {
            // eslint-disable-next-line no-undef
            const animation = ANIMATIONS[CURRENT_ANIMATION_INFO.name]
            if (PLAYER.querySelector('source').src === animation.expectedAudioSrc) {
                PLAYER.currentTime = ((
                    // eslint-disable-next-line no-undef
                    (new Date()).valueOf() - CURRENT_ANIMATION_INFO.timeScrolledIntoView
                ) % animation.duration) / 1000
            }
        }
    } else {
        console.warn('There is no animation loaded on this page.')
    }
}

async function setPlayer() {
    const podcastTrigger = this
    const playIconPlayer = podcastTrigger.querySelector('[data-element=play]')
    const pauseIconPlayer = podcastTrigger.querySelector(
        '[data-element=pause]'
    )
    const audioUrl = podcastTrigger.querySelector('[data-element=url]')
        .innerText
    const playerSrc = PLAYER.querySelector('source').src

    if (playerSrc.length !== 1 && playerSrc === audioUrl) {
        if (!PLAYER.paused) {
            playIconPlayer.setAttribute('display', 'block')
            pauseIconPlayer.setAttribute('display', 'none')

            PLAYER.pause()
        } else {
            playIconPlayer.setAttribute('display', 'none')
            pauseIconPlayer.setAttribute('display', 'block')
            syncAudioPlayerAndAnimation()
            PLAYER.play()
        }
    } else {
        PLAYER.querySelector('source').src = audioUrl
        PLAYER.load()
        PLAYER.addEventListener(
            'canplay',
            async (_event) => {
                playIconPlayer.setAttribute('display', 'none')
                await resetControllers()
                pauseIconPlayer.setAttribute('display', 'block')
                playIconPlayer.setAttribute('display', 'none')
                syncAudioPlayerAndAnimation()
                PLAYER.play()

                const eventName = 'Player Started'
                const dataset = podcastTrigger.dataset
                sendEvent(eventName, getAnalyticsEventProperties(eventName, dataset, podcastTrigger))
            },
            { once: true }
        )
    }
}

function resetControllers() {
    AUDIO_TOGGLES.forEach((podcastTrigger) => {
        const playIconPlayer = podcastTrigger.querySelector(
            '[data-element=play]'
        )
        const pauseIconPlayer = podcastTrigger.querySelector(
            '[data-element=pause]'
        )
        playIconPlayer.setAttribute('display', 'block')
        pauseIconPlayer.setAttribute('display', 'none')
    })
}
