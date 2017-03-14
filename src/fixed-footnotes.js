"use strict";

var empty = require('empty-element');
var inView = require('in-view');

/*
 * The constructor prepares the object without doing anything to the DOM yet.
 */
var FixedFootnotes = function(options) {
  this.options = Object.assign({}, this.defaultOptions, options);
}

/*
 * Default options
 */
FixedFootnotes.prototype.defaultOptions = {
  // CSS selector used to identify the references in text.
  referencesSelector: ".footnote",

  // CSS selector to the node that will host the fixed container.
  fixedContainerLocation: "body",

  // Id to set to the fixed container.
  fixedContainerId: "",

  // CSS to set to the fixed container.
  fixedContainerCss: "position: fixed; bottom: 0; background-color: white; border-top: 1px solid grey; width: 100%;",

  // Window object.
  w: window
};

/*
 * Start modifying the DOM by creating a fixed container and dynamically populate it.
 */
FixedFootnotes.prototype.start = function() {
  var self = this;

  this._fixedContainer = this._createFixedContainer();

  // The view will be refreshed on each scroll
  this.options.w.addEventListener("scroll", function() {
    self._refresh();
  });
  this._refresh();
};

/*
 * Create the fixed container that will host the footnotes.
 */
FixedFootnotes.prototype._createFixedContainer = function() {
  var fixedContainer = this.options.w.document.createElement("div");
  fixedContainer.id = this.options.fixedContainerId;
  fixedContainer.style.cssText = this.options.fixedContainerCss;
  this.options.w.document.querySelector(this.options.fixedContainerLocation).appendChild(fixedContainer);
  return fixedContainer;
}

/*
 * Refresh the view.
 */
FixedFootnotes.prototype._refresh = function() {
  var self = this;
  empty(this._fixedContainer);
  this._getReferences().forEach(function(reference) {
    self._displayIfVisible(reference);
  });
};

/*
 * Get all the references.
 */
FixedFootnotes.prototype._getReferences = function() {
  return this.options.w.document.querySelectorAll(this.options.referencesSelector);
};

/*
 * Given a reference, display the footnote in the fixed container if the reference is on screen.
 * It won't display the footnote in the fixed container if the footnote is already on screen.
 */
FixedFootnotes.prototype._displayIfVisible = function(reference) {
  var note = this.options.w.document.querySelector(reference.getAttribute("href"));
  if (inView.is(reference) && !inView.is(note)) {
    this._displayNote(note);
  }
};

/*
 * Add a footnote to the fixed container.
 */
FixedFootnotes.prototype._displayNote = function(note) {
  this._fixedContainer.appendChild(note.cloneNode(true));
};

/*
 * Expose a single function that will instanciate and start a FixedFootnote.
 */
module.exports = function(options) {
  var ffn = new FixedFootnotes(options);
  ffn.start();
  return ffn;
};
