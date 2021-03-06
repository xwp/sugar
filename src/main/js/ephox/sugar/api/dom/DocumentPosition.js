define(
  'ephox.sugar.api.dom.DocumentPosition',

  [
    'ephox.sugar.api.dom.Compare',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.search.Traverse'
  ],

  function (Compare, Element, Traverse) {
    var makeRange = function (start, soffset, finish, foffset) {
      var doc = Traverse.owner(start);

      // TODO: We need to think about a better place to put native range creation code. Does it even belong in sugar?
      // Could the `Compare` checks (node.compareDocumentPosition) handle these situations better?
      var rng = doc.dom().createRange();
      rng.setStart(start.dom(), soffset);
      rng.setEnd(finish.dom(), foffset);
      return rng;
    };

    // Return the deepest - or furthest down the document tree - Node that contains both boundary points
    // of the range (start:soffset, finish:foffset).
    var commonAncestorContainer = function (start, soffset, finish, foffset) {
      var r = makeRange(start, soffset, finish, foffset);
      return Element.fromDom(r.commonAncestorContainer);
    };

    var after = function (start, soffset, finish, foffset) {
      var r = makeRange(start, soffset, finish, foffset);

      var same = Compare.eq(start, finish) && soffset === foffset;
      return r.collapsed && !same;
    };

    return {
      after: after,
      commonAncestorContainer: commonAncestorContainer
    };
  }
);