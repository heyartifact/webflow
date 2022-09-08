if (typeof analytics !== 'undefined') {
    analytics.page('Landing', {
        variation: PAGE_NAME,
        ...getGoogleAnalyticsProperties()
    })
}

for (const delay of [5, 15, 30, 45]) {
    setTimeout(() => sendEvent('TimeOnPageThreshold Reached', {
        page: PAGE_NAME,
        threshold: delay.toString()
    }), delay * 1000)
}


/**
 * Attempt to fetch the experiment group from the globals that Google Analytics provides.
 */
function getGoogleAnalyticsProperties() {
    if (typeof gaData !== 'undefined') {
        // Assumes there is not more than one universal analytics tracking id for the page.
        const universalAnalyticsTrackingId = Object.keys(gaData).find(key => key.startsWith('UA-'))
        // Check that a tracking id was found and that the experiments object exists.
        if (universalAnalyticsTrackingId && gaData[universalAnalyticsTrackingId].experiments) {
            const experimentIds = Object.keys(gaData[universalAnalyticsTrackingId].experiments)
            // Make sure `experiments` isn't an empty object.
            if (experimentIds.length) {
                return {experiment_group: gaData[universalAnalyticsTrackingId].experiments[experimentIds[0]]}
            }
        }
    }
    return {}
}


function sendEvent(name: string, properties: Record<string, unknown>) {
    // Ensure that analytics has loaded before trying to send an event.
    if (typeof analytics !== 'undefined') {
        analytics.track(name, {
            page: PAGE_NAME,
            ...getGoogleAnalyticsProperties(),
            ...properties
        })
    }
}


function getBlockProperties(block: string) {
    const blockVariants: Record<string, BlockVariant> = {
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

    const blockProperties: BlockEventProperties = { 'block-variant': blockVariants[block] }
    if (block === 'topnav') {
        // TODO: This will not be adequate for the interactive hero section where the topnav does not get pinned until
        // after the hero animation is complete.
        blockProperties['topnav-pinned'] = (window.pageYOffset || document.body.scrollTop) > 0
    }
    return blockProperties
}


function getFAQEventProperties(target: HTMLElement) {
    const questionText = $(target).children().first().children().first().text()
    return { block: 'FAQs', name: questionText, type: 'question' }
}


function getInterviewerPlayerEventProperties(target: HTMLElement) {
    const interviewerCard = $(target).closest('.interviewers-block')
    const interviewerName = $($(interviewerCard).find('.heading-6')[0]).text()
    return {
        content_type: 'interviewer_audio',
        name: interviewerName
    }
}


// Take the target of an event and return an object of the relevant properties to be included in the tracking event.
// Return `null` if the event should not be sent.
function getEventProperties(eventName: string, target: HTMLElement) {
    const eventProperties: EventProperties = {}
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


// It is possible for browsers to block the Sentry script from being downloaded, so capture messages safely.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function safelyCaptureMessage(message: string, level: SeverityLevel = null) {
    if (typeof Sentry !== 'undefined') {
        Sentry.captureMessage(message, level)
    }
}


// Assign a click event for any element with `data-event-name` set.
// The element should also have the `data-event-label` and `data-event-block` custom attributes set.
$('[data-event-name]').on('click', function() {
    const target = $(this).closest('[data-event-name]')[0]
    const eventName = target.getAttribute('data-event-name')
    const eventProperties = getEventProperties(eventName, target)

    // `getEventProperties` will return `null` if the event should not be sent.
    if (eventProperties) sendEvent(eventName, eventProperties)
})
