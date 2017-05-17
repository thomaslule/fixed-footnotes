var proxyquire =  require('proxyquire');
var utilStub = {};
var footnotes = proxyquire('../src/fixed-footnotes', { "./util": utilStub });
var jsdom = require("jsdom");

const EMPTY_BODY = "<body></body>";
const DOC_WITH_ONE_REF = "<body><p class='reference' href='#note'>reference</p><p id='note'>note</p></body>";

var createDomEnv = function(html, callback) {
  jsdom.env(html, ["http://code.jquery.com/jquery.js"], function(err, w) {
    callback(w);
  });
}

describe("fixed-footnotes.constructor", function() {

  it("should create a container as the last node of body", function(done) {
    createDomEnv(EMPTY_BODY, function(w) {
      global.window = w;
      footnotes();
      expect(w.$("body > *:last").hasClass("fixed-footnotes-container")).toBe(true);
      done();
    });
  });

  it("should use the window passed as parameter", function(done) {
    createDomEnv(EMPTY_BODY, function(w) {
      footnotes({}, w);
      expect(w.$(".fixed-footnotes-container").length).toBe(1);
      done();
    });
  });

  it("should display a note if its reference is visible and the original note isn't", function(done) {
    createDomEnv(DOC_WITH_ONE_REF, function(w) {
      spyOn(utilStub, "isElementInViewport").and.returnValues(true, false); // reference visible, note invisible
      footnotes({}, w);
      expect(w.$(".fixed-footnotes-note").length).toBe(1);
      done();
    });
  });

  it("should display 2 notes if there references are visible and the original notes aren't", function(done) {
    createDomEnv("<body> \
    <p class='reference' href='#note'>reference</p> \
    <p class='reference' href='#note2'>reference2</p> \
    <p id='note'>note</p> \
    <p id='note2'>note</p> \
    </body>", function(w) {
      spyOn(utilStub, "isElementInViewport").and.returnValues(true, false, // reference visible, note invisible for note 1
                                                              true, false); // reference visible, note invisible for note 2
      footnotes({}, w);
      expect(w.$(".fixed-footnotes-note").length).toBe(2);
      done();
    });
  });

  it("shouldn't display a note if its reference is not visible", function(done) {
    createDomEnv(DOC_WITH_ONE_REF, function(w) {
      spyOn(utilStub, "isElementInViewport").and.returnValues(false); // reference invisible
      footnotes({}, w);
      expect(w.$(".fixed-footnotes-note").length).toBe(0);
      done();
    });
  });

  it("shouldn't display a note if its original note is visible", function(done) {
    createDomEnv(DOC_WITH_ONE_REF, function(w) {
      spyOn(utilStub, "isElementInViewport").and.returnValues(true, true); // reference visible, note visible
      footnotes({}, w);
      expect(w.$(".fixed-footnotes-note").length).toBe(0);
      done();
    });
  });

  it("should take the options into account", function(done) {
    createDomEnv("<body><p class='myReference' href='#note'>reference</p><p id='note'>note</p><div id='myParent'></div></body>", function(w) {
      spyOn(utilStub, "isElementInViewport").and.returnValues(true, false); // reference visible, note invisible
      footnotes({
        referencesSelector: ".myReference",
        fixedContainerLocation: "#myParent",
        fixedContainerId: "myContainerId",
        fixedContainerClass: "myContainerClass",
        footnoteClass: "myFootnoteClass",
        transformNote: function(elem) {
          elem.className += " addedClass";
          return elem;
        }
      }, w);
      expect(w.$("#myParent > #myContainerId").length).toBe(1);
      expect(w.$("#myContainerId").hasClass("myContainerClass")).toBe(true);
      expect(w.$(".myFootnoteClass").length).toBe(1);
      expect(w.$(".addedClass").length).toBe(1);
      done();
    });
  });

  it("shouldn't display a note if we can't find it", function(done) {
    createDomEnv("<body><p class='reference' href='#note'>reference</p></body>", function(w) {
      spyOn(utilStub, "isElementInViewport").and.returnValues(true, false); // reference visible, note invisible
      footnotes({}, w);
      expect(w.$(".fixed-footnotes-note").length).toBe(0);
      done();
    });
  });

});

describe("fixed-footnotes.stop", function() {

  it("should remove the footnotes container and all its notes", function(done) {
    createDomEnv(DOC_WITH_ONE_REF, function(w) {
      spyOn(utilStub, "isElementInViewport").and.returnValues(true, false); // reference visible, note invisible
      var ffn = footnotes({}, w);
      expect(w.$(".fixed-footnotes-container").length).toBe(1);
      expect(w.$(".fixed-footnotes-note").length).toBe(1);
      ffn.stop();
      expect(w.$(".fixed-footnotes-container").length).toBe(0);
      expect(w.$(".fixed-footnotes-note").length).toBe(0);
      done();
    });
  });

});

describe("fixed-footnotes.refresh", function() {

  it("should display a note if a previously hidden reference is now visible", function(done) {
    createDomEnv(DOC_WITH_ONE_REF, function(w) {
      spyOn(utilStub, "isElementInViewport").and.returnValues(false, // reference invisible
                                                              true, false); // reference visible, note invisible
      var ffn = footnotes({}, w);
      expect(w.$(".fixed-footnotes-note").length).toBe(0);
      expect(w.$(".fixed-footnotes-container").hasClass("fixed-footnotes-empty")).toBe(true);
      ffn.refresh();
      expect(w.$(".fixed-footnotes-note").length).toBe(1);
      expect(w.$(".fixed-footnotes-container").hasClass("fixed-footnotes-empty")).toBe(false);
      done();
    });
  });

});

describe("fixed-footnotes.addRefreshListener", function() {

  it("should add a function executed on refresh", function(done) {
    createDomEnv(EMPTY_BODY, function(w) {
      var ffn = footnotes({}, w);
      ffn.addRefreshListener(done);
      ffn.refresh();
    });
  });

});

describe("fixed-footnotes.removeRefreshListener", function() {

  it("should remove a function from the listener list", function(done) {
    createDomEnv(EMPTY_BODY, function(w) {
      var someObj = { someFunc: function() {}, someFunc2: function() {}, someFunc3: function() {} };
      spyOn(someObj, "someFunc");
      spyOn(someObj, "someFunc2");
      spyOn(someObj, "someFunc3");
      var ffn = footnotes({}, w);
      ffn.addRefreshListener(someObj.someFunc);
      ffn.addRefreshListener(someObj.someFunc2);
      ffn.addRefreshListener(someObj.someFunc3);
      ffn.removeRefreshListener(someObj.someFunc2);
      ffn.refresh();
      setTimeout(function() {
        expect(someObj.someFunc).toHaveBeenCalled();
        expect(someObj.someFunc2).not.toHaveBeenCalled();
        expect(someObj.someFunc3).toHaveBeenCalled();
        done();
      }, 20);
    });
  });

});
