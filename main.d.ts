declare const dataLayer: unknown[]
declare const google_optimize: { get: (experimentId: string) => string | undefined}
declare const PAGE_NAME: string
declare let player: HTMLAudioElement
declare const Sentry: import('@sentry/types').Hub
// The environment is inferred in the project's custom code based on the domain/subdomain.
declare const ENVIRONMENT: 'production' | 'staging' | 'testing'

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
