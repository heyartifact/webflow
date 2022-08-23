// Import the karaoke script file before this script is imported.
/* globals updateKaraoke */
var _a;
// Save elements into global variables so they don't need to be queried from the DOM each animation frame.
PLAYER = document.querySelector('[data-element=audio-player]');
var HERO_VIDEO = document.querySelector('.hero-george_video video');
// These values should be applied to the `data-animation` attribute of the element that triggers the animation.
var HERO_VIDEO_ANIMATION = 'hero-video';
var YOUR_LITTLE_ONE_ANIMATION = 'your-little-one';
var ANIMATIONS = (_a = {},
    _a[HERO_VIDEO_ANIMATION] = {
        duration: 129000,
        expectedAudioSrc: null,
        karaoke: null,
        progressBarSelector: '.hero-mute-button_progress circle',
        startAnimation: heroAnimation,
        steps: []
    },
    _a[YOUR_LITTLE_ONE_ANIMATION] = {
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
                        { 'text': 'What', 'start': 11482, 'end': 11754 },
                        { 'text': 'was', 'start': 11792, 'end': 11922 },
                        { 'text': 'it', 'start': 11936, 'end': 12078 },
                        { 'text': 'about', 'start': 12104, 'end': 12402 },
                        { 'text': 'him', 'start': 12476, 'end': 12858 },
                        { 'text': 'from', 'start': 12944, 'end': 13158 },
                        { 'text': 'the', 'start': 13184, 'end': 13338 },
                        { 'text': 'window,', 'start': 13364, 'end': 13786 },
                        { 'text': 'from', 'start': 13858, 'end': 14058 },
                        { 'text': 'afar', 'start': 14084, 'end': 14758 },
                        { 'text': 'that', 'start': 14914, 'end': 15162 },
                        { 'text': 'made', 'start': 15176, 'end': 15282 },
                        { 'text': 'you', 'start': 15296, 'end': 15438 },
                        { 'text': 'realize,', 'start': 15464, 'end': 15898 },
                        { 'text': 'there\'s', 'start': 15994, 'end': 16186 },
                        { 'text': 'somebody', 'start': 16198, 'end': 16410 },
                        { 'text': 'I', 'start': 16460, 'end': 16566 },
                        { 'text': 'want', 'start': 16568, 'end': 16662 },
                        { 'text': 'to', 'start': 16676, 'end': 16746 },
                        { 'text': 'get', 'start': 16748, 'end': 16842 },
                        { 'text': 'to', 'start': 16856, 'end': 16926 },
                        { 'text': 'know.', 'start': 16928, 'end': 17238 }
                    ]
                }
            ],
            utterancesStartOffset: 10838
        },
        progressBarSelector: '.your-little-one_conversation_button_progress circle',
        startAnimation: yourLittleOneAnimation,
        steps: [
            { start: 500, end: 3000, id: 'ylo-text-1' },
            { start: 3000, end: 5250, id: 'ylo-text-2' },
            { start: 5500, end: 8000, id: 'ylo-text-3' },
            { start: 8000, end: 11000, id: 'ylo-text-4' },
            { start: 11000, end: 15500, id: 'ylo-text-5' },
            { start: 15500, end: 18750, id: 'ylo-text-6' },
            { start: 18750, end: 21750, id: 'ylo-text-7' },
            { start: 21750, end: 24500, id: 'ylo-text-8' },
            { start: 24500, end: 27000, id: 'ylo-text-9' },
            { start: 27000, end: 29500, id: 'ylo-text-10' },
            { start: 29500, end: 33000, id: 'ylo-text-11' },
            { start: 33000, end: 35000, id: 'ylo-text-12' },
            { start: 35000, end: 39000, id: 'ylo-text-13' }
        ]
    },
    _a);
var CURRENT_ANIMATION_INFO = {
    karaokeState: null,
    name: null,
    timeScrolledIntoView: null
};
var FAILED_KARAOKE_UPDATE_ATTEMPTS = 0;
/**
 * Even with the correct import order and with the `defer` attribute applied, `updateKaraoke` may not be ready to be
 * invoked by the time the animation starts.
 */
