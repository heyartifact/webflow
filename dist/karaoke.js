var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/**
 * Append a word wrapped in a span to the provided parent node.
 */
function appendWord(parent, word, textVariant) {
    var wordSpan = document.createElement('span');
    wordSpan.textContent = word.text;
    wordSpan.className = "individual-word staged-word ".concat(textVariant, " no-margin");
    parent.appendChild(wordSpan);
    return wordSpan;
}
/**
 * Find the quote that is currently being spoken from the utterances.
 */
function getCurrentQuote(utterances, time) {
    for (var _i = 0, utterances_1 = utterances; _i < utterances_1.length; _i++) {
        var quote = utterances_1[_i];
        if (time >= quote.start && time < quote.end) {
            return quote;
        }
    }
}
/**
 * Remove all the text from the speaker quote elements so that a new quote can begin being animated.
 */
function clearQuotes(speakerElements) {
    var speaker;
    for (speaker in speakerElements) {
        speakerElements[speaker].quote.textContent = '';
    }
}
/**
 * Move the spoken word into the visible portion of the container. If the word is already fully visible, no change will
 * be made.
 */
function moveWordIntoView(container, quote, wordSpan) {
    var containerBoundingRect = container.getBoundingClientRect();
    var wordSpanBoundingRect = wordSpan.getBoundingClientRect();
    var bottomPadding = parseInt($(quote).css('padding-bottom'));
    var topPadding = parseInt($(quote).css('padding-top'));
    // Check if the word is outside of the quote container (even partially).
    if ((containerBoundingRect.top + topPadding > wordSpanBoundingRect.top ||
        containerBoundingRect.bottom < wordSpanBoundingRect.bottom + bottomPadding)) {
        var quoteBoundingRect = quote.getBoundingClientRect();
        // Shift the quote div up by the amount it would take to move the wordSpan up to the top of the container.
        quote.style.top = "".concat(quoteBoundingRect.top - wordSpanBoundingRect.top + topPadding, "px");
    }
}
/**
 * Invoke this function from the `animations.js` script.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function updateKaraoke(karaokeAnimationInfo, animationTime, karaokeState) {
    if (!karaokeState) {
        karaokeState = {
            currentQuoteStart: null,
            stagedWords: []
        };
    }
    var currentTime = animationTime + karaokeAnimationInfo.utterancesStartOffset;
    var currentQuote = getCurrentQuote(karaokeAnimationInfo.utterances, currentTime);
    // There will be gaps between quotes. Don't do anything if there is not a quote at the `currentTime`.
    if (currentQuote) {
        var _a = karaokeAnimationInfo.speakerElements[currentQuote.speaker], container = _a.container, quote_1 = _a.quote;
        // Check if a new quote is starting. Clean up the previous quotes and set up the new quote.
        if (currentQuote.start !== karaokeState.currentQuoteStart) {
            clearQuotes(karaokeAnimationInfo.speakerElements);
            karaokeState.currentQuoteStart = currentQuote.start;
            karaokeState.stagedWords = [];
            currentQuote.words.forEach(function (word) {
                var wordSpan = appendWord(quote_1, word, karaokeAnimationInfo.textVariant);
                karaokeState.stagedWords.push(__assign({ element: wordSpan }, word));
            });
        }
        // Unstage all words that have been or are currently being spoken.
        while (karaokeState.stagedWords.length > 0 &&
            currentTime >= karaokeState.stagedWords[0].start) {
            var stagedWordElement = karaokeState.stagedWords[0].element;
            stagedWordElement.classList.remove('staged-word');
            // Remove the spoken word from the `stagedWords` array.
            karaokeState.stagedWords.shift();
            moveWordIntoView(container, quote_1, stagedWordElement);
        }
    }
    return karaokeState;
}
