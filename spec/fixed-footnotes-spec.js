var footnotes = require('../src/fixed-footnotes');
var jsdom = require("jsdom");

describe("fixed-footnotes", function() {

    it("should properly override default options", function(done) {
      jsdom.env("<body></body>", function(err, w) {
        var ffn = footnotes({ referencesSelector: "test" }, w);
        expect(ffn.options.referencesSelector).toBe("test");
        expect(ffn.defaultOptions.referencesSelector).toBe(".footnote");
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

});
