var COMPONENT_MODULE_PATTERN = /.+\/components\/.+/;
var COMPONENT_NAME_PATTERN = /.+\/components\/(.+)\.hbs/;

function TransformComponentClasses(options) {
  this.syntax = null;
  this.options = options;
}

TransformComponentClasses.prototype = {
  transform: function (ast) {
    var moduleName = this.options && this.options.moduleName;
    if (this.isComponentTemplate(moduleName)) {
      return this.transformComponentTemplate(ast);
    }
    return ast;
  },

  isComponentTemplate: function (moduleName) {
    return COMPONENT_MODULE_PATTERN.test(moduleName);
  },

  transformComponentTemplate: function (ast) {
    var walker = new this.syntax.Walker();
    var _this = this;
    walker.visit(ast, function(node) {
      if (node.type === 'ElementNode') {
        _this.transformElementNode(node);
      }
    });
    return ast;
  },

  transformElementNode: function (elementNode) {
    var attributes = elementNode.attributes;

    for (var i=0; i<attributes.length; i++) {
      var attrNode = attributes[i];
      if (attrNode.name === 'class') {
        this.transformClassAttr(attrNode);
      }
    }
  },

  transformClassAttr: function (classAttrNode) {
    var value = classAttrNode.value;
    var componentName = this.options.moduleName.match(COMPONENT_NAME_PATTERN)[1];
    var params;
    switch (value.type) {
      case 'TextNode': // class="foo bar"
        params = paramsFromTextNode(value, componentName);
        break;
      case 'ConcatStatement': // class="foo {{bar}}"
        params = paramsFromConcatStatement(value, componentName);
        break;
      case 'MustacheStatement': // class={{foo}}
        params = paramsFromMustacheStatement(value, componentName);
        break;
      default:
        throw new Error('unrecognized node type "' + value.type + '" for class attribute value');
    }

    classAttrNode.value = {
      type: 'MustacheStatement',
      path: {
        type: 'PathExpression',
        original: '-ui-component-class',
        parts: [ '-ui-component-class' ]
      },
      params: params,
      hash: { type: 'Hash', pairs: [] },
      escaped: true
    };
  }
};

function makeMustacheAnExpression(mustacheStatement) {
  if (mustacheStatement.params.length ||
      mustacheStatement.hash.pairs.length ||
      mustacheStatement.path.original.indexOf('-') !== -1) {
    mustacheStatement.type = 'SubExpression';
    return mustacheStatement;
  }
  return mustacheStatement.path;
}

function paramsFromTextNode(textNode, componentName) {
  return [{
    type: 'StringLiteral',
    original: componentName,
    value: componentName
  }, {
    type: "StringLiteral",
    value: textNode.chars,
    original: textNode.chars
  }];
}

function paramsFromConcatStatement(concatStatement, componentName) {
  var params = concatStatement.parts;
  return [{
    type: 'StringLiteral',
    original: componentName,
    value: componentName
  }].concat(concatStatement.parts.map(function (node) {
    if (node.type === 'MustacheStatement') {
      return makeMustacheAnExpression(node);
    }
    return node;
  }));
}

function paramsFromMustacheStatement(mustacheStatement, componentName) {
  mustacheStatement.type = 'SubExpression';
  return [{
    type: 'StringLiteral',
    original: componentName,
    value: componentName
  }, makeMustacheAnExpression(mustacheStatement)];
}

module.exports = TransformComponentClasses;
