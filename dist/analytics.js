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
var buttonClickedEventName = 'Button Clicked';
var faqOpenedEventName = 'FAQs Opened';
var kidConversionFlowStartedEventName = 'KidConversionFlow Started';
var viewedLandingPageBlockEventName = 'Viewed Landing Page Block';
// We don't want to send the `Viewed Landing Page Block` event multiple times per block on the same visit, so use this
// array to track which ones have been sent.
var blocksTracked = [];
if (typeof analytics !== 'undefined') {
    analytics.page('Landing', __assign({ variation: PAGE_NAME }, getGoogleAnalyticsProperties()));
}
var _loop_1 = function (delay) {
    setTimeout(function () { return sendEvent('TimeOnPageThreshold Reached', {
        page: PAGE_NAME,
        threshold: delay.toString()
    }); }, delay * 1000);
};
for (var _i = 0, _a = [5, 15, 30, 45]; _i < _a.length; _i++) {
    var delay = _a[_i];
    _loop_1(delay);
}
/**
 * Attempt to fetch the experiment group from the globals that Google Analytics provides.
 * If we change experiments, the old experiment may still exist in the cookie.
 * Example cookie: _gaexp=GAX1.2.OLD_EXPERIMENT_ID.19285.1!NEW_EXPERIMENT_ID.19286.0
 */
function getGoogleAnalyticsProperties() {
    var cookieString = document.cookie;
    var cookies = cookieString.split('; ');
    var experimentCookie = cookies.find(function (cookie) { return cookie.startsWith('_gaexp='); });
    // Check to see if a cookie was found and that the google_optimize global exists. If either of these are falsey,
    // then it should be safe to assume that we are not running A/B testing.
    if (experimentCookie && google_optimize) {
        // Remove the first two generic parts of the cookie, then split the string into individual experiments.
        var experiments = experimentCookie.split('.').slice(2).join('.').split('!');
        for (var _i = 0, experiments_1 = experiments; _i < experiments_1.length; _i++) {
            var experiment = experiments_1[_i];
            var experimentParts = experiment.split('.');
            if (experimentParts.length === 0)
                continue;
            var experimentId = experiment.split('.')[0];
            // google_optimize.get will return undefined if the experiment is not found or is not running.
            var experimentGroup = google_optimize.get(experimentId);
            if (experimentGroup) {
                return { experiment_group: experimentGroup, experiment_id: experimentId };
            }
        }
        safelyCaptureMessage('The Google Optimize experiment group could not be determined.', 'warning', { properties: { experimentCookie: experimentCookie } });
    }
    return {};
}
function sendEvent(name, properties) {
    // Ensure that analytics has loaded before trying to send an event.
    if (typeof analytics !== 'undefined') {
        analytics.track(name, __assign(__assign({ page: PAGE_NAME }, getGoogleAnalyticsProperties()), properties));
    }
}
function getBlockProperties(block) {
    var blockVariants = {
        FAQs: 'vertical-expanding',
        footer: 'basic',
        hero: 'basic',
        'how-it-works': 'basic',
        inspirations: 'carousel',
        interviewers: 'carousel',
        'packages-and-pricing': 'basic',
        pricing: 'basic',
        'sample-questions': 'carousel',
        subscribe: 'basic',
        'start-building': 'basic',
        testimonials: 'carousel',
        ticker: 'basic',
        topnav: 'basic',
        'whats-included': 'basic',
        'your-child': 'basic'
    };
    if (!(block in blockVariants)) {
        safelyCaptureMessage("An invalid block name, ".concat(block, ", was passed to getBlockProperties."), 'warning');
        return {};
    }
    var blockProperties = { 'block-variant': blockVariants[block] };
    if (block === 'topnav') {
        // TODO: This will not be adequate for the interactive hero section where the topnav does not get pinned until
        // after the hero animation is complete.
        blockProperties['topnav-pinned'] = (window.pageYOffset || document.body.scrollTop) > 0;
    }
    return blockProperties;
}
function getFAQEventProperties(target) {
    var questionText = $(target).find('.question-wrapper').first().text();
    return { block: 'FAQs', name: questionText, type: 'question' };
}
function getInterviewerPlayerEventProperties(target) {
    var interviewerCard = $(target).closest('.interviewers-block');
    var interviewerName = $($(interviewerCard).find('.heading-6')[0]).text();
    return {
        content_type: 'interviewer_audio',
        name: interviewerName
    };
}
/**
 * Take the target of an event and return an object of the relevant properties to be included in the tracking event.
 * Return `null` if the event should not be sent.
 */
