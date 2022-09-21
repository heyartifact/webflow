/**
 * Optimization script, only used on the Kids landing page, that makes sure the hero background video is only loaded on desktop.
 * This will save mobile users from downloading between 3 and 6mb (depending on whether the browser uses mp4 or webm).
 */
const videoElement = `<div data-poster-url="https://assets.website-files.com/62824c4643d3b700b7f6aedc/62a21e0dac11349e608afa14_Artifact_HERO_BANNER_Kids-poster-00001.jpg" data-video-urls="https://assets.website-files.com/62824c4643d3b700b7f6aedc/62a21e0dac11349e608afa14_Artifact_HERO_BANNER_Kids-transcode.mp4,https://assets.website-files.com/62824c4643d3b700b7f6aedc/62a21e0dac11349e608afa14_Artifact_HERO_BANNER_Kids-transcode.webm" data-autoplay="true" data-loop="true" data-wf-ignore="true" data-beta-bgvideo-upgrade="false" class="background-video w-background-video w-background-video-atom">
   <video id="ce587d5b-de22-5404-9958-95fe58cd37c8-video" autoplay="" loop="" style="background-image:url(&quot;https://assets.website-files.com/62824c4643d3b700b7f6aedc/62a21e0dac11349e608afa14_Artifact_HERO_BANNER_Kids-poster-00001.jpg&quot;)" muted="" playsinline="" data-wf-ignore="true" data-object-fit="cover">
       <source src="https://assets.website-files.com/62824c4643d3b700b7f6aedc/62a21e0dac11349e608afa14_Artifact_HERO_BANNER_Kids-transcode.mp4" data-wf-ignore="true">
       <source src="https://assets.website-files.com/62824c4643d3b700b7f6aedc/62a21e0dac11349e608afa14_Artifact_HERO_BANNER_Kids-transcode.webm" data-wf-ignore="true">
   </video>
</div>`

const DESKTOP_BREAKPOINT = 991
const videoContainerId = 'background-cover-video-desktop'
const jqueryVideoContainerSelector = `#${videoContainerId}`

// Initialization: if the window initializes while on desktop, load the video element.
if (window.innerWidth > DESKTOP_BREAKPOINT && document.getElementById(videoContainerId).childElementCount == 0) {
    $(jqueryVideoContainerSelector).append(videoElement)
}

// Window resize listener: mount the video element on desktop, unmount it on mobile.
$(window).resize(function () {
    const width = window.innerWidth
    if (width > DESKTOP_BREAKPOINT) {
        if (document.getElementById(videoContainerId).childElementCount == 0) {
            $(jqueryVideoContainerSelector).append(videoElement)
        }
    } else {
        $(jqueryVideoContainerSelector).empty()
    }
})