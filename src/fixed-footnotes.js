"use strict";

var util = require("./util");
var isElementInViewport = require("isElementInViewport");
var throttle = require("lodash/throttle");

/*
 * Start modifying the DOM by creating a fixed container and dynamically populate it.
 */
var FixedFootnotes = function(options, w) {
  this.options = Object.assign({}, this.defaultOptions, options);
  this._window = w || window;

  this._fixedContainer = this._createFixedContainer();

  // throttle of the refresh event to improve performances
  this._eventListener = throttle(this.refresh.bind(this), 200);
  this._window.addEventListener("scroll", this._eventListener);
  this._window.addEventListener("resize", this._eventListener);
  this.refresh();
}

/*
 * Default options
 */
FixedFootnotes.prototype.defaultOptions = {
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
};

/*
 * Stop all the things we were doing and put back the DOM at its initial state.
 */
FixedFootnotes.prototype.stop = function() {
  this._window.removeEventListener("scroll", this._eventListener);
  this._window.removeEventListener("resize", this._eventListener);
  this._fixedContainer.parentNode.removeChild(this._fixedContainer);
}

/*
 * Refresh the view.
 */
FixedFootnotes.prototype.refresh = function() {
  var self = this;
  util.emptyElement(this._fixedContainer);
  this._getReferences().forEach(function(reference) {
    self._displayIfVisible(reference);
  });
};

/*
 * From here: "private" methods that user is not supposed to call directly.
 */

/*
 * Create the fixed container that will host the footnotes.
 */
FixedFootnotes.prototype._createFixedContainer = function() {
  var fixedContainer = this._window.document.createElement("section");
  fixedContainer.id = this.options.fixedContainerId;
  fixedContainer.className = this.options.fixedContainerClass;
  this._window.document.querySelector(this.options.fixedContainerLocation).appendChild(fixedContainer);
  return fixedContainer;
}

/*
 * Get all the references.
 */
FixedFootnotes.prototype._getReferences = function() {
  return this._window.document.querySelectorAll(this.options.referencesSelector);
};

/*
 * Given a reference, display the footnote in the fixed container if the reference is on screen.
 * It won't display the footnote in the fixed container if the footnote is already on screen.
 */
FixedFootnotes.prototype._displayIfVisible = function(reference) {
  var note = this._getNoteFromRef(reference);
  if (!note) return;
  if (isElementInViewport(reference) && !isElementInViewport(note)) {
    this._displayNote(note);
  }
};

/*
 * Given a reference, find its footnote.
 */
FixedFootnotes.prototype._getNoteFromRef = function(reference) {
  return this._window.document.querySelector(reference.getAttribute("href"));
}

/*
 * Add a footnote to the fixed container.
 */
FixedFootnotes.prototype._displayNote = function(note) {
  var newNote = note.cloneNode(true);
  util.removeAllIds(newNote); // we don't want duplicate ids
  newNote.className += (" " + this.options.footnoteClass);
  newNote = this.options.transformNote(newNote);
  this._fixedContainer.appendChild(newNote);
};

/*
 * Expose a single function that will instanciate a FixedFootnotes.
 */
module.exports = function(options, w) {
  return new FixedFootnotes(options, w);
};
