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
        node.hash = transformHash(node.hash, b);
      },

      ElementNode: function(node) {
        node.attributes = transformAttributes(node.attributes, b);
      },

      MustacheStatement: function(node) {
        node.hash = transformHash(node.hash, b);
      },

      SubExpression: function(node) {
        node.hash = transformHash(node.hash, b);
      }
    });
  }

  return ast;
};

function isComponentTemplate(moduleName) {
  return COMPONENT_MODULE_PATTERN.test(moduleName);
}

function transformAttributes(attributes, b) {
  return attributes.map(function(attribute) {
    if (attribute.name === 'class') {
      attribute = transformAttribute(attribute, b);
    }

    return attribute;
  });
}

function transformAttribute(attribute, b) {
  var params = paramsFromClassValue(attribute.value, b);
  var hash = b.hash([b.pair('prefix', b.path('uiPrefix'))]);
  var value = b.mustache('-ui-component-class', params, hash, false);

  return b.attr('class', value);
}

function transformHash(hash, b) {
  return b.hash(hash.pairs.map(function(pair) {
    if (pair.key === 'class') {
      pair = transformHashPair(pair, b);
    }

    return pair;
  }));
}

function transformHashPair(pair, b) {
  var params = paramsFromClassValue(pair.value, b);
  var hash = b.hash([b.pair('prefix', b.path('uiPrefix'))]);
  var value = b.sexpr('-ui-component-class', params, hash, false);

  return b.pair('class', value);
}

function paramsFromClassValue(value, b) {
  switch (value.type) {
    case 'ConcatStatement': // <class="foo {{bar}}">
      return paramsFromConcatStatement(value, b);
    case 'MustacheStatement': // <div class={{foo}}>
      return paramsFromMustacheStatement(value, b);
    case 'StringLiteral': // {{input class="foo"}}
      return paramsFromStringLiteral(value, b);
    case 'SubExpression': // {{input class=(concat "foo" "bar")}}
      return paramsFromSubExpression(value, b);
    case 'TextNode': // <div class="foo bar">
      return paramsFromTextNode(value, b);
    default:
      throw new Error('unrecognized node type "' + value.type + '" for class attribute value');
  }
};

function paramsFromConcatStatement(concatStatement, b) {
  return concatStatement.parts.map(function(node) {
    if (node.type === 'TextNode') {
      node = b.string(node.chars);
    }

    if (node.type === 'MustacheStatement') {
      node = transformMustacheStatementToSubExpression(node, b);
    }

    return node;
  });
}

function paramsFromMustacheStatement(mustacheStatement, b) {
  return [transformMustacheStatementToSubExpression(mustacheStatement, b)];
}

function paramsFromStringLiteral(stringLiteral, b) {
  return [stringLiteral];
}

function paramsFromSubExpression(subExpression, b) {
  var params = subExpression.params.map(function(param) {
    if (param.type === 'TextNode') {
      param = b.string(param.chars);
    }

    if (param.type === 'MustacheStatement') {
      param = transformMustacheStatementToSubExpression(param, b);
    }

    return param;
  });

  return [b.sexpr(subExpression.path, params, subExpression.hash)];
}

function paramsFromTextNode(textNode, b) {
  return [b.string(textNode.chars)];
}

function transformMustacheStatementToSubExpression(mustacheStatement, b) {
  if (mustacheStatement.params.length ||
      mustacheStatement.hash.pairs.length ||
      mustacheStatement.path.original.indexOf('-') !== -1) {
    return b.sexpr(
      mustacheStatement.path,
      mustacheStatement.params,
      mustacheStatement.hash
    );
  }

  return mustacheStatement.path;
}

module.exports = TransformComponentClasses;
