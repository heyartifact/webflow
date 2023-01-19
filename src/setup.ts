let externalScriptsLoaded = false

const EVENT_TRIGGERS: Array<keyof DocumentEventMap> = ['mousemove']

function loadLibraries() {
    // Only allow scripts to be loaded once (in case two events happen in quick succession).
    if (!externalScriptsLoaded) {
        externalScriptsLoaded = true
        const scripts: HTMLScriptElement[] = []

        // Get Site Control.
        const getSiteControl = document.createElement('script')
        getSiteControl.async = true
        getSiteControl.type = 'text/javascript'
        getSiteControl.src = '//l.getsitecontrol.com/94m3xd17.js'
        scripts.push(getSiteControl)

        for (const script of scripts) {
            document.body.appendChild(script)
        }

        // Remove the event listeners.
        for (const eventTrigger of EVENT_TRIGGERS) {
            document.removeEventListener(eventTrigger, loadLibraries)
        }
    }
}

(() => {
    for (const eventTrigger of EVENT_TRIGGERS) {
        document.addEventListener(eventTrigger, loadLibraries)
    }
})()
