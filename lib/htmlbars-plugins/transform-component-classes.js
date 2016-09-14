var COMPONENT_MODULE_PATTERN = /.+\/components\/.+/;

function TransformComponentClasses(options) {
  this.syntax = null;
  this.options = options;
}

TransformComponentClasses.prototype.transform = function(ast) {
  var moduleName = this.options && this.options.moduleName;
  var traverse = this.syntax.traverse;
  var b = this.syntax.builders;

  if (isComponentTemplate(moduleName)) {
    traverse(ast, {
      BlockStatement: function(node) {
        transformClassHashPairs(node, b);
      },

      ElementNode: function(node) {
        transformClassAttributes(node, b);
      },

      MustacheStatement: function(node) {
        transformClassHashPairs(node, b);
      },

      SubExpression: function(node) {
        transformClassHashPairs(node, b);
      }
    });
  }

  return ast;
};

function transformClassAttributes(node, b) {
  node.attributes.forEach(function(attribute) {
    if (attribute.name === 'class') {
      attribute.value = transformClassValue(attribute.value, b);
    }
  });
}

function transformClassHashPairs(node, b) {
  node.hash.pairs.forEach(function(pair) {
    if (pair.key === 'class') {
      pair.value = transformClassValue(pair.value, b);
    }
  });
}

function transformClassValue(value, b) {
  var params;

  switch (value.type) {
    case 'ConcatStatement': // <class="foo {{bar}}">
      params = paramsFromConcatStatement(value);
      break;
    case 'MustacheStatement': // <div class={{foo}}>
      params = paramsFromMustacheStatement(value);
      break;
    case 'StringLiteral': // {{input class="foo"}}
      params = [value];
      break;
    case 'SubExpression': // {{input class=(concat "foo" "bar")}}
      params = [value];
      break;
    case 'TextNode': // <div class="foo bar">
      params = paramsFromTextNode(value);
      break;
    default:
      throw new Error('unrecognized node type "' + value.type + '" for class attribute value');
  }

  return b.mustache(
    '-ui-component-class',
    params,
    b.hash([b.pair('prefix', b.path('uiPrefix'))]),
    false
  );
};

function isComponentTemplate(moduleName) {
  return COMPONENT_MODULE_PATTERN.test(moduleName);
}

function paramsFromTextNode(textNode) {
  return [{
    type: "StringLiteral",
    value: textNode.chars,
    original: textNode.chars
  }];
}

function paramsFromConcatStatement(concatStatement) {
  return concatStatement.parts.map(function (node) {
    if (node.type === 'MustacheStatement') {
      return makeMustacheAnExpression(node);
    }
    return node;
  });
}

function paramsFromMustacheStatement(mustacheStatement) {
  mustacheStatement.type = 'SubExpression';
  return [makeMustacheAnExpression(mustacheStatement)];
}

function makeMustacheAnExpression(mustacheStatement) {
  if (mustacheStatement.params.length ||
      mustacheStatement.hash.pairs.length ||
      mustacheStatement.path.original.indexOf('-') !== -1) {
    mustacheStatement.type = 'SubExpression';
    return mustacheStatement;
  }
  return mustacheStatement.path;
}

module.exports = TransformComponentClasses;