function attemptUpdateKaraoke(karaokeAnimationInfo, animationTime) {
    if (typeof updateKaraoke !== 'undefined') {
        updateKaraoke(karaokeAnimationInfo, animationTime);
    }
    else {
        FAILED_KARAOKE_UPDATE_ATTEMPTS++;
        // Assuming the animation runs at 60 FPS, this will give about a second of cushion before sending a Sentry
        // error.
        if (FAILED_KARAOKE_UPDATE_ATTEMPTS === 60) {
            Sentry.captureMessage('`updateKaraoke` was not loaded properly.');
        }
    }
}
function setRadialProgressBar(animation, animationTime) {
    var audioProgress = animationTime / animation.duration;
    var audioProgressBar = $(animation.progressBarSelector);
    var strokeOffset = (1 - audioProgress) * 2 * Math.PI * parseInt(audioProgressBar.attr('r'));
    audioProgressBar.css({ strokeDashoffset: strokeOffset });
}
function heroAnimation() {
    var animation = ANIMATIONS[HERO_VIDEO_ANIMATION];
    setRadialProgressBar(animation, HERO_VIDEO.currentTime * 1000);
    window.requestAnimationFrame(heroAnimation);
}
function yourLittleOneAnimation() {
    if (CURRENT_ANIMATION_INFO.name === YOUR_LITTLE_ONE_ANIMATION) {
        var animation = ANIMATIONS[YOUR_LITTLE_ONE_ANIMATION];
        var isAudioPlaying = !PLAYER.paused && (PLAYER.querySelector('source').src === animation.expectedAudioSrc);
        // animationTime represents the current progress into the animation.
        // If the appropriate audio is playing, animationTime is the number of milliseconds from the player's
        // currentTime.
        // Otherwise, animationTime is the number of milliseconds since the animation was scrolled into view (and using
        // the modulo operator to account for looping animations).
        var animationTime = (isAudioPlaying ?
            PLAYER.currentTime * 1000 :
            ((new Date()).valueOf() - CURRENT_ANIMATION_INFO.timeScrolledIntoView) % animation.duration);
        for (var _i = 0, _a = animation.steps; _i < _a.length; _i++) {
            var step = _a[_i];
            var element = document.getElementById(step.id);
            if (animationTime >= step.start && animationTime < step.end) {
                element.style.opacity = '1';
            }
            else {
                element.style.opacity = '0';
            }
        }
        setRadialProgressBar(animation, animationTime);
        attemptUpdateKaraoke(animation.karaoke, animationTime);
        window.requestAnimationFrame(yourLittleOneAnimation);
    }
}
// Trigger the animation to start when the play button is scrolled into view.
function onPlayButtonIntersection(entries) {
    var playButtonEntry = entries[0];
    var animationName = playButtonEntry.target.dataset['animation'];
    if (playButtonEntry.isIntersecting && animationName in ANIMATIONS) {
        // Start a new animation when it scrolls into view.
        CURRENT_ANIMATION_INFO.karaokeState = null;
        CURRENT_ANIMATION_INFO.name = animationName;
        var timeOffset = 0;
        if (PLAYER.querySelector('source').src === ANIMATIONS[animationName].expectedAudioSrc && !PLAYER.paused) {
            timeOffset = PLAYER.currentTime * 1000;
        }
        CURRENT_ANIMATION_INFO.timeScrolledIntoView = (new Date()).valueOf() - timeOffset;
        ANIMATIONS[YOUR_LITTLE_ONE_ANIMATION].startAnimation();
    }
    else if (!playButtonEntry.isIntersecting && CURRENT_ANIMATION_INFO.name === animationName) {
        // Stop an animation when it scrolls out of view.
        CURRENT_ANIMATION_INFO.karaokeState = null;
        CURRENT_ANIMATION_INFO.name = null;
        CURRENT_ANIMATION_INFO.timeScrolledIntoView = null;
    }
}
// Set up the animations.
(function () {
    heroAnimation();
    var observer = new IntersectionObserver(onPlayButtonIntersection, {
        root: null,
        threshold: 0.5
    });
    var yourLittleOnePlayButton = document.querySelector('.your-little-one_conversation_button');
    observer.observe(yourLittleOnePlayButton);
    ANIMATIONS[YOUR_LITTLE_ONE_ANIMATION].expectedAudioSrc = yourLittleOnePlayButton.querySelector('[data-element=url]').innerText;
})();
