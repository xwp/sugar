define(
  'ephox.sugar.selection.query.CaretRange',

  [
    'ephox.katamari.api.Option',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.search.Traverse',
    'ephox.sugar.api.selection.Selection',
    'ephox.sugar.selection.query.ContainerPoint',
    'ephox.sugar.selection.query.EdgePoint',
    'global!document',
    'global!Math'
  ],

  function (Option, Element, Traverse, Selection, ContainerPoint, EdgePoint, document, Math) {
    var caretPositionFromPoint = function (doc, x, y) {
      return Option.from(doc.dom().caretPositionFromPoint(x, y)).bind(function (pos) {
        // It turns out that Firefox can return null for pos.offsetNode
        if (pos.offsetNode === null) return Option.none();
        var r = doc.dom().createRange();
        r.setStart(pos.offsetNode, pos.offset);
        r.collapse();
        return Option.some(r);
      });
    };

    var caretRangeFromPoint = function (doc, x, y) {
      return Option.from(doc.dom().caretRangeFromPoint(x, y));
    };

    var searchTextNodes = function (doc, node, x, y) {
      var r = doc.dom().createRange();
      r.selectNode(node.dom());
      var rect = r.getBoundingClientRect();
      // Clamp x,y at the bounds of the node so that the locate function has SOME chance
      var boundedX = Math.max(rect.left, Math.min(rect.right, x));
      var boundedY = Math.max(rect.top, Math.min(rect.bottom, y));

      return ContainerPoint.locate(doc, node, boundedX, boundedY);
    };

    var searchFromPoint = function (doc, x, y) {
      // elementFromPoint is defined to return null when there is no element at the point
      // This often happens when using IE10 event.y instead of event.clientY
      return Option.from(doc.dom().elementFromPoint(x, y)).map(Element.fromDom).bind(function (elem) {
        // used when the x,y position points to an image, or outside the bounds
        var fallback = function () {
          return EdgePoint.search(doc, elem, x);
        };

        return Traverse.children(elem).length === 0 ? fallback() :
                // if we have children, search for the right text node and then get the offset out of it
                searchTextNodes(doc, elem, x, y).orThunk(fallback);
      });
    };

    var availableSearch = document.caretPositionFromPoint ? caretPositionFromPoint :  // defined standard
                          document.caretRangeFromPoint ? caretRangeFromPoint :        // webkit implementation
                          searchFromPoint;                                            // fallback


    var fromPoint = function (win, x, y) {
      var doc = Element.fromDom(win.document);
      return availableSearch(doc, x, y).map(function (rng) {
        return Selection.range(
          Element.fromDom(rng.startContainer),
          rng.startOffset,
          Element.fromDom(rng.endContainer),
          rng.endOffset
        );
      });
    };

    return {
      fromPoint: fromPoint
    };
  }
);
