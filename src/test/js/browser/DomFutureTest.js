asynctest(
  'Browser Test: .DomFutureTest',

  [
    'ephox.sugar.api.dom.Compare',
    'ephox.sugar.api.dom.DomFuture',
    'ephox.sugar.api.node.Element'
  ],

  function (Compare, DomFuture, Element) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    var testElement = Element.fromTag('button');

    DomFuture.waitFor(testElement, 'click', 1000).get(function (res) {
      assert.eq(true, res.isError(), 'Result should be error as click has not yet occurred.');

      DomFuture.waitFor(testElement, 'click', 1000).get(function (res) {
        res.fold(
          function (err) {
            assert.fail('Future should have returned value(event). Instead returned error(' + err + ')');
          },
          function (val) {
            assert.eq(true, Compare.eq(testElement, val.target()), 'Checking that the target of the event is correct');
            success();
          }
        );
      });

      // TODO: test timeout on click
      testElement.dom().click();
    });

  }
);
