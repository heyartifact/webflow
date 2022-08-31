// Import the karaoke script file before this script is imported.
/* globals updateKaraoke */
var _a;
// Save elements into global variables so they don't need to be queried from the DOM each animation frame.
PLAYER = document.querySelector('[data-element=audio-player]');
var SAMPLE_QUESTION_ANNA_ANIMATION = 'sample-question-anna';
var SAMPLE_QUESTION_GEORGE_ANIMATION = 'sample-question-george';
var SAMPLE_QUESTION_JULIE_ANIMATION = 'sample-question-julie';
var SAMPLE_QUESTION_MIKE_ANIMATION = 'sample-question-mike';
var SAMPLE_QUESTION_PRIA_ANIMATION = 'sample-question-pria';
var SAMPLE_QUESTION_RUTHIE_ANIMATION = 'sample-question-ruthie';
var SAMPLE_QUESTION_ANIMATIONS = [
    SAMPLE_QUESTION_ANNA_ANIMATION, SAMPLE_QUESTION_GEORGE_ANIMATION, SAMPLE_QUESTION_JULIE_ANIMATION,
    SAMPLE_QUESTION_MIKE_ANIMATION, SAMPLE_QUESTION_PRIA_ANIMATION, SAMPLE_QUESTION_RUTHIE_ANIMATION
];
/**
 * All durations in the ANIMATIONS object are in milliseconds.
 *
 * For karaoke animations:
 *      The keys in the `speakerElements` object should match the speaker ids in the utterances.
 */
