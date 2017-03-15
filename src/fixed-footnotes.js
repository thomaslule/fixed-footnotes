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
  fixedContainerCss: "position: fixed; bottom: 0; background-color: white; border-top: 1px solid grey; width: 100%; padding: 5px;",

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
  this._eventListener = this._refresh.bind(this);
  this.options.w.addEventListener("scroll", this._eventListener);
  this._refresh();
};

/*
 * Stop all the things we were doing and put back the DOM at its initial state.
 */
FixedFootnotes.prototype.stop = function() {
  this._fixedContainer.parentNode.removeChild(this._fixedContainer);
  this.options.w.removeEventListener("scroll", this._eventListener);
}

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
  if (this._fixedContainer.childNodes.length == 0) {
    this._fixedContainer.style.display = "none";
  } else {
    this._fixedContainer.style.display = "";
  }
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
