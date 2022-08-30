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
if (typeof analytics !== 'undefined') {
    analytics.page('Landing', {
        variation: PAGE_NAME
    });
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
function sendEvent(name, properties) {
    // Ensure that analytics has loaded before trying to send an event.
    if (typeof analytics !== 'undefined') {
        analytics.track(name, __assign({ page: PAGE_NAME }, properties));
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
        subscribe: 'basic',
        testimonials: 'carousel',
        ticker: 'basic',
        topnav: 'basic',
        'whats-included': 'basic',
        'your-child': 'basic'
    };
    var blockProperties = { 'block-variant': blockVariants[block] };
    if (block === 'topnav') {
        // TODO: This will not be adequate for the interactive hero section where the topnav does not get pinned until
        // after the hero animation is complete.
        blockProperties['topnav-pinned'] = (window.pageYOffset || document.body.scrollTop) > 0;
    }
    return blockProperties;
}
function getFAQEventProperties(target) {
    var questionText = $(target).children().first().children().first().text();
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
// Take the target of an event and return an object of the relevant properties to be included in the tracking event.
// Return `null` if the event should not be sent.
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
// Assign a click event for any element with `data-event-name` set.
// The element should also have the `data-event-label` and `data-event-block` custom attributes set.
$('[data-event-name]').on('click', function () {
    var target = $(this).closest('[data-event-name]')[0];
    var eventName = target.getAttribute('data-event-name');
    var eventProperties = getEventProperties(eventName, target);
    // `getEventProperties` will return `null` if the event should not be sent.
    if (eventProperties)
        sendEvent(eventName, eventProperties);
});