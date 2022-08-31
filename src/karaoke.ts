/* globals CURRENT_ANIMATION_INFO */

/**
 * Append a word wrapped in a span to the provided parent node.
 */
function appendWord(parent: HTMLElement, word: UtteranceWord, textVariant: string) {
    const wordSpan = document.createElement('span')
    wordSpan.textContent = word.text
    wordSpan.className = `individual-word staged-word ${textVariant} no-margin`
    parent.appendChild(wordSpan)
    return wordSpan
}


/**
 * Find the quote that is currently being spoken from the utterances.
 */
function getCurrentQuote(utterances: Utterances, time: number) {
    for (const quote of utterances) {
        if (time >= quote.start && time < quote.end) {
            return quote
        }
    }
}


/**
 * Remove all the text from the speaker quote elements so that a new quote can begin being animated.
 */
function clearQuotes(speakerElements: Record<string, SpeakerElements>) {
    let speaker: keyof typeof speakerElements
    for (speaker in speakerElements) {
        speakerElements[speaker].quote.textContent = ''
    }
}


/**
 * Move the spoken word into the visible portion of the container. If the word is already fully visible, no change will
 * be made.
 */
function moveWordIntoView(container: HTMLElement, quote: HTMLElement, wordSpan: HTMLSpanElement) {
    const containerBoundingRect = container.getBoundingClientRect()
    const wordSpanBoundingRect = wordSpan.getBoundingClientRect()
    const bottomPadding = parseInt($(quote).css('padding-bottom'))
    const topPadding = parseInt($(quote).css('padding-top'))
    // Check if the word is outside of the quote container (even partially).
    if ((
        containerBoundingRect.top + topPadding > wordSpanBoundingRect.top ||
        containerBoundingRect.bottom < wordSpanBoundingRect.bottom + bottomPadding
    )) {
        const quoteBoundingRect = quote.getBoundingClientRect()
        // Shift the quote div up by the amount it would take to move the wordSpan up to the top of the container.
        quote.style.top = `${quoteBoundingRect.top - wordSpanBoundingRect.top + topPadding}px`
    }
}


/**
 * Invoke this function from the `animations.js` script. `CURRENT_ANIMATION_INFO` is set as a global in that script and
 * will be available to reference by the time this function is invoked.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function updateKaraoke(karaokeAnimationInfo: KaraokeAnimationInfo, animationTime: number) {
    if (!CURRENT_ANIMATION_INFO.karaokeState) {
        CURRENT_ANIMATION_INFO.karaokeState = {
            currentQuoteStart: null,
            stagedWords: []
        }
    }

    const currentTime = animationTime + karaokeAnimationInfo.utterancesStartOffset
    const currentQuote = getCurrentQuote(karaokeAnimationInfo.utterances, currentTime)

    // There will be gaps between quotes. Don't do anything if there is not a quote at the `currentTime`.
    if (currentQuote) {
        const { container, quote } = karaokeAnimationInfo.speakerElements[currentQuote.speaker]

        // Check if a new quote is starting. Clean up the previous quotes and set up the new quote.
        if (currentQuote.start !== CURRENT_ANIMATION_INFO.karaokeState.currentQuoteStart) {
            clearQuotes(karaokeAnimationInfo.speakerElements)
            CURRENT_ANIMATION_INFO.karaokeState.currentQuoteStart = currentQuote.start
            CURRENT_ANIMATION_INFO.karaokeState.stagedWords = []
            currentQuote.words.forEach(word => {
                const wordSpan = appendWord(quote, word, karaokeAnimationInfo.textVariant)
                CURRENT_ANIMATION_INFO.karaokeState.stagedWords.push({element: wordSpan, ...word})
            })
        }

        // Unstage all words that have been or are currently being spoken.
        while (
            CURRENT_ANIMATION_INFO.karaokeState.stagedWords.length > 0 &&
            currentTime >= CURRENT_ANIMATION_INFO.karaokeState.stagedWords[0].start
        ) {
            const stagedWordElement = CURRENT_ANIMATION_INFO.karaokeState.stagedWords[0].element
            stagedWordElement.classList.remove('staged-word')
            // Remove the spoken word from the `stagedWords` array.
            CURRENT_ANIMATION_INFO.karaokeState.stagedWords.shift()
            moveWordIntoView(container, quote, stagedWordElement)
        }
    }
}
