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
  }
};
