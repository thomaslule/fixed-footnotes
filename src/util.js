module.exports = {
  /*
   * Remove all children from an element
   */
  emptyElement: function(element) {
    var node;
    while ((node = element.lastChild)) element.removeChild(node);
  },

  /*
   * Remove id of this element and its children.
   */
  removeAllIds: function (node) {
    node.id = "";
    var children = node.getElementsByTagName('*');
    for (var i = 0; i < children.length; i++) {
      children[i].id = "";
    }
  },

  /*
   * Returns true if the element is currently in the viewport's limits, even partially.
   */
  isElementInViewport: function (element, w) {
      var rect = element.getBoundingClientRect();
      return (
          rect.bottom >= 0 &&
          rect.right >= 0 &&
          rect.top <= (w.innerHeight || w.document.documentElement.clientHeight) &&
          rect.left <= (w.innerWidth || w.document.documentElement.clientWidth)
      );
  }
};