function getEventProperties(eventName, target) {
    var eventProperties = {};
    var dataset = target.dataset;
    // Add custom attributes that start with `data-event-` to the event properties.
    for (var attr in dataset) {
        if (attr.startsWith('event') && attr !== 'eventName') {
            var propName = attr.charAt(5).toLowerCase() + attr.slice(6);
            eventProperties[propName] = dataset[attr];
        }
    }
    // Add additional properties for specific event names.
    if (eventName === 'FAQs Opened' && !('eventType' in dataset)) {
        // Only send event if FAQ is being opened.
        if ($(target).find('.answer-wrapper')[0].style.opacity !== '0')
            return null;
        Object.assign(eventProperties, getFAQEventProperties(target));
    }
    else if (eventName === 'Player Started') {
        if (dataset.eventBlock === 'interviewers') {
            Object.assign(eventProperties, getInterviewerPlayerEventProperties(target));
        }
        else if (dataset.eventBlock === 'your-child') {
            eventProperties.name = 'Your child sample';
        }
    }
    // `data-event-block` is included as a custom attribute for most events, which will create a `block` key in the
    // `eventProperties` object.
    if ('block' in eventProperties) {
        Object.assign(eventProperties, getBlockProperties(eventProperties.block));
    }
    return eventProperties;
}
/**
 * It is possible for browsers to block the Sentry script from being downloaded, so capture messages safely.
 */
function safelyCaptureMessage(message, level, context) {
    if (level === void 0) { level = null; }
    if (context === void 0) { context = null; }
    if (typeof Sentry !== 'undefined') {
        Sentry.withScope(function (scope) {
            if (context) {
                var contextName = context.name || 'Custom Context';
                scope.setContext(contextName, context.properties);
            }
            Sentry.captureMessage(message, level);
        });
    }
}
function buttonClickedEvent(eventNameOverride) {
    if (eventNameOverride === void 0) { eventNameOverride = null; }
    var target = $(this).closest('[data-event-name]')[0];
    var eventName = eventNameOverride || buttonClickedEventName;
    var eventProperties = getEventProperties(eventName, target);
    // `getEventProperties` will return `null` if the event should not be sent.
    if (!eventProperties)
        return;
    // All click events should have a `block` property defined.
    if (!('block' in eventProperties)) {
        safelyCaptureMessage("The block property has not been set for a click event with the name, ".concat(eventName, "."), 'warning');
    }
    sendEvent(eventName, eventProperties);
}
function kidConversionFlowStartedEvent() {
    // Send the button clicked event to Segment.
    buttonClickedEvent.bind(this)();
    // Send the conversion flow started event to Segment.
    sendEvent(kidConversionFlowStartedEventName, {});
    // Send the conversion flow started event to Google Tag Manager.
    dataLayer && dataLayer.push({ 'event': 'kid_conversion_flow_started' });
}
function viewedLandingPageBlockEvent(entries) {
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var entry = entries_1[_i];
        if (entry.isIntersecting) {
            var target = entry.target;
            var blockName = $(target).attr('data-event-block');
            if (blocksTracked.indexOf(blockName) === -1) {
                var eventName = viewedLandingPageBlockEventName;
                var eventProperties = getEventProperties(eventName, target);
                sendEvent(eventName, eventProperties);
                blocksTracked.push(blockName);
            }
        }
    }
}
// Assign event listeners for analytics events based on the `data-event-name` attribute.
(function () {
    var blockObserver = new IntersectionObserver(viewedLandingPageBlockEvent);
    $("[data-event-name=\"".concat(viewedLandingPageBlockEventName, "\"]")).each(function () { blockObserver.observe(this); });
    $("[data-event-name=\"".concat(buttonClickedEventName, "\"]")).on('click', function () { buttonClickedEvent.bind(this)(); });
    $("[data-event-name=\"".concat(faqOpenedEventName, "\"]")).on('click', function () {
        buttonClickedEvent.bind(this)(faqOpenedEventName);
    });
    $("[data-event-name=\"".concat(kidConversionFlowStartedEventName, "\"]")).on('click', kidConversionFlowStartedEvent);
    // Send a warning if we specified an invalid event name in an element's custom attributes.
    var expectedEventsNames = [
        buttonClickedEventName, faqOpenedEventName, kidConversionFlowStartedEventName, viewedLandingPageBlockEventName
    ];
    var expectedEventSelectors = expectedEventsNames.map(function (eventName) { return "[data-event-name=\"".concat(eventName, "\"]"); }).join(', ');
    $('[data-event-name]').not(expectedEventSelectors).each(function () {
        safelyCaptureMessage("Unexpected event name specified in Webflow: ".concat($(this).attr('data-event-name'), "."), 'warning');
    });
})();
