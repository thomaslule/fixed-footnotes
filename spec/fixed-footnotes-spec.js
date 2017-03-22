var footnotes = require('../src/fixed-footnotes');
var jsdom = require("jsdom");

describe("fixed-footnotes", function() {

  it("should work with no argument", function(done) {
    jsdom.env("<body></body>", ["http://code.jquery.com/jquery.js"], function(err, w) {
      global.window = w;
      var ffn = footnotes();
      expect(w.$("section").length).toBe(1);
      done();
    });
  });

  it("should properly override default options", function(done) {
    jsdom.env("<body></body>", function(err, w) {
      var ffn = footnotes({ referencesSelector: "test" }, w);
      expect(ffn.options.referencesSelector).toBe("test");
      expect(ffn.defaultOptions.referencesSelector).toBe(".reference");
      done();
    });
  });

  it("should create a container as the last node of body", function(done) {
    jsdom.env("<body><div></div></body>", ["http://code.jquery.com/jquery.js"],
    function(err, w) {
      var ffn = footnotes({}, w);
      expect(w.$("body > *:last").prop("tagName")).toBe("SECTION");
      done();
    });
  });

  it("should create the container properly with the options provided", function(done) {
    jsdom.env("<body><div></div></body>", ["http://code.jquery.com/jquery.js"],
    function(err, w) {
      var ffn = footnotes({
        fixedContainerLocation: "div",
        fixedContainerId: "myId",
        fixedContainerClass: "myClass"
      }, w);
      var $container = w.$("div > *:last");
      expect($container.prop("tagName")).toBe("SECTION");
      expect($container.attr("id")).toBe("myId");
      expect($container.hasClass("myClass")).toBe(true);
      done();
    });
  });

  it("should find a note given its reference", function(done) {
    jsdom.env("<body><p class='footnote' href='#note'>reference</p><p id='note'>note</p></body>",
    ["http://code.jquery.com/jquery.js"],
    function(err, w) {
      global.window = w;
      var ffn = footnotes({}, w);
      var note = ffn._getNoteFromRef(w.$(".footnote")[0])
      expect(note.id).toBe("note");
      done();
    });
  });

  it("should return null if the note cant be found", function(done) {
    jsdom.env("<body><p class='footnote' href='#note'>reference</p></body>",
    ["http://code.jquery.com/jquery.js"],
    function(err, w) {
      global.window = w;
      var ffn = footnotes({}, w);
      var note = ffn._getNoteFromRef(w.$(".footnote")[0])
      expect(note).toBe(null);
      done();
    });
  });

  it("should add a note to the container", function(done) {
    jsdom.env("<body><p class='footnote' href='#note'>reference</p><p id='note'>note</p></body>",
    ["http://code.jquery.com/jquery.js"],
    function(err, w) {
      global.window = w;
      var ffn = footnotes({}, w);
      ffn._displayNote(w.$("#note")[0])
      expect(w.$("section p").length).toBe(1);
      done();
    });
  });

  it("should add the note properly with the options", function(done) {
    jsdom.env("<body><p class='footnote' href='#note'>reference</p><p id='note'>note</p></body>",
    ["http://code.jquery.com/jquery.js"],
    function(err, w) {
      global.window = w;
      var ffn = footnotes({
        footnoteClass: "fixed-footnotes-note anotherClass",
        transformNote: function(elem) {
          w.$(elem).text(w.$(elem).text().toUpperCase());
          return elem;
        }
      }, w);
      ffn._displayNote(w.$("#note")[0])
      expect(w.$("section p").length).toBe(1);
      expect(w.$("section p").hasClass("anotherClass")).toBe(true);
      expect(w.$("section p").text()).toBe("NOTE");
      done();
    });
  });

});
