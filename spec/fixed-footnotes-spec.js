var proxyquire =  require('proxyquire');
var utilStub = {};
var footnotes = proxyquire('../src/fixed-footnotes', { "./util": utilStub });
var jsdom = require("jsdom");

describe("fixed-footnotes.constructor", function() {

  it("should create a container as the last node of body", function(done) {
    jsdom.env("<body></body>", ["http://code.jquery.com/jquery.js"], function(err, w) {
      global.window = w;
      footnotes();
      expect(w.$("body > *:last").hasClass("fixed-footnotes-container")).toBe(true);
      done();
    });
  });

  it("should use the window passed as parameter", function(done) {
    jsdom.env("<body></body>", ["http://code.jquery.com/jquery.js"], function(err, w) {
      footnotes({}, w);
      expect(w.$(".fixed-footnotes-container").length).toBe(1);
      done();
    });
  });

  it("should display a note if its reference is visible and the original note isn't", function(done) {
    jsdom.env("<body><p class='reference' href='#note'>reference</p><p id='note'>note</p></body>", ["http://code.jquery.com/jquery.js"], function(err, w) {
      spyOn(utilStub, "isElementInViewport").and.returnValues(true, false); // reference visible, note invisible
      footnotes({}, w);
      expect(w.$(".fixed-footnotes-note").length).toBe(1);
      done();
    });
  });

  it("shouldn't display a note if its reference is not visible", function(done) {
    jsdom.env("<body><p class='reference' href='#note'>reference</p><p id='note'>note</p></body>", ["http://code.jquery.com/jquery.js"], function(err, w) {
      spyOn(utilStub, "isElementInViewport").and.returnValues(false); // reference invisible
      footnotes({}, w);
      expect(w.$(".fixed-footnotes-note").length).toBe(0);
      done();
    });
  });

  it("shouldn't display a note if its original note is visible", function(done) {
    jsdom.env("<body><p class='reference' href='#note'>reference</p><p id='note'>note</p></body>", ["http://code.jquery.com/jquery.js"], function(err, w) {
      spyOn(utilStub, "isElementInViewport").and.returnValues(true, true); // reference visible, note visible
      footnotes({}, w);
      expect(w.$(".fixed-footnotes-note").length).toBe(0);
      done();
    });
  });

  it("should take the options into account", function(done) {
    jsdom.env("<body><p class='myReference' href='#note'>reference</p><p id='note'>note</p><div id='myParent'></div></body>", ["http://code.jquery.com/jquery.js"], function(err, w) {
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
    jsdom.env("<body><p class='reference' href='#note'>reference</p></body>", ["http://code.jquery.com/jquery.js"], function(err, w) {
      spyOn(utilStub, "isElementInViewport").and.returnValues(true, false); // reference visible, note invisible
      footnotes({}, w);
      expect(w.$(".fixed-footnotes-note").length).toBe(0);
      done();
    });
  });

});

describe("fixed-footnotes.stop", function() {

  it("should remove the footnotes container and all its notes", function(done) {
    jsdom.env("<body><p class='reference' href='#note'>reference</p><p id='note'>note</p></body>", ["http://code.jquery.com/jquery.js"], function(err, w) {
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
    jsdom.env("<body><p class='reference' href='#note'>reference</p><p id='note'>note</p></body>", ["http://code.jquery.com/jquery.js"], function(err, w) {
      spyOn(utilStub, "isElementInViewport").and.returnValues(false, // reference invisible
                                                              true, false); // reference visible, note invisible
      var ffn = footnotes({}, w);
      expect(w.$(".fixed-footnotes-note").length).toBe(0);
      ffn.refresh();
      expect(w.$(".fixed-footnotes-note").length).toBe(1);
      done();
    });
  });

});

describe("fixed-footnotes.addRefreshListener", function() {

  it("should add a function executed on refresh", function(done) {
    jsdom.env("<body></body>", ["http://code.jquery.com/jquery.js"], function(err, w) {
      var ffn = footnotes({}, w);
      ffn.addRefreshListener(done);
      ffn.refresh();
    });
  });

});

describe("fixed-footnotes.removeRefreshListener", function() {

  it("should remove a function from the listener list", function(done) {
    jsdom.env("<body></body>", ["http://code.jquery.com/jquery.js"], function(err, w) {
      var someObj = { someFunc: () => false };
      spyOn(someObj, "someFunc");
      var ffn = footnotes({}, w);
      ffn.addRefreshListener(someObj.someFunc);
      ffn.removeRefreshListener(someObj.someFunc);
      ffn.refresh();
      setTimeout(function() {
        expect(someObj.someFunc).not.toHaveBeenCalled();
        done();
      }, 20);
    });
  });

});
