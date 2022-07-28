# Webflow Assets

## Importing

The template for the path to load these scripts is:

```
https://cdn.jsdelivr.net/gh/user/repo@version/file
```

Ending the file name with `.min.js` will prompt jsDelivr to automatically create and serve a minified version of the
script.

Example:
```html
<script src="https://cdn.jsdelivr.net/gh/heyartifact/webflow/analytics.min.js"></script>
```

Refer to the [jsDelivr features](https://www.jsdelivr.com/features#gh) for more information.

## Globals

For global variables defined synchronously in the document before these scripts are imported, it is safe to assume they
exist and can be called. Add these variables to the ESlint globals for the project to prevent errors about undefined
variables.