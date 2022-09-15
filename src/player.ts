// Instantiate the PLAYER variable in the Webflow page's head since it is needed across multiple scripts.
player = document.querySelector('[data-element=audio-player]')
player.addEventListener('pause', resetControllers)

const AUDIO_TOGGLES = document.querySelectorAll('[data-element=player-toggle]')

AUDIO_TOGGLES.forEach((audioToggle) => {
    audioToggle.addEventListener('click', setPlayer.bind(audioToggle))
})

const VIDEO_TOGGLES = document.querySelectorAll('[data-element=video-toggle]')


function updateVideoToggleIcon(videoToggle: Element, isMuted: boolean) {
    videoToggle.querySelector('[data-element=unmute').setAttribute('display', isMuted ? 'block' : 'none')
    videoToggle.querySelector('[data-element=mute').setAttribute('display', isMuted ? 'none' : 'block')
}

VIDEO_TOGGLES.forEach(videoToggle => {
    videoToggle.addEventListener('click', toggleVideoMute.bind(videoToggle))
    const video = findAssociatedVideo(videoToggle)
    video.on('volumechange', (event) => updateVideoToggleIcon(videoToggle, event.target.muted))
})


// Helper to safely call a function declared in the analytics script that should be loaded.
function getAnalyticsEventProperties(eventName: string, toggleTarget: HTMLElement) {
    if (typeof getEventProperties !== 'undefined') {
        return getEventProperties(eventName, toggleTarget)
    } else {
        safelyCaptureMessage('`getEventProperties` was called before it was loaded.')
        return {}
    }
}


function sendAnalyticsEvent(eventName: string, eventProperties: EventProperties) {
    if (typeof sendEvent !== 'undefined') {
        sendEvent(eventName, eventProperties)
    } else {
        safelyCaptureMessage('`sendEvent` was called before it was loaded.')
    }
}


/**
 * Attempt to retrieve animation info, if it exists, and sync the audio player to the animation.
 */
function syncAudioPlayerAndAnimation() {
    if (typeof currentAnimationInfo !== 'undefined' && typeof ANIMATIONS !== 'undefined') {
        if (currentAnimationInfo.name in ANIMATIONS) {
            const animation = ANIMATIONS[currentAnimationInfo.name]
            if (player.querySelector('source').src === animation.expectedAudioSrc) {
                player.currentTime = ((
                    (new Date()).valueOf() - currentAnimationInfo.timeScrolledIntoView
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
async function setPlayer(this: HTMLElement) {
    // Ensure the audio player and video audio do not play on top of each other.
    muteAllVideos()

    const playUnmuteIconPlayer = this.querySelector('[data-element=play], [data-element=unmute]')
    const pauseMuteIconPlayer = this.querySelector('[data-element=pause], [data-element=mute]')
    const audioUrl = this.querySelector<HTMLElement>('[data-element=url]').innerText
    const playerSrc = player.querySelector('source').src

    if (playerSrc.length !== 1 && playerSrc === audioUrl) {
        if (!player.paused) {
            playUnmuteIconPlayer.setAttribute('display', 'block')
            pauseMuteIconPlayer.setAttribute('display', 'none')

            player.pause()
        } else {
            playUnmuteIconPlayer.setAttribute('display', 'none')
            pauseMuteIconPlayer.setAttribute('display', 'block')
            syncAudioPlayerAndAnimation()
            player.play()
        }
    } else {
        player.querySelector('source').src = audioUrl
        player.load()
        player.addEventListener(
            'canplay',
            async (_event) => {
                playUnmuteIconPlayer.setAttribute('display', 'none')
                await resetControllers()
                pauseMuteIconPlayer.setAttribute('display', 'block')
                playUnmuteIconPlayer.setAttribute('display', 'none')
                syncAudioPlayerAndAnimation()
                player.play()

                const eventName = 'Player Started'
                sendAnalyticsEvent(eventName, getAnalyticsEventProperties(eventName, this))
            },
            { once: true }
        )
    }
}

function resetControllers() {
    AUDIO_TOGGLES.forEach((audioToggle) => {
        // Note: The audio toggle buttons use either play/pause icons or mute/unmute icons, depending on whether or not
        // they autoplay muted or if the user has to take an action to start the audio.
        const playIcon = audioToggle.querySelector('[data-element=play]')
        const pauseIcon = audioToggle.querySelector('[data-element=pause]')
        const unmuteIcon = audioToggle.querySelector('[data-element=unmute]')
        const muteIcon = audioToggle.querySelector('[data-element=mute]')

        if (playIcon) playIcon.setAttribute('display', 'block')
        if (pauseIcon) pauseIcon.setAttribute('display', 'none')
        if (unmuteIcon) unmuteIcon.setAttribute('display', 'block')
        if (muteIcon) muteIcon.setAttribute('display', 'none')
    })
}


function findAssociatedVideo(videoToggle: Element) {
    // If we add a case where the trigger's parent element does not also hold the video, this selector will need to be
    // revised.
    const videos = $(videoToggle).parent().find('video')
    if (videos.length === 0) {
        safelyCaptureMessage('A video toggle button does not have an associated video.')
        return null
    } else if (videos.length > 1) {
        safelyCaptureMessage('Multiple videos were found associated with a video toggle button. Only the first video will be controlled by the button.', 'info')
    }
    return videos.first()
}


/**
 * A helper function to toggle a video's mute state. Bind the trigger to this function so that the video selector can be
 * safely retrieved and the icon in the button can be changed.
 * Videos on the page will autoplay on loop, so the buttons control the mute state of the video element.
 */
function toggleVideoMute(this: HTMLElement): void {
    // Ensure the audio player and video audio do not play on top of each other.
    player.pause()
    resetControllers()

    const video = findAssociatedVideo(this)
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
function muteAllVideos(excludedVideo: JQuery<HTMLElement> = null) {
    $('video').not(excludedVideo).each(function() {
        $(this).prop('muted', true)
    })
}
