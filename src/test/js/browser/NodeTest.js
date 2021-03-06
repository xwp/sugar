test(
  'NodeTest',

  [
    'ephox.katamari.api.Arr',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.node.Node',
    'ephox.sugar.api.node.NodeTypes',
    'ephox.sugar.api.search.Traverse',
    'ephox.sugar.test.EphoxElement'
  ],

  function (Arr, Element, Node, NodeTypes, Traverse, EphoxElement) {

    var check = function(node, nodeType, nodeName, nodeValue, isElement, isText, isDocument) {
      assert.eq(nodeType, Node.type(node));
      assert.eq(nodeName, Node.name(node));
      assert.eq(nodeValue, Node.value(node));
      assert.eq(isElement, Node.isElement(node));
      assert.eq(isText, Node.isText(node));
      assert.eq(isDocument, Node.isDocument(node));
    };


    check(
      EphoxElement('p'),
      NodeTypes.ELEMENT,
      'p',
      null,
      true,
      false,
      false
    );

    check(
      Element.fromDom(document.createTextNode('gobble')),
      NodeTypes.TEXT,
      '#text',
      'gobble',
      false,
      true,
      false
    );

    check(
      Element.fromDom(document),
      NodeTypes.DOCUMENT,
      '#document',
      null,
      false,
      false,
      true
    );

    var checkIs = function (expected, predicate, inputs) {
      var actual = Arr.map(inputs, function (raw) {
        var element = Element.fromHtml(raw);
        var input = Traverse.firstChild(element).getOrDie();
        return predicate(input);
      });

      assert.eq(expected, actual);
    };

    var data = [ '<div>Hello</div>', '<div><span>Hello</span></div>', '<div><!-- I am a comment --></div>' ];

    checkIs([ true, false, false ], Node.isText, data);
    checkIs([ false, false, true ], Node.isComment, data);
    checkIs([ false, true, false ], Node.isElement, data);
  }
);
