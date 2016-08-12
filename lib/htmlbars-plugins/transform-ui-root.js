/**
  Replaces

  ```handlebars
  <div {{ui-root}}></div>
  <div {{ui-root}} class="foo"></div>
  ```

  with

  ```handlebars
  <div class=":component {{classes.class}} {{classes.size}}"></div>
  <div class=":component {{classes.class}} {{classes.size}} foo"></div>
  ```
*/

function TransformUIRoot(options) {
  this.syntax = null;
  this.options = options;
}

TransformUIRoot.prototype.transform = function(ast) {
  var b = this.syntax.builders;
  var traverse = this.syntax.traverse;

  traverse(ast, {
    ElementNode: function(node) {
      if (isUIRootNode(node)) {
        node = transformUIRootNode(node, b);
      }

      return node;
    }
  });

  return ast;
};

function isUIRootNode(node) {
  var rootModifiers = node.modifiers.filter(function(modifier) {
    return modifier.path.original === 'ui-root';
  });

  return rootModifiers.length > 0;
}

function transformUIRootNode(node, b) {
  var newAttributes = withoutExistingClassAttr(node.attributes);
  var existingClassAttr = findExistingClassAttr(node.attributes);
  var rootClassAttr = buildRootClassAttr(b, existingClassAttr);

  newAttributes.push(rootClassAttr)

  node.attributes = newAttributes;
}

function buildRootClassAttr(b, existingClassAttr) {
  var parts = [
    b.string(':component '),
    b.path('classes.class'),
    b.string(' '),
    b.path('classes.size'),
    b.string(' ')
  ];

  if (existingClassAttr) {
    parts.push(transformClassAttrValue(existingClassAttr.value, b));
  }

  return b.attr('class', b.concat(parts));
}

function withoutExistingClassAttr(attributes) {
  return attributes.filter(function(attr) {
    return attr.name !== 'class';
  });
}

function findExistingClassAttr(attributes) {
  return attributes.filter(function(attr) {
    return attr.name === 'class';
  })[0];
}

function transformClassAttrValue(value, b) {
  switch (value.type) {
    case 'TextNode':
      return b.string(value.chars);
    case 'ConcatStatement':
      return b.sexpr('concat', value.parts.map(function(part) {
        if (part.type === 'MustacheStatement') {
          part.type = 'SubExpression';
        }

        return part;
      }));
    case 'MustacheStatement':
      value.type = 'SubExpression';
      return value;
    default:
      throw new Error('unrecognized node type "' + value.type + '" for class attribute value');
  }
}

module.exports = TransformUIRoot;
