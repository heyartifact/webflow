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
<script src="https://cdn.jsdelivr.net/gh/heyartifact/webflow/src/analytics.min.js"></script>
```

Refer to the [jsDelivr features](https://www.jsdelivr.com/features#gh) for more information.

## Testing

Merging script changes to `main` may affect the live page. To test these scripts without making any changes to the live
pages, you can edit the scripts in the Webflow page to target a specific branch (such as `develop`):

```html
<script src="https://cdn.jsdelivr.net/gh/heyartifact/webflow@develop/src/analytics.min.js"></script>
```

**Remember to changes these back before publishing the Webflow page to production!**

By excluding the tag, jsDelivr will fetch the latest semantic version of the script.

Note that the files are cached and will not automatically fetch new versions with future commits (unless it sees that
the version has changed). However, if a branch is cached and is stale for testing, you can also use the commit id to
select a more up-to-date version.

See more about how jsDelivr [caches files](https://github.com/jsdelivr/jsdelivr#caching).

## Globals

For global variables defined synchronously in the document before these scripts are imported, it is safe to assume they
exist and can be called. Add these variables to the ESlint globals for the project to prevent errors about undefined
variables.