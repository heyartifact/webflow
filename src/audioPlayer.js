// Instantiate the PLAYER variable in the Webflow page's head since it is needed across multiple scripts.
PLAYER = document.querySelector('[data-element=audio-player]')
PLAYER.querySelector('source').src = '0'

const AUDIO_TOGGLES = document.querySelectorAll('[data-element=player-toggle]')

AUDIO_TOGGLES.forEach((audioToggle) => {
    audioToggle.addEventListener('click', setPlayer.bind(audioToggle))
})

const VIDEO_TOGGLES = document.querySelectorAll('[data-element=video-toggle]')

VIDEO_TOGGLES.forEach(videoToggle => {
    videoToggle.addEventListener('click', toggleVideoMute.bind(videoToggle))
})

// Helper to safely call a function declared in the analytics script that should be loaded.
function getAnalyticsEventProperties(eventName, audioToggle) {
    if (typeof getEventProperties !== 'undefined') {
        // eslint-disable-next-line no-undef
        return getEventProperties(eventName, audioToggle)
    } else {
        Sentry.captureMessage('`getEventProperties` was called before it was loaded.')
        return {}
    }
}

function sendAnalyticsEvent(eventName, eventProperties) {
    if (typeof sendEvent !== 'undefined') {
        // eslint-disable-next-line no-undef
        sendEvent(eventName, eventProperties)
    } else {
        Sentry.captureMessage('`sendEvent` was called before it was loaded.')
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
    }
}


/**
 * Sets loads the audio file based on the button that was clicked to start the audio player.
 *
 * Here is a sample audio player component that should be included on the page (note that this should be inside a
 * Webflow div with a class of `audio-wrapper` applied):
 *
 *  <audio class="audio-player" controls data-element="audio-player">
 *      <source src="" type="audio/mp3">
 *  </audio>
 */
async function setPlayer() {
    const audioToggle = this
    const playIconPlayer = audioToggle.querySelector('[data-element=play]')
    const pauseIconPlayer = audioToggle.querySelector(
        '[data-element=pause]'
    )
    const audioUrl = audioToggle.querySelector('[data-element=url]')
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
                sendAnalyticsEvent(eventName, getAnalyticsEventProperties(eventName, audioToggle))
            },
            { once: true }
        )
    }
}

function resetControllers() {
    AUDIO_TOGGLES.forEach((audioToggle) => {
        const playIconPlayer = audioToggle.querySelector(
            '[data-element=play]'
        )
        const pauseIconPlayer = audioToggle.querySelector(
            '[data-element=pause]'
        )
        playIconPlayer.setAttribute('display', 'block')
        pauseIconPlayer.setAttribute('display', 'none')
    })
}


/**
 * A helper function to toggle a video's mute state. Bind the trigger to this function so that the video selector can be
 * safely retrieved and the icon in the button can be changed.
 */
function toggleVideoMute() {
    const videoToggle = this

    // If we add a case where the video and its trigger are not siblings this selector will need to be revised.
    const video = $(videoToggle).siblings('video')
    const isMuted = video.prop('muted')
    video.prop('muted', !isMuted)

    this.querySelector('[data-element=unmute').setAttribute('display', isMuted ? 'none' : 'block')
    this.querySelector('[data-element=mute').setAttribute('display', isMuted ? 'block' : 'none')
}
