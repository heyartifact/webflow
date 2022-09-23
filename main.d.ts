declare const dataLayer: unknown[]
declare const google_optimize: { get: (experimentId: string) => string | undefined}
declare const PAGE_NAME: string
declare let player: HTMLAudioElement
declare const Sentry: import('@sentry/types').Hub
// The environment is inferred in the project's custom code based on the domain/subdomain.
declare const ENVIRONMENT: 'production' | 'staging' | 'testing'

type SeverityLevel = import('@sentry/types').SeverityLevel

type AnimationName = (
    'sample-question-anna' | 'sample-question-george' | 'sample-question-julie' | 'sample-question-mike' |
    'sample-question-pria' | 'sample-question-ruthie'
)

type AnimationInfo = {
    cleanupAnimation?: () => void
    duration: number
    expectedAudioSrc?: string
    karaoke?: KaraokeAnimationInfo
    progressBar: SVGCircleElement
    startAnimation: () => void
}

type AnimationStep = {
    end: number
    id: string
    start: number
}

type BlockEventProperties = {
    'block-variant': BlockVariant
    'topnav-pinned'?: boolean
}

type BlockVariant = 'basic' | 'carousel' | 'vertical-expanding'

type CurrentAnimationInfo = {
    name: AnimationName
    timeScrolledIntoView: number
}

type EventProperties = Record<string, string>

type KaraokeAnimationInfo = {
    speakerElements: Record<number, SpeakerElements>
    textVariant: string
    utterances: Utterances
    utterancesStartOffset: number
}

type KaraokeState = {
    currentQuoteStart: number
    stagedWords: StagedWord[]
}

type SentryContext = {
    name?: string
    properties: Record<string, string>
}

type StagedWord = UtteranceWord & { element: HTMLSpanElement }

type SpeakerElements = {
    container: HTMLElement | null
    quote: HTMLElement | null
}

type UtteranceWord = {
    end: number
    start: number
    text: string
}

type Utterance = {
    end: number
    speaker: number
    start: number
    words: UtteranceWord[]
}

type Utterances = Utterance[]
