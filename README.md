# untitled-ui

## Usage

UI components are used the same way that you would normally use a component.

```hbs
{{#ui-button}}
  Press me
{{/ui-button}}
```

### Kinds

The presentational "kind" component to be used can be specified by providing a
value for the `kind` property of a component:

```hbs
{{#ui-button kind="primary"}}
  Press me
{{/ui-button}}
```

### Sizes

The size of a component can be specified by providing a value for the `size`
property of the component:

```hbs
{{#ui-button size="small"}}
  Press me
{{/ui-button}}
```

The size of the component will determine things like font size and spacing.

Available sizes:

- `x-small`
- `small`
- `medium` (default)
- `large`
- `x-large`

### Classes

The `class` property can be used to set classes on the presentational component:

```hbs
{{#ui-button class="myspecialbutton"}}
  Press me
{{/ui-button}}
```

Any classes that you set will be prefixed with the name of the component, so the
class in the previous example will end up as
`ui-button--default--myspecialbutton`.

### Block Components

Some components are meant to be used in block form. These components will use
the `component` helper to yield their presentational component as a block
parameter. The yielded component will expose its API, usually consisting of
components and/or actions:

For example, the `ui-panel` yields additional `titlebar` and `content`
components:

```hbs
{{#ui-panel as |p|}}
  {{#p.titlebar}}
    Some Title
  {{/p.titlebar}}

  {{#p.content}}
    Some content for the panel.
  {{/p.content}}
{{/ui-panel}}
```

## Overview

### Behavioral Components

One of the goals of untitled-ui is to provide a set of reusable components for
bits of UI that are common across most apps. These components will provide a
public API that defines their functionality. This functionality is provided by
a component that extends the base `ui-component` component.

An example of a behavioral component is the `ui-button` component:

```hbs
{{#ui-button}}
  Press me
{{/ui-button}}
```

Behavioral components delegate their presentation to another component, which we
refer to as a "kind" component. The public API of the behavioral component will
be exposed as properties passed to the presentational component.

### Presentational Components

If a specific "kind" is not specified when the behavioral component is invoked,
the default "kind" for that UI component will be used.

In the previous example, we invoked the `ui-button` component without specifying
a kind, which is the same as specifying the "default" kind:

```hbs
{{#ui-button kind="default"}}
  Press me
{{/ui-button}}
```

This will result in the `ui-button--default` kind component being used for
presenting the `ui-button`. The public API of the behavioral component will be
exposed as properties passed to the kind component.

A behavioral component, such as a `ui-button`, is likely to have multiple
different ways of being presented throughout an app. For example, an application
might have "default", "primary", and "secondary" kinds of buttons.

The kind can be specified when the component is invoked:

```hbs
{{#ui-button kind="primary"}}
  Press me
{{/ui-button}}
```

This will use the same behavioral `ui-button` component but will delegate its
presentation to the `ui-button--primary` kind component.

A very simple example of what this delegation looks like can be seen in the
following example:

```hbs
{{! addon/templates/components/ui-example.hbs}}

{{#component frame as |component|}}
  {{yield component}}
{{/component}}
```

The value for `frame` is determined by the name of the component and the value
of `kind`. For example, if the kind is "default", the value of `frame` would be
`"ui-example--default"`.

### Component Styles

CSS styles for UI Components are written using SASS and a special `@component`
syntax, similar to defining a SASS mixin.

For example, the styles for the "default" kind of a `ui-example` component could
be written as follows:

```scss
// addon/styles/components/ui-example--default.scss

@component($background: red) {
  background: $background;
}
```

Defining a component's styles with the `@component` syntax will create both a
SASS mixin and a class that includes that mixin automatically based on the name
of the file.

For example, the SASS output from the previous example is as follows:

```scss
@mixin ui-example--default($background: red) {
  background: $background;
}

.ui-example--default {
  @include ui-example--default();
}
```

The naming conventions here are important because the resulting class matches
the class that is automatically applied to the component with the same name.

