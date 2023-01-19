var externalScriptsLoaded = false;
var EVENT_TRIGGERS = ['mousemove'];
function loadLibraries() {
    // Only allow scripts to be loaded once (in case two events happen in quick succession).
    if (!externalScriptsLoaded) {
        externalScriptsLoaded = true;
        var scripts = [];
        // Get Site Control.
        var getSiteControl = document.createElement('script');
        getSiteControl.async = true;
        getSiteControl.type = 'text/javascript';
        getSiteControl.src = '//l.getsitecontrol.com/94m3xd17.js';
        scripts.push(getSiteControl);
        for (var _i = 0, scripts_1 = scripts; _i < scripts_1.length; _i++) {
            var script = scripts_1[_i];
            document.body.appendChild(script);
        }
        // Remove the event listeners.
        for (var _a = 0, EVENT_TRIGGERS_1 = EVENT_TRIGGERS; _a < EVENT_TRIGGERS_1.length; _a++) {
            var eventTrigger = EVENT_TRIGGERS_1[_a];
            document.removeEventListener(eventTrigger, loadLibraries);
        }
    }
}
(function () {
    for (var _i = 0, EVENT_TRIGGERS_2 = EVENT_TRIGGERS; _i < EVENT_TRIGGERS_2.length; _i++) {
        var eventTrigger = EVENT_TRIGGERS_2[_i];
        document.addEventListener(eventTrigger, loadLibraries);
    }
})();