var ANIMATIONS = (_a = {},
    /**
     * Sample question animations.
     * Manually set the utterance start time to 0 to ensure that the quote populates on page load, even before the audio
     * starts playing.
     * Leave the `container`, `quote`, and `progressBar` properties as null, they will need to be programmatically
     * retrieved.
     */
    _a[SAMPLE_QUESTION_ANNA_ANIMATION] = {
        cleanupAnimation: function () { return sampleQuestionAnimationCleanup(SAMPLE_QUESTION_ANNA_ANIMATION); },
        duration: 7405,
        expectedAudioSrc: 'https://heyartifact-assets.s3.us-west-2.amazonaws.com/webflow/sample-questions/anna_the+mother+you+want+to+be.mp3',
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
                    'end': 6480,
                    'speaker': 1,
                    'words': [
                        { 'text': 'And', 'start': 430, 'end': 558 },
                        { 'text': 'so', 'start': 584, 'end': 882 },
                        { 'text': 'what', 'start': 956, 'end': 1158 },
                        { 'text': 'is', 'start': 1184, 'end': 1374 },
                        { 'text': 'that', 'start': 1412, 'end': 1578 },
                        { 'text': 'exactly?', 'start': 1604, 'end': 1902 },
                        { 'text': 'What', 'start': 1976, 'end': 2142 },
                        { 'text': 'does', 'start': 2156, 'end': 2262 },
                        { 'text': 'that', 'start': 2276, 'end': 2418 },
                        { 'text': 'mean?', 'start': 2444, 'end': 2598 },
                        { 'text': 'Being', 'start': 2624, 'end': 2778 },
                        { 'text': 'the', 'start': 2804, 'end': 2922 },
                        { 'text': 'mother', 'start': 2936, 'end': 3178 },
                        { 'text': 'you', 'start': 3214, 'end': 3342 },
                        { 'text': 'want', 'start': 3356, 'end': 3498 },
                        { 'text': 'to', 'start': 3524, 'end': 3678 },
                        { 'text': 'be?', 'start': 3704, 'end': 4280 },
                        { 'text': 'Could', 'start': 5450, 'end': 5778 },
                        { 'text': 'you', 'start': 5804, 'end': 5958 },
                        { 'text': 'give', 'start': 5984, 'end': 6138 },
                        { 'text': 'me', 'start': 6164, 'end': 6282 },
                        { 'text': 'an', 'start': 6296, 'end': 6402 },
                        { 'text': 'example?', 'start': 6416, 'end': 6480 }
                    ]
                }],
            utterancesStartOffset: 0
        },
        progressBar: null,
        startAnimation: function () { return sampleQuestionAnimation(SAMPLE_QUESTION_ANNA_ANIMATION); }
    },
    _a[SAMPLE_QUESTION_GEORGE_ANIMATION] = {
        cleanupAnimation: function () { return sampleQuestionAnimationCleanup(SAMPLE_QUESTION_GEORGE_ANIMATION); },
        duration: 18781,
        expectedAudioSrc: 'https://heyartifact-assets.s3.us-west-2.amazonaws.com/webflow/sample-questions/george_physical.mp3',
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
                    'end': 18420,
                    'speaker': 1,
                    'words': [
                        { 'text': 'One', 'start': 190, 'end': 282 },
                        { 'text': 'thing', 'start': 296, 'end': 402 },
                        { 'text': 'that', 'start': 416, 'end': 738 },
                        { 'text': 'just', 'start': 824, 'end': 1146 },
                        { 'text': 'speaking', 'start': 1208, 'end': 1434 },
                        { 'text': 'personally', 'start': 1472, 'end': 1798 },
                        { 'text': 'when', 'start': 1834, 'end': 1962 },
                        { 'text': 'I', 'start': 1976, 'end': 2082 },
                        { 'text': 'became', 'start': 2096, 'end': 2278 },
                        { 'text': 'a', 'start': 2314, 'end': 2406 },
                        { 'text': 'parent', 'start': 2408, 'end': 2682 },
                        { 'text': 'had', 'start': 2756, 'end': 2958 },
                        { 'text': 'not', 'start': 2984, 'end': 3138 },
                        { 'text': 'anticipated', 'start': 3164, 'end': 3634 },
                        { 'text': 'was', 'start': 3682, 'end': 4110 },
                        { 'text': 'the', 'start': 4220, 'end': 4458 },
                        { 'text': 'physical', 'start': 4484, 'end': 4882 },
                        { 'text': 'nature', 'start': 4966, 'end': 5182 },
                        { 'text': 'of', 'start': 5206, 'end': 5322 },
                        { 'text': 'it.', 'start': 5336, 'end': 5442 },
                        { 'text': 'Like,', 'start': 5456, 'end': 5526 },
                        { 'text': 'you\'re', 'start': 5528, 'end': 5686 },
                        { 'text': 'just', 'start': 5698, 'end': 6198 },
                        { 'text': 'tossing', 'start': 6344, 'end': 6802 },
                        { 'text': 'this', 'start': 6826, 'end': 7014 },
                        { 'text': 'thing', 'start': 7052, 'end': 7218 },
                        { 'text': 'around', 'start': 7244, 'end': 7470 },
                        { 'text': 'all', 'start': 7520, 'end': 7626 },
                        { 'text': 'the', 'start': 7628, 'end': 7722 },
                        { 'text': 'time', 'start': 7736, 'end': 7914 },
                        { 'text': 'and', 'start': 7952, 'end': 8298 },
                        { 'text': 'you\'re', 'start': 8384, 'end': 8566 },
                        { 'text': 'just', 'start': 8578, 'end': 8790 },
                        { 'text': 'super', 'start': 8840, 'end': 9162 },
                        { 'text': 'intimate', 'start': 9236, 'end': 9562 },
                        { 'text': 'in', 'start': 9586, 'end': 9702 },
                        { 'text': 'that', 'start': 9716, 'end': 9822 },
                        { 'text': 'way.', 'start': 9836, 'end': 10446 },
                        { 'text': 'Tell', 'start': 10628, 'end': 10938 },
                        { 'text': 'me', 'start': 10964, 'end': 11154 },
                        { 'text': 'about', 'start': 11192, 'end': 11466 },
                        { 'text': 'being', 'start': 11528, 'end': 11790 },
                        { 'text': 'physical', 'start': 11840, 'end': 12262 },
                        { 'text': 'with', 'start': 12346, 'end': 12666 },
                        { 'text': 'Luca.', 'start': 12728, 'end': 13102 },
                        { 'text': 'Like', 'start': 13126, 'end': 13422 },
                        { 'text': 'the', 'start': 13496, 'end': 13698 },
                        { 'text': 'hugs', 'start': 13724, 'end': 14002 },
                        { 'text': 'and', 'start': 14026, 'end': 14142 },
                        { 'text': 'the', 'start': 14156, 'end': 14298 },
                        { 'text': 'carrying', 'start': 14324, 'end': 14722 },
                        { 'text': 'and', 'start': 14746, 'end': 14862 },
                        { 'text': 'the', 'start': 14876, 'end': 15090 },
                        { 'text': 'snuggling', 'start': 15140, 'end': 15574 },
                        { 'text': 'and', 'start': 15622, 'end': 15762 },
                        { 'text': 'the', 'start': 15776, 'end': 16134 },
                        { 'text': 'everything.', 'start': 16232, 'end': 16602 },
                        { 'text': 'Like,', 'start': 16676, 'end': 16878 },
                        { 'text': 'what', 'start': 16904, 'end': 17058 },
                        { 'text': 'is', 'start': 17084, 'end': 17238 },
                        { 'text': 'special', 'start': 17264, 'end': 17634 },
                        { 'text': 'about', 'start': 17732, 'end': 17994 },
                        { 'text': 'that', 'start': 18032, 'end': 18198 },
                        { 'text': 'for', 'start': 18224, 'end': 18342 },
                        { 'text': 'you?', 'start': 18356, 'end': 18420 }
                    ]
                }],
            utterancesStartOffset: 0
        },
        progressBar: null,
        startAnimation: function () { return sampleQuestionAnimation(SAMPLE_QUESTION_GEORGE_ANIMATION); }
    },
    _a[SAMPLE_QUESTION_JULIE_ANIMATION] = {
        cleanupAnimation: function () { return sampleQuestionAnimationCleanup(SAMPLE_QUESTION_JULIE_ANIMATION); },
        duration: 21013,
        expectedAudioSrc: 'https://heyartifact-assets.s3.us-west-2.amazonaws.com/webflow/sample-questions/julie_harry+as+a+brother.mp3',
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
                    'end': 20700,
                    'speaker': 1,
                    'words': [
                        { 'text': 'I', 'start': 130, 'end': 222 },
                        { 'text': 'want', 'start': 236, 'end': 306 },
                        { 'text': 'to', 'start': 308, 'end': 438 },
                        { 'text': 'talk', 'start': 464, 'end': 618 },
                        { 'text': 'a', 'start': 644, 'end': 726 },
                        { 'text': 'bit', 'start': 728, 'end': 930 },
                        { 'text': 'about', 'start': 980, 'end': 1580 },
                        { 'text': 'Harry', 'start': 2150, 'end': 2842 },
                        { 'text': 'as', 'start': 2926, 'end': 3282 },
                        { 'text': 'a', 'start': 3356, 'end': 3522 },
                        { 'text': 'big', 'start': 3536, 'end': 3678 },
                        { 'text': 'brother,', 'start': 3704, 'end': 3994 },
                        { 'text': 'because', 'start': 4042, 'end': 4326 },
                        { 'text': 'in', 'start': 4388, 'end': 4542 },
                        { 'text': 'your', 'start': 4556, 'end': 4734 },
                        { 'text': 'last', 'start': 4772, 'end': 5010 },
                        { 'text': 'Artifact,', 'start': 5060, 'end': 5590 },
                        { 'text': 'Lucy', 'start': 5650, 'end': 5950 },
                        { 'text': 'had', 'start': 6010, 'end': 6198 },
                        { 'text': 'just', 'start': 6224, 'end': 6414 },
                        { 'text': 'been', 'start': 6452, 'end': 6654 },
                        { 'text': 'born,', 'start': 6692, 'end': 6994 },
                        { 'text': 'so', 'start': 7042, 'end': 7254 },
                        { 'text': 'he', 'start': 7292, 'end': 7458 },
                        { 'text': 'was', 'start': 7484, 'end': 7638 },
                        { 'text': 'very', 'start': 7664, 'end': 7854 },
                        { 'text': 'new', 'start': 7892, 'end': 8058 },
                        { 'text': 'to', 'start': 8084, 'end': 8202 },
                        { 'text': 'being', 'start': 8216, 'end': 8394 },
                        { 'text': 'a', 'start': 8432, 'end': 8562 },
                        { 'text': 'big', 'start': 8576, 'end': 8718 },
                        { 'text': 'brother.', 'start': 8744, 'end': 9034 },
                        { 'text': 'Maybe', 'start': 9082, 'end': 9366 },
                        { 'text': 'he', 'start': 9366, 'end': 9428 },
                        { 'text': 'was', 'start': 9428, 'end': 9654 },
                        { 'text': 'still', 'start': 9692, 'end': 9858 },
                        { 'text': 'figuring', 'start': 9884, 'end': 10174 },
                        { 'text': 'it', 'start': 10222, 'end': 10398 },
                        { 'text': 'out.', 'start': 10424, 'end': 10830 },
                        { 'text': 'Now', 'start': 10940, 'end': 11178 },
                        { 'text': 'that', 'start': 11204, 'end': 11358 },
                        { 'text': 'he\'s', 'start': 11384, 'end': 11602 },
                        { 'text': 'been', 'start': 11626, 'end': 11850 },
                        { 'text': 'a', 'start': 11900, 'end': 12078 },
                        { 'text': 'big', 'start': 12104, 'end': 12258 },
                        { 'text': 'brother', 'start': 12284, 'end': 12610 },
                        { 'text': 'for', 'start': 12670, 'end': 13002 },
                        { 'text': 'almost', 'start': 13076, 'end': 13386 },
                        { 'text': 'two', 'start': 13448, 'end': 13710 },
                        { 'text': 'years', 'start': 13760, 'end': 14360 },
                        { 'text': 'how', 'start': 14990, 'end': 15354 },
                        { 'text': 'would', 'start': 15392, 'end': 15522 },
                        { 'text': 'you', 'start': 15536, 'end': 15642 },
                        { 'text': 'describe', 'start': 15656, 'end': 15958 },
                        { 'text': 'him', 'start': 15994, 'end': 16158 },
                        { 'text': 'as', 'start': 16184, 'end': 16302 },
                        { 'text': 'a', 'start': 16316, 'end': 16386 },
                        { 'text': 'brother?', 'start': 16388, 'end': 16618 },
                        { 'text': 'What', 'start': 16654, 'end': 16818 },
                        { 'text': 'are', 'start': 16844, 'end': 16998 },
                        { 'text': 'ways', 'start': 17024, 'end': 17214 },
                        { 'text': 'he', 'start': 17252, 'end': 17454 },
                        { 'text': 'really', 'start': 17492, 'end': 17946 },
                        { 'text': 'excels?', 'start': 18068, 'end': 18646 },
                        { 'text': 'Or', 'start': 18718, 'end': 18918 },
                        { 'text': 'are', 'start': 18944, 'end': 19062 },
                        { 'text': 'there', 'start': 19076, 'end': 19182 },
                        { 'text': 'ways', 'start': 19196, 'end': 19374 },
                        { 'text': 'he\'s', 'start': 19412, 'end': 19642 },
                        { 'text': 'still', 'start': 19666, 'end': 19890 },
                        { 'text': 'struggling', 'start': 19940, 'end': 20350 },
                        { 'text': 'with', 'start': 20410, 'end': 20598 },
                        { 'text': 'it?', 'start': 20624, 'end': 20700 }
                    ]
                }],
            utterancesStartOffset: 0
        },
        progressBar: null,
        startAnimation: function () { return sampleQuestionAnimation(SAMPLE_QUESTION_JULIE_ANIMATION); }
    },
    _a[SAMPLE_QUESTION_MIKE_ANIMATION] = {
        cleanupAnimation: function () { return sampleQuestionAnimationCleanup(SAMPLE_QUESTION_MIKE_ANIMATION); },
        duration: 14638,
        expectedAudioSrc: 'https://heyartifact-assets.s3.us-west-2.amazonaws.com/webflow/sample-questions/mike_perspective.mp3',
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
                    'end': 13680,
                    'speaker': 1,
                    'words': [
                        { 'text': 'You', 'start': 310, 'end': 438 },
                        { 'text': 'said', 'start': 464, 'end': 618 },
                        { 'text': 'you', 'start': 644, 'end': 870 },
                        { 'text': 'enjoy', 'start': 920, 'end': 1242 },
                        { 'text': 'seeing', 'start': 1316, 'end': 1554 },
                        { 'text': 'the', 'start': 1592, 'end': 1758 },
                        { 'text': 'world', 'start': 1784, 'end': 2082 },
                        { 'text': 'through', 'start': 2156, 'end': 2394 },
                        { 'text': 'her', 'start': 2432, 'end': 2598 },
                        { 'text': 'eyes', 'start': 2624, 'end': 2850 },
                        { 'text': 'or', 'start': 2900, 'end': 3366 },
                        { 'text': 'her', 'start': 3488, 'end': 3774 },
                        { 'text': 'noticing', 'start': 3812, 'end': 4234 },
                        { 'text': 'something', 'start': 4282, 'end': 4494 },
                        { 'text': 'that', 'start': 4532, 'end': 4698 },
                        { 'text': 'you', 'start': 4724, 'end': 4878 },
                        { 'text': 'didn\'t.', 'start': 4904, 'end': 5194 },
                        { 'text': 'Can', 'start': 5242, 'end': 5382 },
                        { 'text': 'you', 'start': 5396, 'end': 5574 },
                        { 'text': 'give', 'start': 5612, 'end': 5742 },
                        { 'text': 'me', 'start': 5756, 'end': 5898 },
                        { 'text': 'a', 'start': 5924, 'end': 6042 },
                        { 'text': 'recent', 'start': 6056, 'end': 6298 },
                        { 'text': 'example', 'start': 6334, 'end': 6642 },
                        { 'text': 'of', 'start': 6716, 'end': 6918 },
                        { 'text': 'something', 'start': 6944, 'end': 7242 },
                        { 'text': 'that', 'start': 7316, 'end': 7878 },
                        { 'text': 'she', 'start': 8024, 'end': 8370 },
                        { 'text': 'noticed', 'start': 8420, 'end': 9094 },
                        { 'text': 'that', 'start': 9202, 'end': 9474 },
                        { 'text': 'you', 'start': 9512, 'end': 9678 },
                        { 'text': 'didn\'t', 'start': 9704, 'end': 10066 },
                        { 'text': 'and', 'start': 10138, 'end': 10446 },
                        { 'text': 'that', 'start': 10508, 'end': 11130 },
                        { 'text': 'gave', 'start': 11300, 'end': 11598 },
                        { 'text': 'you', 'start': 11624, 'end': 11742 },
                        { 'text': 'some', 'start': 11756, 'end': 11898 },
                        { 'text': 'perspective', 'start': 11924, 'end': 12418 },
                        { 'text': 'on', 'start': 12454, 'end': 12690 },
                        { 'text': 'who', 'start': 12740, 'end': 12918 },
                        { 'text': 'she', 'start': 12944, 'end': 13098 },
                        { 'text': 'is', 'start': 13124, 'end': 13314 },
                        { 'text': 'as', 'start': 13352, 'end': 13482 },
                        { 'text': 'a', 'start': 13496, 'end': 13602 },
                        { 'text': 'person?', 'start': 13616, 'end': 13680 }
                    ]
                }],
            utterancesStartOffset: 0
        },
        progressBar: null,
        startAnimation: function () { return sampleQuestionAnimation(SAMPLE_QUESTION_MIKE_ANIMATION); }
    },
    _a[SAMPLE_QUESTION_PRIA_ANIMATION] = {
        cleanupAnimation: function () { return sampleQuestionAnimationCleanup(SAMPLE_QUESTION_PRIA_ANIMATION); },
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
                        { 'text': 'I\'m', 'start': 70, 'end': 202 },
                        { 'text': 'skipping', 'start': 226, 'end': 502 },
                        { 'text': 'ahead', 'start': 526, 'end': 714 },
                        { 'text': 'a', 'start': 752, 'end': 846 },
                        { 'text': 'little', 'start': 848, 'end': 1014 },
                        { 'text': 'bit,', 'start': 1052, 'end': 1326 },
                        { 'text': 'but', 'start': 1388, 'end': 1866 },
                        { 'text': 'what', 'start': 1988, 'end': 2310 },
                        { 'text': 'have', 'start': 2360, 'end': 2538 },
                        { 'text': 'you', 'start': 2564, 'end': 2682 },
                        { 'text': 'learned', 'start': 2696, 'end': 2902 },
                        { 'text': 'about', 'start': 2926, 'end': 3114 },
                        { 'text': 'parenting', 'start': 3152, 'end': 3850 },
                        { 'text': 'through', 'start': 3970, 'end': 4254 },
                        { 'text': 'Clementine', 'start': 4292, 'end': 4966 },
                        { 'text': 'specifically?', 'start': 5038, 'end': 5638 },
                        { 'text': 'I', 'start': 5674, 'end': 5766 },
                        { 'text': 'know', 'start': 5768, 'end': 5862 },
                        { 'text': 'you', 'start': 5876, 'end': 5982 },
                        { 'text': 'have', 'start': 5996, 'end': 6102 },
                        { 'text': 'two', 'start': 6116, 'end': 6294 },
                        { 'text': 'other', 'start': 6332, 'end': 6534 },
                        { 'text': 'kids,', 'start': 6572, 'end': 6882 },
                        { 'text': 'but', 'start': 6956, 'end': 7158 },
                        { 'text': 'what', 'start': 7184, 'end': 7338 },
                        { 'text': 'has', 'start': 7364, 'end': 7518 },
                        { 'text': 'she', 'start': 7544, 'end': 7734 },
                        { 'text': 'taught', 'start': 7772, 'end': 7978 },
                        { 'text': 'you', 'start': 8014, 'end': 8178 },
                        { 'text': 'about', 'start': 8204, 'end': 8394 },
                        { 'text': 'being', 'start': 8432, 'end': 8634 },
                        { 'text': 'a', 'start': 8672, 'end': 8802 },
                        { 'text': 'mom', 'start': 8816, 'end': 8958 },
                        { 'text': 'and', 'start': 8984, 'end': 9102 },
                        { 'text': 'a', 'start': 9116, 'end': 9222 },
                        { 'text': 'dad?', 'start': 9236, 'end': 9310 }
                    ]
                }],
            utterancesStartOffset: 0
        },
        progressBar: null,
        startAnimation: function () { return sampleQuestionAnimation(SAMPLE_QUESTION_PRIA_ANIMATION); }
    },
    _a[SAMPLE_QUESTION_RUTHIE_ANIMATION] = {
        cleanupAnimation: function () { return sampleQuestionAnimationCleanup(SAMPLE_QUESTION_RUTHIE_ANIMATION); },
        duration: 9709,
        expectedAudioSrc: 'https://heyartifact-assets.s3.us-west-2.amazonaws.com/webflow/sample-questions/ruthie_first+two+weeks.mp3',
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
                    'end': 9120,
                    'speaker': 1,
                    'words': [
                        { 'text': 'Diana,', 'start': 250, 'end': 694 },
                        { 'text': 'tell', 'start': 742, 'end': 918 },
                        { 'text': 'me', 'start': 944, 'end': 1134 },
                        { 'text': 'about', 'start': 1172, 'end': 1518 },
                        { 'text': 'these', 'start': 1604, 'end': 1890 },
                        { 'text': 'first', 'start': 1940, 'end': 2586 },
                        { 'text': 'basically', 'start': 2768, 'end': 3500 },
                        { 'text': 'two', 'start': 3830, 'end': 4230 },
                        { 'text': 'weeks.', 'start': 4280, 'end': 4746 },
                        { 'text': 'We\'ve', 'start': 4868, 'end': 5182 },
                        { 'text': 'got', 'start': 5206, 'end': 5394 },
                        { 'text': '16', 'start': 5432, 'end': 5890 },
                        { 'text': 'days', 'start': 5950, 'end': 6174 },
                        { 'text': 'under', 'start': 6212, 'end': 6414 },
                        { 'text': 'the', 'start': 6452, 'end': 6582 },
                        { 'text': 'belt.', 'start': 6596, 'end': 7150 },
                        { 'text': 'What', 'start': 7270, 'end': 7518 },
                        { 'text': 'have', 'start': 7544, 'end': 7662 },
                        { 'text': 'your', 'start': 7676, 'end': 7854 },
                        { 'text': 'days', 'start': 7892, 'end': 8202 },
                        { 'text': 'looked', 'start': 8276, 'end': 8550 },
                        { 'text': 'like', 'start': 8600, 'end': 8814 },
                        { 'text': 'with', 'start': 8852, 'end': 9018 },
                        { 'text': 'him?', 'start': 9044, 'end': 9120 }
                    ]
                }],
            utterancesStartOffset: 0
        },
        progressBar: null,
        startAnimation: function () { return sampleQuestionAnimation(SAMPLE_QUESTION_RUTHIE_ANIMATION); }
    },
    _a);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var CURRENT_ANIMATION_INFO = {
    name: null,
    timeScrolledIntoView: null
};
var FAILED_KARAOKE_UPDATE_ATTEMPTS = 0;
/**
 * Even with the correct import order and with the `defer` attribute applied, `updateKaraoke` may not be ready to be
 * invoked by the time the animation starts.
 */
