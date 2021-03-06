test(
  'InsertTest',

  [
    'ephox.sugar.api.properties.Class',
    'ephox.sugar.api.properties.Classes',
    'ephox.sugar.api.properties.Html',
    'ephox.sugar.api.dom.Insert',
    'ephox.sugar.test.Div',
    'ephox.sugar.test.EphoxElement'
  ],

  function (Class, Classes, Html, Insert, Div, EphoxElement) {
    var container = Div();
    var span = EphoxElement('span');
    var ol = EphoxElement('ol');
    var li1 = EphoxElement('li');
    var li2 = EphoxElement('li');
    var li3 = EphoxElement('li');
    var li4 = EphoxElement('li');
    var li0 = EphoxElement('li');
    Classes.add(li2, ['second', 'third']);
    Class.add(li3, 'l3');
    Class.add(li4, 'l4');
    Class.add(li0, 'l0');
    var p = EphoxElement('p');
    var p2 = EphoxElement('p');

    Insert.append(container, p);
    Insert.append(container, p2);
    Insert.append(p, span);
    assert.eq('<p><span></span></p><p></p>', Html.get(container));

    Insert.before(p, ol);
    assert.eq('<ol></ol><p><span></span></p><p></p>', Html.get(container));

    Insert.append(ol, li1);
    Insert.after(li1, li2);
    Insert.after(li2, li4);

    assert.eq('<ol><li></li><li class="second third"></li><li class="l4"></li></ol><p><span></span></p><p></p>', Html.get(container));

    Insert.before(li4, li3);

    assert.eq('<ol><li></li><li class="second third"></li><li class="l3"></li><li class="l4"></li></ol><p><span></span></p><p></p>', Html.get(container));

    Insert.prepend(ol, li0);

    assert.eq('<ol><li class="l0"></li><li></li><li class="second third"></li><li class="l3"></li><li class="l4"></li></ol><p><span></span></p><p></p>', Html.get(container));
  }
);
