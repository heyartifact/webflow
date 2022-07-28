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


function getBlockProperties(block) {
    const blockVariants = {
        FAQs: 'vertical-expanding',
        footer: 'basic',
        inspirations: 'carousel',
        interviewers: 'carousel',
        'packages-and-pricing': 'basic',
        testimonials: 'carousel',
        ticker: 'basic',
        topnav: 'basic',
        'whats-included': 'basic',
        'your-child': 'basic'
    }
    const additionalProperties = {}
    if (block === 'topnav') {
        additionalProperties['topnav-pinned'] = (window.pageYOffset || document.body.scrollTop) > 0
    }
    return { 'block-variant': blockVariants[block], ...additionalProperties }
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
function getEventProperties(eventName, dataset, target) {
    const eventProperties = {}

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

    if ('block' in eventProperties) {
        Object.assign(eventProperties, getBlockProperties(eventProperties.block))
    }

    return eventProperties
}


// Assign a click event for any element with data-event-name set.
$('[data-event-name]').click(function() {
    const target = $(this).closest('[data-event-name]')[0]
    const dataset = target.dataset
    const eventName = dataset['eventName']
    sendEvent(eventName, getEventProperties(eventName, dataset, target))
})