Creating all of our styles via mixins is important for creating additional kinds
as well as theming because it allows us to define an API for customizing a
component's styles without relying on the CSS cascade.

For example, if we wanted to create the "happy" kind of our `ui-example`
component, we can use the mixin provided by the "default" kind:

```scss
// addon/styles/components/ui-example--happy.scss

@import "./ui-example--default";

@component($background: green) {
  @include ui-example--default($background: $background);
}
```

The resulting mixins act like functions and allow for composability without
relying on the CSS cascade. When the "happy" kind of `ui-example` component is
rendered, it will only have the `.ui-example--happy` class rather than the
traditional method of composing CSS styles by applying additional modifier
classes that rely on specificity.

## Build Tools

### Autoprefixing

Any classes written in the template of a kind component will be automatically
prefixed with the name of the component.

For example:

```hbs
// addon/templates/styles/components/ui-example--default.hbs

<div class=":component foo">
  <div class="bar">
  </div>
</div>
```

Would result in the following:

```html
<div class="ui-example--default ui-example--default--foo">
  <div class="ui-example-default--bar">
  </div>
</div>
```

## Themes

### Overview

untitled-ui components are defined and/or customized via themes.

Themes are used to provide a customized set of kind components. Themes allow
their author the ability to customize both the CSS and the presentational markup
of UI components.

For example, the `ui-button` component provided by [ui-base-theme][] has both
"default" and "primary" kinds. A theme author can customize the presentation for
"default" and "primary" kinds for their theme.

### ui-base-theme

[ui-base-theme][] is the base theme that other themes will build on top of. It
contains the default set of components along with very basic styling. The base
theme is not intended to be used by itself but is a starting point. The goal is
for consumers to start by installing a theme, which is built on top of
ui-base-theme.

### SASS

The easiest way to theme a component is by creating a SASS stylesheet that
follows the component naming scheme.

For example, if you wanted to create your theme's version of the "default" kind
of the `ui-example` component, you would create the following stylesheet:

```scss
// addon/stylesheets/components/ui-example--default.scss

@import "./ui-example--default";

@component($background: green) {
  @include ui-example--default($background: $background);
}
```

**Note:** Just creating this stylesheet is enough for the build tools to generate the app
and addon components with the same name for you.

### Templates

You can also customize the template for components when creating a theme.

For example, if your theme wanted to change the template for the
`ui-example--default` kind component, you could create the following:

```hbs
// addon/templates/components/ui-example--default.hbs

<div class=":component {{classes.class}} {{classes.size}}">
  <p>This is some dummy content.</p>
  <p>This whole template is special for my theme.</p>
</div>
```

## Addons Overview

Brief descriptions of the responsibilities of the different addons.

### [untitled-ui][]

[untitled-ui][] is a collection of build tools that are used by the other
addons. Some of its responsibilities are autoprefixing CSS classes and
autogenerating component files.

### [ui-base-theme][]

[ui-base-theme][] is the base theme that all other themes will build on top of.
It includes the base set of behavioral components and presentational kind
components along with minimal styling.

### [ui-tomato-theme][]

[ui-tomato-theme][] is an example theme being created to test out theming. This
theme is being used in the [ui-testapp][].

### [ui-testapp][]

[ui-testapp][] is an example of an app that consumes a theme. The theme that it
uses is the [ui-tomato-theme][].

## Debugging

`untitled-ui` uses [debug][] to optionally log helpful messages during the build.

```shell
# to log all messages
$ DEBUG=untitled-ui:* ember s

# to log specific module messages
$ DEBUG=untitled-ui:resolver ember s
```

[debug]: https://github.com/visionmedia/debug
[ui-base-theme]: https://github.com/prototypal-io/ui-base-theme
[ui-testapp]: https://github.com/prototypal-io/ui-testapp
[ui-tomato-theme]: https://github.com/prototypal-io/ui-tomato-theme
[untitled-ui]: https://github.com/prototypal-io/untitled-ui
