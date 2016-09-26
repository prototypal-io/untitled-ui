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
        transformUIRootNode(node, b);
      }
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
  var rootClassAttr = buildRootClassAttr(node, b);

  newAttributes.push(rootClassAttr)

  node.attributes = newAttributes;
  node.modifiers = withoutUIRootModifier(node);
}

function buildRootClassAttr(node, b) {
  var existingClassAttr = findExistingClassAttr(node.attributes);
  var parts = partsForRootClassAttr(b);

  if (existingClassAttr) {
    parts = parts.concat(partsFromExistingClassAttr(existingClassAttr.value, b));
  }

  return b.attr('class', b.concat(parts));
}

function partsForRootClassAttr(b) {
  return [
    b.text(':component '),
    b.mustache(b.path('classes.class')),
    b.text(' '),
    b.mustache(b.path('classes.size')),
    b.text(' ')
  ];
}

function partsFromExistingClassAttr(attr) {
  switch (attr.type) {
    case 'TextNode':
      return [attr];
    case 'ConcatStatement':
      return attr.parts;
    default:
      throw new Error('unrecognized node type "' + attr.type + '" for existing class attribute');
  }
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

function withoutUIRootModifier(node) {
  return node.modifiers.filter(function(modifier) {
    return modifier.path.original !== 'ui-root';
  });
}

module.exports = TransformUIRoot;
