const UTTERANCES = [
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
]
// The utterance start/end times are based on the time in the episode, not the moment specifically.
// We need to account for the moment start time to sync the utterances to the cropped audio.
const MOMENT_START = 10838.7949393306
const AUDIO_PLAYER = document.getElementById('audio-player')
const SPEAKER_ELEMENTS = {
    1: {
        container: document.getElementById('speaker-1-container'),
        quote: document.getElementById('speaker-1-quote')
    },
    2: {
        container: document.getElementById('speaker-2-container'),
        quote: document.getElementById('speaker-2-quote')
    }
}
let CURRENT_QUOTE_START = null
let STAGED_WORDS = []

function getCurrentQuote(time) {
    for (const quote of UTTERANCES) {
        if (time >= quote.start && time < quote.end) {
            return quote
        }
    }
}

function appendWord(element, word) {
    const wordSpan = document.createElement('span')
    wordSpan.textContent = word.text
    wordSpan.className = 'individual-word staged-word'
    element.appendChild(wordSpan)
    return wordSpan
}

function clearQuotes() {
    for (const speaker in SPEAKER_ELEMENTS) {
        SPEAKER_ELEMENTS[speaker].quote.textContent = ''
    }
}

function moveWordIntoView(container, quote, wordSpan) {
    const containerBoundingRect = container.getBoundingClientRect()
    const wordSpanBoundingRect = wordSpan.getBoundingClientRect()
    // Check if the word is outside of the quote container (even partially).
    if ((
        containerBoundingRect.top > wordSpanBoundingRect.top ||
        containerBoundingRect.bottom < wordSpanBoundingRect.bottom
    )) {
        const quoteBoundingRect = quote.getBoundingClientRect()
        // Shift the quote div up by the amount it would take to move the wordSpan up to the top of the container.
        quote.style.top = `${quoteBoundingRect.top - wordSpanBoundingRect.top}px`
    }
}


function karaokeAnimation() {
    // Get the audio player's current time, convert to milliseconds, and offset by the moment start time.
    const currentTime = AUDIO_PLAYER.currentTime * 1000 + MOMENT_START
    const currentQuote = getCurrentQuote(currentTime)

    // There will be gaps between quotes. Don't do anything if there is not a quote at the `currentTime`.
    if (currentQuote) {
        const { container, quote } = SPEAKER_ELEMENTS[currentQuote.speaker]

        // Check if a new quote is starting. Clean up the previous quotes and set up the new quote.
        if (currentQuote.start !== CURRENT_QUOTE_START) {
            clearQuotes()
            STAGED_WORDS = []
            CURRENT_QUOTE_START = currentQuote.start
            currentQuote.words.forEach(word => {
                const wordSpan = appendWord(quote, word)
                STAGED_WORDS.push({element: wordSpan, ...word})
            })
        }

        // Unstage all words that have been or are currently being spoken.
        while (STAGED_WORDS.length > 0 && currentTime > STAGED_WORDS[0].start) {
            const stagedWordElement = STAGED_WORDS[0].element
            stagedWordElement.classList.remove('staged-word')
            STAGED_WORDS.shift()
            moveWordIntoView(container, quote, stagedWordElement)
        }
    }

    window.requestAnimationFrame(karaokeAnimation)
}

karaokeAnimation()
