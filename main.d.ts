declare const dataLayer: unknown[]
declare const google_optimize: { get: (experimentId: string) => string | undefined}
declare const PAGE_NAME: string
declare let player: HTMLAudioElement
declare const Sentry: import('@sentry/types').Hub

type SeverityLevel = import('@sentry/types').SeverityLevel

type BlockEventProperties = {
    'block-variant': BlockVariant
    'topnav-pinned'?: boolean
}

type BlockVariant = 'basic' | 'carousel' | 'vertical-expanding'

type EventProperties = Record<string, string>

type SentryContext = {
    name?: string
    properties: Record<string, string>
}
