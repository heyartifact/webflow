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
function getAnalyticsEventProperties(eventName, toggleTarget) {
    if (typeof getEventProperties !== 'undefined') {
        // eslint-disable-next-line no-undef
        return getEventProperties(eventName, toggleTarget)
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
    // Ensure the audio player and video audio do not play on top of each other.
    muteAllVideos()

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
    [...AUDIO_TOGGLES, ...VIDEO_TOGGLES].forEach((mediaToggle) => {
        const playIcon = mediaToggle.querySelector('[data-element=play]')
        const pauseIcon = mediaToggle.querySelector('[data-element=pause]')
        const unmuteIcon = mediaToggle.querySelector('[data-element=unmute]')
        const muteIcon = mediaToggle.querySelector('[data-element=mute]')

        if (playIcon) playIcon.setAttribute('display', 'block')
        if (pauseIcon) pauseIcon.setAttribute('display', 'none')
        if (unmuteIcon) unmuteIcon.setAttribute('display', 'block')
        if (muteIcon) muteIcon.setAttribute('display', 'none')
    })
}


/**
 * A helper function to toggle a video's mute state. Bind the trigger to this function so that the video selector can be
 * safely retrieved and the icon in the button can be changed.
 */
function toggleVideoMute() {
    const videoToggle = this

    // Ensure the audio player and video audio do not play on top of each other.
    PLAYER.pause()
    resetControllers()

    // If we add a case where the trigger's parent element does not also hold the video, this selector will need to be
    // revised.
    const video = $(videoToggle).siblings().find('video')
    const isMuted = video.prop('muted')
    video.prop('muted', !isMuted)

    this.querySelector('[data-element=unmute').setAttribute('display', isMuted ? 'none' : 'block')
    this.querySelector('[data-element=mute').setAttribute('display', isMuted ? 'block' : 'none')

    if (isMuted) {
        const eventName = 'Video Unmuted'
        video.currentTime = 0
        sendAnalyticsEvent(eventName, getAnalyticsEventProperties(eventName, this))
    }
}

function muteAllVideos() {
    $('video').each(function() {
        $(this).prop('muted', true)
    })
}
