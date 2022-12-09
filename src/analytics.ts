const buttonClickedEventName = 'Button Clicked'
const faqOpenedEventName = 'FAQs Opened'
const kidConversionFlowStartedEventName = 'KidConversionFlow Started'
const viewedLandingPageBlockEventName = 'Viewed Landing Page Block'

// We don't want to send the `Viewed Landing Page Block` event multiple times per block on the same visit, so use this
// array to track which ones have been sent.
const blocksTracked: string[] = []

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
 * If we change experiments, the old experiment may still exist in the cookie.
 * Example cookie: _gaexp=GAX1.2.OLD_EXPERIMENT_ID.19285.1!NEW_EXPERIMENT_ID.19286.0
 */
function getGoogleAnalyticsProperties() {
    // Google Optimize is only set to run in production.
    if (ENVIRONMENT !== 'production') return {}

    const cookieString = document.cookie
    const cookies = cookieString.split('; ')
    const experimentCookie = cookies.find(cookie => cookie.startsWith('_gaexp='))
    // Check to see if a cookie was found and that the google_optimize global exists. If either of these are falsey,
    // then it should be safe to assume that we are not running A/B testing.
    if (experimentCookie && google_optimize) {
        // Remove the first two generic parts of the cookie, then split the string into individual experiments.
        const experiments = experimentCookie.split('.').slice(2).join('.').split('!')

        for (const experiment of experiments) {
            const experimentParts = experiment.split('.')

            if (experimentParts.length === 0) continue

            const experimentId = experiment.split('.')[0]

            // google_optimize.get will return undefined if the experiment is not found or is not running.
            const experimentGroup = google_optimize.get(experimentId)

            if (experimentGroup) {
                return { experiment_group: experimentGroup, experiment_id: experimentId }
            }
        }
        // TODO: Investigate how to properly attach a context to Sentry messages and include the experiment cookie.
        safelyCaptureMessage(
            'The Google Optimize experiment group could not be determined.',
            'warning'
        )
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
        'animated-preview': 'basic',
        'discount-highlight': 'basic',
        FAQs: 'vertical-expanding',
        footer: 'basic',
        'forever-guarantee': 'basic',
        'get-started': 'basic',
        giftcards: 'basic',
        hero: 'basic',
        'how-it-works': 'basic',
        inspirations: 'basic',
        interviewers: 'carousel',
        'packages-and-pricing': 'basic',
        pricing: 'basic',
        'sample-questions': 'carousel',
        subscribe: 'basic',
        'start-building': 'basic',
        testimonials: 'carousel',
        ticker: 'basic',
        'today-show': 'basic',
        topnav: 'basic',
        'whats-included': 'basic',
        'your-child': 'basic'
    }

    if (!(block in blockVariants)) {
        safelyCaptureMessage(`An invalid block name, ${block}, was passed to getBlockProperties.`, 'warning')
        return {}
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
    const questionText = $(target).find('.question-wrapper').first().text()
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


/**
 * Take the target of an event and return an object of the relevant properties to be included in the tracking event.
 * Return `null` if the event should not be sent.
 */
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


/**
 * It is possible for browsers to block the Sentry script from being downloaded, so capture messages safely.
 */
function safelyCaptureMessage(message: string, level: SeverityLevel = null) {
    if (typeof Sentry !== 'undefined') {
        Sentry.captureMessage(message, level)
    }
}


function buttonClickedEvent(this: HTMLElement, eventNameOverride: string = null) {
    const target = $(this).closest('[data-event-name]')[0]
    const eventName = eventNameOverride || buttonClickedEventName
    const eventProperties = getEventProperties(eventName, target)

    // `getEventProperties` will return `null` if the event should not be sent.
    if (!eventProperties) return

    // All click events should have a `block` property defined.
    if (!('block' in eventProperties)) {
        safelyCaptureMessage(
            `The block property has not been set for a click event with the name, ${eventName}.`,
            'warning'
        )
    }

    sendEvent(eventName, eventProperties)
}


function kidConversionFlowStartedEvent(this: HTMLElement) {
    // Send the button clicked event to Segment.
    buttonClickedEvent.bind(this)()

    // Send the conversion flow started event to Segment.
    sendEvent(kidConversionFlowStartedEventName, {})

    // Send the conversion flow started event to Google Tag Manager.
    dataLayer && dataLayer.push({'event':'kid_conversion_flow_started'})
}


function viewedLandingPageBlockEvent(entries: IntersectionObserverEntry[]) {
    for (const entry of entries) {
        if (entry.isIntersecting) {
            const target = entry.target as HTMLElement
            const blockName = $(target).attr('data-event-block')
            if (blocksTracked.indexOf(blockName) === -1) {
                const eventName = viewedLandingPageBlockEventName
                const eventProperties = getEventProperties(eventName, target)
                sendEvent(eventName, eventProperties)
                blocksTracked.push(blockName)
            }
        }
    }
}


// Assign event listeners for analytics events based on the `data-event-name` attribute.
(() => {
    const blockObserver = new IntersectionObserver(viewedLandingPageBlockEvent)
    $(`[data-event-name="${viewedLandingPageBlockEventName}"]`).each(function() { blockObserver.observe(this) })

    $(`[data-event-name="${buttonClickedEventName}"]`).on('click', function() { buttonClickedEvent.bind(this)() })
    $(`[data-event-name="${faqOpenedEventName}"]`).on('click', function() {
        buttonClickedEvent.bind(this)(faqOpenedEventName)
    })

    $(`[data-event-name="${kidConversionFlowStartedEventName}"]`).on('click', kidConversionFlowStartedEvent)

    // Send a warning if we specified an invalid event name in an element's custom attributes.
    const expectedEventsNames = [
        buttonClickedEventName, faqOpenedEventName, kidConversionFlowStartedEventName, viewedLandingPageBlockEventName
    ]
    const expectedEventSelectors = expectedEventsNames.map(eventName => `[data-event-name="${eventName}"]`).join(', ')
    $('[data-event-name]').not(expectedEventSelectors).each(function() {
        safelyCaptureMessage(
            `Unexpected event name specified in Webflow: ${$(this).attr('data-event-name')}.`,
            'warning'
        )
    })
})()
