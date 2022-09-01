var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// Instantiate the PLAYER variable in the Webflow page's head since it is needed across multiple scripts.
player = document.querySelector('[data-element=audio-player]');
player.addEventListener('pause', resetControllers);
var AUDIO_TOGGLES = document.querySelectorAll('[data-element=player-toggle]');
AUDIO_TOGGLES.forEach(function (audioToggle) {
    audioToggle.addEventListener('click', setPlayer.bind(audioToggle));
});
var VIDEO_TOGGLES = document.querySelectorAll('[data-element=video-toggle]');
function updateVideoToggleIcon(videoToggle, isMuted) {
    videoToggle.querySelector('[data-element=unmute').setAttribute('display', isMuted ? 'block' : 'none');
    videoToggle.querySelector('[data-element=mute').setAttribute('display', isMuted ? 'none' : 'block');
}
VIDEO_TOGGLES.forEach(function (videoToggle) {
    videoToggle.addEventListener('click', toggleVideoMute.bind(videoToggle));
    var video = findAssociatedVideo(videoToggle);
    video.on('volumechange', function (event) { return updateVideoToggleIcon(videoToggle, event.target.muted); });
});
// Helper to safely call a function declared in the analytics script that should be loaded.
function getAnalyticsEventProperties(eventName, toggleTarget) {
    if (typeof getEventProperties !== 'undefined') {
        return getEventProperties(eventName, toggleTarget);
    }
    else {
        safelyCaptureMessage('`getEventProperties` was called before it was loaded.');
        return {};
    }
}
function sendAnalyticsEvent(eventName, eventProperties) {
    if (typeof sendEvent !== 'undefined') {
        sendEvent(eventName, eventProperties);
    }
    else {
        safelyCaptureMessage('`sendEvent` was called before it was loaded.');
    }
}
// Attempt to retrieve animation info, if it exists, and sync the audio player to the animation.
function syncAudioPlayerAndAnimation() {
    if (typeof CURRENT_ANIMATION_INFO !== 'undefined' && typeof ANIMATIONS !== 'undefined') {
        if (CURRENT_ANIMATION_INFO.name in ANIMATIONS) {
            var animation = ANIMATIONS[CURRENT_ANIMATION_INFO.name];
            if (player.querySelector('source').src === animation.expectedAudioSrc) {
                player.currentTime = (((new Date()).valueOf() - CURRENT_ANIMATION_INFO.timeScrolledIntoView) % animation.duration) / 1000;
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
function setPlayer() {
    return __awaiter(this, void 0, void 0, function () {
        var playUnmuteIconPlayer, pauseMuteIconPlayer, audioUrl, playerSrc;
        var _this = this;
        return __generator(this, function (_a) {
            // Ensure the audio player and video audio do not play on top of each other.
            muteAllVideos();
            playUnmuteIconPlayer = this.querySelector('[data-element=play], [data-element=unmute]');
            pauseMuteIconPlayer = this.querySelector('[data-element=pause], [data-element=mute]');
            audioUrl = this.querySelector('[data-element=url]').innerText;
            playerSrc = player.querySelector('source').src;
            if (playerSrc.length !== 1 && playerSrc === audioUrl) {
                if (!player.paused) {
                    playUnmuteIconPlayer.setAttribute('display', 'block');
                    pauseMuteIconPlayer.setAttribute('display', 'none');
                    player.pause();
                }
                else {
                    playUnmuteIconPlayer.setAttribute('display', 'none');
                    pauseMuteIconPlayer.setAttribute('display', 'block');
                    syncAudioPlayerAndAnimation();
                    player.play();
                }
            }
            else {
                player.querySelector('source').src = audioUrl;
                player.load();
                player.addEventListener('canplay', function (_event) { return __awaiter(_this, void 0, void 0, function () {
                    var eventName;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                playUnmuteIconPlayer.setAttribute('display', 'none');
                                return [4 /*yield*/, resetControllers()];
                            case 1:
                                _a.sent();
                                pauseMuteIconPlayer.setAttribute('display', 'block');
                                playUnmuteIconPlayer.setAttribute('display', 'none');
                                syncAudioPlayerAndAnimation();
                                player.play();
                                eventName = 'Player Started';
                                sendAnalyticsEvent(eventName, getAnalyticsEventProperties(eventName, this));
                                return [2 /*return*/];
                        }
                    });
                }); }, { once: true });
            }
            return [2 /*return*/];
        });
    });
}
function resetControllers() {
    AUDIO_TOGGLES.forEach(function (audioToggle) {
        // Note: The audio toggle buttons use either play/pause icons or mute/unmute icons, depending on whether or not
        // they autoplay muted or if the user has to take an action to start the audio.
        var playIcon = audioToggle.querySelector('[data-element=play]');
        var pauseIcon = audioToggle.querySelector('[data-element=pause]');
        var unmuteIcon = audioToggle.querySelector('[data-element=unmute]');
        var muteIcon = audioToggle.querySelector('[data-element=mute]');
        if (playIcon)
            playIcon.setAttribute('display', 'block');
        if (pauseIcon)
            pauseIcon.setAttribute('display', 'none');
        if (unmuteIcon)
            unmuteIcon.setAttribute('display', 'block');
        if (muteIcon)
            muteIcon.setAttribute('display', 'none');
    });
}
function findAssociatedVideo(videoToggle) {
    // If we add a case where the trigger's parent element does not also hold the video, this selector will need to be
    // revised.
    var videos = $(videoToggle).parent().find('video');
    if (videos.length === 0) {
        safelyCaptureMessage('A video toggle button does not have an associated video.');
        return null;
    }
    else if (videos.length > 1) {
        safelyCaptureMessage('Multiple videos were found associated with a video toggle button. Only the first video will be controlled by the button.', 'info');
    }
    return videos.first();
}
/**
 * A helper function to toggle a video's mute state. Bind the trigger to this function so that the video selector can be
 * safely retrieved and the icon in the button can be changed.
 * Videos on the page will autoplay on loop, so the buttons control the mute state of the video element.
 */
function toggleVideoMute() {
    // Ensure the audio player and video audio do not play on top of each other.
    player.pause();
    resetControllers();
    var video = findAssociatedVideo(this);
    // A Sentry alert has already been sent if the video is not found.
    if (!video)
        return null;
    var isMuted = video.prop('muted');
    video.prop('muted', !isMuted);
    if (isMuted) {
        // Make sure there is not audio from multiple videos playing simultaneously.
        muteAllVideos(video);
        var eventName = 'Video Unmuted';
        // Restart the video from the beginning.
        video.prop('currentTime', 0);
        sendAnalyticsEvent(eventName, getAnalyticsEventProperties(eventName, this));
    }
}
/**
 * Mute all videos on the page. A video can be passed as an argument to exclude it from this action, so when one video
 * is unmuted it can mute all other videos on the page.
 */
function muteAllVideos(excludedVideo) {
    if (excludedVideo === void 0) { excludedVideo = null; }
    $('video').not(excludedVideo).each(function () {
        $(this).prop('muted', true);
    });
}
