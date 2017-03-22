# fixed-footnotes

A lightweight javascript library that will show the footnotes of a document at the bottom of the screen when the user scrolls to their in-text references.

**[Check out the demo here.](https://thomaslule.github.io/fixed-footnotes/)**

## Install

With npm: `npm install fixed-footnotes --save`. You can then use a build tool (like webpack or browserify) to export the javascript into a browser. CSS will be found in `node_modules/fixed-footnotes/build`.

Without npm, add the javascript and css located in the `build` directory to your webpage.

## Usage

````javascript
fixedFootnotes();
````

This will start displaying the footnotes with the default options.

### Options

Here are the options you can pass and their default values:

````javascript
// CSS selector used to identify the references in text.
referencesSelector: ".reference",

// CSS selector to the node that will host the fixed container.
fixedContainerLocation: "body",

// Id to set to the fixed container.
fixedContainerId: "",

// Class to set to the fixed container.
fixedContainerClass: "fixed-footnotes-container",

// Class to add to the footnotes in the container.
footnoteClass: "fixed-footnotes-note",

// Override this if you want to modify your note before displaying it in the fixed container
transformNote: function(elem) { return elem; }
````

### API

The fixedFootnotes function returns a FixedFootnotes object that exposes some functions:

#### refresh()

The view is already refreshed when the user scrolls or resizes his window, but you can call this function to refresh at any other time.

#### stop()

Don't display the footnotes anymore, don't listen to the scroll and resize events anymore.

### Example

````javascript
var ffn = fixedFootnotes({
  referencesSelector: ".ref",
  footnoteClass: "fixed-footnotes-note someOtherClass",
});
document.addEventListerer("customEvent", ffn.refresh);
````

### Appearance

You can customize the appearance of the footnotes by adding some CSS. Copy the library's CSS and edit it to your liking.
