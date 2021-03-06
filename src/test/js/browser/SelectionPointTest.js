asynctest(
  'Browser Test: Selection.getAtPoint',

  [
    'ephox.sand.api.PlatformDetection',
    'ephox.sugar.api.dom.Compare',
    'ephox.sugar.api.dom.Insert',
    'ephox.sugar.api.dom.Remove',
    'ephox.sugar.api.events.DomEvent',
    'ephox.sugar.api.node.Body',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.node.Node',
    'ephox.sugar.api.search.Selectors',
    'ephox.sugar.api.search.Traverse',
    'ephox.sugar.api.selection.Selection',
    'ephox.sugar.api.selection.WindowSelection',
    'global!setTimeout'
  ],

  function (PlatformDetection, Compare, Insert, Remove, DomEvent, Body, Element, Node, Selectors, Traverse, Selection, WindowSelection, setTimeout) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    var browser = PlatformDetection.detect().browser;
    if (!browser.isIE()) {
      // This is an IE test, as other platforms have native implementations (including Edge)
      success();
      return;
    }

    var iframe = Element.fromHtml('<iframe style="position: fixed; top: 0; left: 0; height:700px; width:700px;" src="project/src/test/data/points.html"></iframe>');
    Insert.append(Body.body(), iframe);
    var run = DomEvent.bind(iframe, 'load', function () {
      run.unbind();
      // IE doesn't render it immediately
      setTimeout(function () {
        try {
          checks();
          success();
        } catch (e) {
          failure(e);
        } finally {
          Remove.remove(iframe);
        }
      }, 100);
    });

    var checks = function () {
      var iframeWin = iframe.dom().contentWindow;
      var iframeDoc = Element.fromDom(iframeWin.document);

      var get = function (selector) {
        return Selectors.one(selector, iframeDoc).getOrDie('element with selector "' + selector + '" not found');
      };

      var check = function (x, y, expected) {
        var found = WindowSelection.getAtPoint(iframeWin, x, y);
        var raw = found.getOrDie('point ' + x + ',' + y + ' not found');
        WindowSelection.setExact(iframeWin, raw.start(), raw.soffset(), raw.finish(), raw.foffset());

        var range = WindowSelection.getExact(iframeWin).getOrDie('Could not get window selection after setting it');
        var starts = Compare.eq(expected.start(), range.start());
        assert.eq(true, starts, 'start elements were not equal, was ' + Node.name(range.start()));
        assert.eq(expected.soffset(), range.soffset());
        assert.eq(true, Compare.eq(expected.finish(), range.finish()), 'finish elements were not equal, was ' + Node.name(range.finish()));
        assert.eq(expected.foffset(), range.foffset());
      };

      var outside = Traverse.children(get('.outside'))[0];

      check(0, 0, Selection.range(outside, 1, outside, 1));
      check(5, 5, Selection.range(outside, 1, outside, 1));
      check(5, 100, Selection.range(outside, 1, outside, 1));
      check(5, 200, Selection.range(outside, 1, outside, 1));
      check(5, 300, Selection.range(outside, 1, outside, 1));
      check(5, 400, Selection.range(outside, 1, outside, 1));
      check(5, 500, Selection.range(outside, 1, outside, 1));
      check(5, 600, Selection.range(outside, 1, outside, 1));

      check(100, 20, Selection.range(outside, 6, outside, 6));
      check(200, 20, Selection.range(outside, 6, outside, 6));
      check(300, 20, Selection.range(outside, 6, outside, 6));
      check(400, 20, Selection.range(outside, 6, outside, 6));
      check(500, 20, Selection.range(outside, 6, outside, 6));
      check(600, 20, Selection.range(outside, 6, outside, 6));

      var div = get('div');

      var one = Traverse.children(get('.one'))[0];
      check(100, 100, Selection.range(one, 1, one, 1));
      check(150, 100, Selection.range(one, 1, one, 1));
      check(500, 100, Selection.range(div, 11, div, 11)); // Ideally should be (one, 4)
      check(150, 150, Selection.range(one, 1, one, 1));
      check(180, 160, Selection.range(one, 3, one, 3));

      var two = Traverse.children(get('.two'));
      check(100, 220, Selection.range(two[0], 5, two[0], 5)); // 5 because of the whitespace :(
      check(150, 220, Selection.range(two[0], 5, two[0], 5));

      // heavily nested checks
      var three = Traverse.children(get('.three'))[0];
      check(300, 220, Selection.range(three, 0, three, 0));
      var four = Traverse.children(get('.four'))[0];
      check(151, 240, Selection.range(four, 1, four, 1));

      // filler checks
      var five = Traverse.children(get('.five'))[0];
      check(150, 300, Selection.range(five, 1, five, 1));
      var six = Traverse.children(get('.six'))[0];
      check(150, 370, Selection.range(six, 1, six, 1));

      // floating checks
      var seven = Traverse.children(get('.seven'))[0];
      check(310, 535, Selection.range(seven, 5, seven, 5)); // whitespace again
      var eight = Traverse.children(get('.eight'))[0];
      check(550, 535, Selection.range(eight, 0, eight, 0));
    };
  }
);