function attemptUpdateKaraoke(karaokeAnimationInfo, animationTime, karaokeState) {
    if (typeof updateKaraoke !== 'undefined') {
        return updateKaraoke(karaokeAnimationInfo, animationTime, karaokeState);
    }
    else {
        FAILED_KARAOKE_UPDATE_ATTEMPTS++;
        // Assuming the animation runs at 60 FPS, this will give about ten seconds of cushion before sending a Sentry
        // error.
        if (FAILED_KARAOKE_UPDATE_ATTEMPTS === 600) {
            Sentry.captureMessage('`updateKaraoke` was not loaded properly.', 'warning');
        }
        return null;
    }
}
function setRadialProgressBar(animation, animationTime) {
    var audioProgress = animationTime / animation.duration;
    var audioProgressBar = $(animation.progressBar);
    var strokeOffset = (1 - audioProgress) * 2 * Math.PI * parseInt(audioProgressBar.attr('r'));
    audioProgressBar.css({ strokeDashoffset: strokeOffset });
}
function sampleQuestionAnimation(animationName, karaokeState) {
    if (karaokeState === void 0) { karaokeState = null; }
    var animation = ANIMATIONS[animationName];
    var isSameAudio = (PLAYER.querySelector('source').src === animation.expectedAudioSrc);
    var isSameAudioPlaying = isSameAudio && !PLAYER.paused;
    if (isSameAudioPlaying) {
        var animationTime = PLAYER.currentTime * 1000;
        setRadialProgressBar(animation, animationTime);
        karaokeState = attemptUpdateKaraoke(animation.karaoke, animationTime, karaokeState);
        window.requestAnimationFrame(function () { return sampleQuestionAnimation(animationName, karaokeState); });
    }
    else if (!isSameAudio) {
        // Another audio file has started playing, so this animation can be reset.
        animation.cleanupAnimation();
    }
}
// Set the animation back to the initial state.
function sampleQuestionAnimationCleanup(animationName) {
    var animation = ANIMATIONS[animationName];
    setRadialProgressBar(animation, 0);
    attemptUpdateKaraoke(animation.karaoke, 0, null);
}
var FAILED_GET_SAMPLE_QUESTION_COMPONENTS_ATTEMPTS = 0;
// Since the sample questions are created programmatically from the CMS, they may not be in the DOM by the time this
// script runs (even with `defer`). Attempt to fetch the components for 10 seconds before sending a Sentry alert.
function getSampleQuestionComponents() {
    var sampleQuestionsSlider = $('.sample-questions-slider');
    for (var _i = 0, SAMPLE_QUESTION_ANIMATIONS_1 = SAMPLE_QUESTION_ANIMATIONS; _i < SAMPLE_QUESTION_ANIMATIONS_1.length; _i++) {
        var animationName = SAMPLE_QUESTION_ANIMATIONS_1[_i];
        // The components for these animations are programmatically created from the CMS collection, so they cannot be
        // reliably found with a class or id. Use the audio URL to find the slide associated with this animation.
        var slide = sampleQuestionsSlider.find("div[data-element='url']:contains('".concat(ANIMATIONS[animationName].expectedAudioSrc, "')")).closest('.sample-questions-slide');
        if (slide.length) {
            ANIMATIONS[animationName].progressBar = $(slide).find('.sample-question_button-progress circle')[0];
            ANIMATIONS[animationName].karaoke.speakerElements[1].container = slide.find('.sample-question_quote-container')[0];
            ANIMATIONS[animationName].karaoke.speakerElements[1].quote = slide.find('.sample-question_quote')[0];
            // Set the initial state of the animation.
            ANIMATIONS[animationName].cleanupAnimation();
        }
        else if (FAILED_GET_SAMPLE_QUESTION_COMPONENTS_ATTEMPTS >= 10) {
            Sentry.captureMessage("Could not find the components associated with animation, ".concat(animationName, ", after 10 seconds."), 'warning');
        }
        else {
            FAILED_GET_SAMPLE_QUESTION_COMPONENTS_ATTEMPTS++;
            setTimeout(getSampleQuestionComponents, 1000);
        }
    }
}
// Set up the animations.
(function () {
    getSampleQuestionComponents();
    var audioSourceToAnimationNameMap = {};
    SAMPLE_QUESTION_ANIMATIONS.forEach(function (animationName) {
        audioSourceToAnimationNameMap[ANIMATIONS[animationName].expectedAudioSrc] = animationName;
    });
    $(PLAYER).on('play', function () {
        var playerSource = $(PLAYER).find('source').attr('src');
        for (var sampleQuestionAudioSrc in audioSourceToAnimationNameMap) {
            if (playerSource === sampleQuestionAudioSrc) {
                sampleQuestionAnimation(audioSourceToAnimationNameMap[sampleQuestionAudioSrc]);
            }
            else {
                sampleQuestionAnimationCleanup(audioSourceToAnimationNameMap[sampleQuestionAudioSrc]);
            }
        }
    });
})();
