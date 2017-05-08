var util = require('../src/util');
var jsdom = require("jsdom");

describe("util.emptyElement", function() {

  it("should remove all child elements", function(done) {
    jsdom.env("<body></body>", function(err, w) {
      var ul = w.document.createElement("UL");
      ul.appendChild(w.document.createElement("LI"));
      ul.appendChild(w.document.createElement("LI"));
      ul.appendChild(w.document.createElement("LI"));
      expect(ul.childElementCount).toBe(3);
      util.emptyElement(ul);
      expect(ul.childElementCount).toBe(0);
      done();
    });
  });

  it("shouldn't do anything when element is already empty", function(done) {
    jsdom.env("<body></body>", function(err, w) {
      var ul = w.document.createElement("UL");
      expect(ul.childElementCount).toBe(0);
      util.emptyElement(ul);
      expect(ul.childElementCount).toBe(0);
      done();
    });
  });

});

describe("util.removeAllIds", function() {

  it("should remove the id of the element and of its children", function(done) {
    jsdom.env("<body></body>", function(err, w) {
      var ul = w.document.createElement("UL");
      ul.id = "id0";
      var li1 = w.document.createElement("LI");
      li1.id = "id1";
      var li2 = w.document.createElement("LI");
      li2.id = "id2";
      ul.appendChild(li1);
      ul.appendChild(li2);

      util.removeAllIds(ul);

      expect(ul.id).toBe("");
      expect(li1.id).toBe("");
      expect(li2.id).toBe("");

      done();
    });
  });

});
