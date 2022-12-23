# Webflow Assets

## Miscellaneous Notes

### Videos

When adding videos with embedded HTML instead of Webflow's out of the box video elements, make sure all the attributes
are set that allow it to autoplay:

```html
<video muted playsinline autoplay loop><source src='...'></video>
```

The `playsinline` attribute is needed specifically for mobile iOS browsers. Without this attribute, the browser assumes
the video is expected to play fullscreen, thus does not allow the video to autoplay. See more in
[this blog post](https://webkit.org/blog/6784/new-video-policies-for-ios/).

## Importing

The template for the path to load these scripts is:

```
https://cdn.jsdelivr.net/gh/user/repo@version/file
```

By excluding the version tag, jsDelivr will fetch the latest semantic version of the script. However, this script will
be cached by jsDelivr and potentially the user's browser. To avoid issues with outdated scripts being cached, make sure
the version number is updated in Webflow's project custom code. There is a variable in the project's head,
`ARTIFACT_SCRIPT_VERSION`, which will be used to dynamically import the correct version of the scripts.

Ending the file name with `.min.js` will prompt jsDelivr to automatically create and serve a minified version of the
script.

Example:
```html
<script src="https://cdn.jsdelivr.net/gh/heyartifact/webflow@1.0.0/dist/analytics.min.js"></script>
```

Refer to the [jsDelivr features](https://www.jsdelivr.com/features#gh) for more information.

### Import Order

The import order of these scripts matters since some scripts depend on functions or globals defined in other scripts.
The recommended import order is as follows:

- `analytics`
- `karaoke`
- `animations`
- `player`

## Sending Segment Events

To send Segment events, the elements in Webflow will need to have custom attributes assigned to them. Instructions on
sending each event are included below.

In addition to the required custom attributes, any custom attribute beginning with `data-event-` will automatically be
included in the payload.

The event listeners for these events are only attached to elements that are rendered on the initial page load. Elements
hidden with CSS will have events attached (since the elements are in the DOM), but elements that are added to the DOM
after the initial load will not. For example:

- The paginated FAQ block only renders the visible FAQs to the DOM, so only the first page will have analytics events.
- The FAQ block that has separate tabs renders ALL the FAQs to the DOM (even the inactive tabs), so all the FAQs will
have the proper events attached.

### The `Button Clicked` Event

To have an element trigger this, assign the `data-event-name` attribute with a value of `Button Clicked`.

Required custom attributes:
- `data-event-block`
- `data-event-label`

### The `FAQs Opened` Event

To have an element trigger this, assign the `data-event-name` attribute with a value of `FAQs Opened`. No additional
attributes are required.

This script for this relies on the opacity of the FAQ answer being changed to know when it is actually opened (we do not
trigger an event when the FAQ is closed). If the styling/animation changes for these elements, it could impact the
ability to track this event.

### The `KidConversionFlow Started` Event

To have an element trigger this, assign the `data-event-name` attribute with a value of `KidConversionFlow Started`.
This event will trigger both the `Button Clicked` event as well as the `KidConversionFlow Started` event.

Refer to the `Button Clicked` event for the required attributes.

### The `Viewed Landing Page Block` Event

To have an element trigger this, assign the `data-event-name` attribute with a value of `Viewed Landing Page Block`.

Required custom attributes:
- `data-event-block`

## Testing

To stage and test changes to these scripts, you can override the version number in the page's custom code. It is
recommended to set the version to a commit hash instead of a branch name, as branches can be cached by jsDelivr. Once
the version is changed, publish the page to the staging URL and you can test.

Two important notes when testing:
- Be careful not to publish the page to the live URL when you're just testing.
- After testing, **always** remove the override to the version number! Let the central version number in the project's
custom code be the source of truth.

## Releasing

To release a new version of these files:

- Merge the changes into `main`
- Publish a new release on GitHub, tagging it with the new semantic version
- Update the `ARTIFACT_SCRIPT_VERSION` in the Webflow project's custom code head to match the new release version
- Publish the Webflow site to allow the script changes to take effect

## Globals

For global variables defined synchronously in the document before these scripts are imported, it is safe to assume they
exist and can be called. Add these variables to the ESlint globals for the project to prevent errors about undefined
variables.

## TypeScript

To automatically compile the TypeScript files with each commit, create the file `.git/hooks/pre-commit` and add the
the following commands to the file:

```bash
#!/bin/sh

echo "Automatically compiling TypeScript..."
npx tsc
git add dist/
```

Note: This compiles scripts from **all** the `.ts` files, not just the ones that were included with the commit. If other
`.ts` files were updated but not included, stash them before committing.
