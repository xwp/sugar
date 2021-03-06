test(
  'CommentTest',

  [
    'ephox.sugar.api.node.Comment',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.search.Traverse'
  ],

  function (Comment, Element, Traverse) {
    var ensureClobberedTextNodeDoesNotThrow = function () {
      var span = Element.fromHtml('<span><!--a--></span>');
      Traverse.child(span, 0).each(function (text0) {
        span.dom().innerHTML = 'smashed';
        var v = Comment.get(text0); // Throws in IE10.
        assert.eq('string', typeof(v));
      });
    };

    ensureClobberedTextNodeDoesNotThrow();

    var notComment = Element.fromTag('span');
    var c = Element.fromHtml('<!--a-->');
    assert.eq('a', Comment.get(c));
    Comment.set(c, 'blue');
    assert.eq('blue', c.dom().nodeValue);

    try {
      Comment.get(notComment);
      fail('get on non-comment did not throw');
    } catch (e) {
      // pass
    }

    try {
      Comment.set(notComment, 'bogus');
      fail('set on non-comment did not throw');
    } catch (e) {
      // pass
    }
  }
);
