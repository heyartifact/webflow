if (typeof analytics !== 'undefined') {
    analytics.page('Landing', {
        variation: PAGE_NAME
    })
}

for (const delay of [5, 15, 30, 45]) {
    setTimeout(() => sendEvent('TimeOnPageThreshold Reached', {
        page: PAGE_NAME,
        threshold: delay.toString()
    }), delay * 1000)
}


function sendEvent(name, properties) {
    // Ensure that analytics has loaded before trying to send an event.
    if (typeof analytics !== 'undefined') {
        analytics.track(name, {
            page: PAGE_NAME,
            ...properties
        })
    }
}


function getBlockProperties(block) {
    const blockVariants = {
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
    }

    const blockProperties = { 'block-variant': blockVariants[block] }
    if (block === 'topnav') {
        // TODO: This will not be adequate for the interactive hero section where the topnav does not get pinned until
        // after the hero animation is complete.
        blockProperties['topnav-pinned'] = (window.pageYOffset || document.body.scrollTop) > 0
    }
    return blockProperties
}


function getFAQEventProperties(target) {
    const questionText = $(target).children().first().children().first().text()
    return { block: 'FAQs', name: questionText, type: 'question' }
}


function getInterviewerPlayerEventProperties(target) {
    const interviewerCard = $(target).closest('.interviewers-block')
    const interviewerName = $($(interviewerCard).find('.heading-6')[0]).text()
    return {
        content_type: 'interviewer_audio',
        name: interviewerName
    }
}


// Take the target of an event and return an object of the relevant properties to be included in the tracking event.
// Return `null` if the event should not be sent.
function getEventProperties(eventName, target) {
    const eventProperties = {}
    const dataset = target.dataset

    // Add custom attributes that start with `data-event-` to the event properties.
    for (const attr in dataset) {
        if (attr.startsWith('event') && attr !== 'eventName') {
            const propName = attr.charAt(5).toLowerCase() + attr.slice(6)
            eventProperties[propName] = dataset[attr]
        }
    }

    // Add additional properties for specific event names.
    if (eventName === 'FAQs Opened' && !('eventType' in dataset)) {
        // Only send event if FAQ is being opened.
        if ($(target).find('.answer-wrapper')[0].style.opacity !== '0') return null

        Object.assign(eventProperties, getFAQEventProperties(target))
    } else if (eventName === 'Player Started') {
        if (dataset.eventBlock === 'interviewers') {
            Object.assign(eventProperties, getInterviewerPlayerEventProperties(target))
        } else if (dataset.eventBlock === 'your-child') {
            eventProperties.name = 'Your child sample'
        }
    }

    // `data-event-block` is included as a custom attribute for most events, which will create a `block` key in the
    // `eventProperties` object.
    if ('block' in eventProperties) {
        Object.assign(eventProperties, getBlockProperties(eventProperties.block))
    }

    return eventProperties
}


// Assign a click event for any element with `data-event-name` set.
// The element should also have the `data-event-label` and `data-event-block` custom attributes set.
$('[data-event-name]').click(function() {
    const target = $(this).closest('[data-event-name]')[0]
    const eventName = target.getAttribute('data-event-name')
    const eventProperties = getEventProperties(eventName, target)

    // `getEventProperties` will return `null` if the event should not be sent.
    if (eventProperties) sendEvent(eventName, eventProperties)
})
