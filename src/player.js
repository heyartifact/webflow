// Instantiate the PLAYER variable in the Webflow page's head since it is needed across multiple scripts.
PLAYER = document.querySelector('[data-element=audio-player]')

const AUDIO_TOGGLES = document.querySelectorAll('[data-element=player-toggle]')

AUDIO_TOGGLES.forEach((audioToggle) => {
    audioToggle.addEventListener('click', setPlayer.bind(audioToggle))
})

const VIDEO_TOGGLES = document.querySelectorAll('[data-element=video-toggle]')


function updateVideoToggleIcon(videoToggle, isMuted) {
    videoToggle.querySelector('[data-element=unmute').setAttribute('display', isMuted ? 'block' : 'none')
    videoToggle.querySelector('[data-element=mute').setAttribute('display', isMuted ? 'none' : 'block')
}

VIDEO_TOGGLES.forEach(videoToggle => {
    videoToggle.addEventListener('click', toggleVideoMute.bind(videoToggle))
    const video = findAssociatedVideo(videoToggle)
    video.on('volumechange', (event) => updateVideoToggleIcon(videoToggle, event.target.muted))
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
    const playUnmuteIconPlayer = audioToggle.querySelector('[data-element=play], [data-element=unmute]')
    const pauseMuteIconPlayer = audioToggle.querySelector('[data-element=pause], [data-element=mute]')
    const audioUrl = audioToggle.querySelector('[data-element=url]').innerText
    const playerSrc = PLAYER.querySelector('source').src

    if (playerSrc.length !== 1 && playerSrc === audioUrl) {
        if (!PLAYER.paused) {
            playUnmuteIconPlayer.setAttribute('display', 'block')
            pauseMuteIconPlayer.setAttribute('display', 'none')

            PLAYER.pause()
        } else {
            playUnmuteIconPlayer.setAttribute('display', 'none')
            pauseMuteIconPlayer.setAttribute('display', 'block')
            syncAudioPlayerAndAnimation()
            PLAYER.play()
        }
    } else {
        PLAYER.querySelector('source').src = audioUrl
        PLAYER.load()
        PLAYER.addEventListener(
            'canplay',
            async (_event) => {
                playUnmuteIconPlayer.setAttribute('display', 'none')
                await resetControllers()
                pauseMuteIconPlayer.setAttribute('display', 'block')
                playUnmuteIconPlayer.setAttribute('display', 'none')
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
    AUDIO_TOGGLES.forEach((mediaToggle) => {
        // Note: The audio toggle buttons use either play/pause icons or mute/unmute icons, depending on whether or not
        // they autoplay muted or if the user has to take an action to start the audio.
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


function findAssociatedVideo(videoToggle) {
    // If we add a case where the trigger's parent element does not also hold the video, this selector will need to be
    // revised.
    const videos = $(videoToggle).parent().find('video')
    if (videos.length === 0) {
        Sentry.captureMessage('A video toggle button does not have an associated video.')
        return null
    } else if (videos.length > 1) {
        Sentry.captureMessage('Multiple videos were found associated with a video toggle button. Only the first video will be controlled by the button.', {
            level: 'info'
        })
    }
    return videos.first()
}


/**
 * A helper function to toggle a video's mute state. Bind the trigger to this function so that the video selector can be
 * safely retrieved and the icon in the button can be changed.
 * Videos on the page will autoplay on loop, so the buttons control the mute state of the video element.
 */
function toggleVideoMute() {
    const videoToggle = this

    // Ensure the audio player and video audio do not play on top of each other.
    PLAYER.pause()
    resetControllers()

    const video = findAssociatedVideo(videoToggle)
    // A Sentry alert has already been sent if the video is not found.
    if (!video) return null

    const isMuted = video.prop('muted')
    video.prop('muted', !isMuted)

    if (isMuted) {
        // Make sure there is not audio from multiple videos playing simultaneously.
        muteAllVideos(video)

        const eventName = 'Video Unmuted'
        // Restart the video from the beginning.
        video.prop('currentTime', 0)
        sendAnalyticsEvent(eventName, getAnalyticsEventProperties(eventName, this))
    }
}


/**
 * Mute all videos on the page. A video can be passed as an argument to exclude it from this action, so when one video
 * is unmuted it can mute all other videos on the page.
 */
function muteAllVideos(excludedVideo=null) {
    $('video').not(excludedVideo).each(function() {
        $(this).prop('muted', true)
    })
}
