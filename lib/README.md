# Themeing Automation

The theming system works with ember-cli to deliver all the assets needed to support ui components. In the same way Ember brings conventional lookup and wiring to its first class objects, untitled-ui provides this same convenience for themeing.

## Motivation

A goal of untitled-ui is to make themeing as easy and accessible as possible. All that is needed to change the style of a particular component is to create an scss file with the styles that you want to change.

## Implementation

While Ember can generate routes and controllers at runtime, untitled-ui implements themeing by using buildtime and runtime strategies. When untitled-ui detects an scss file in a theme, it will automatically generate any assets that are needed to gracefully override the targeted component. At run time, the components are dynamically looked up based on the subtheming hierarchy, and the availability of components in the themeing component library.

**This gives theme authors the ability to focus on the look and feel of their site—and not concern themselves with the (typically) boilerplate javascript and template.**

Using conventions will also help us in the future to:

- optimize the asset payload size by tuning buildtime and runtime strategies
- help app builders minimize the side affects of maintaining large style codebases
- reduce the override noise when inspecting styles in a browser
- reduce the actual amount of scss that app builders need to write and ship

## Lib Modules

### themeCore

`themeCore` is an object that ember-cli registers themes to, and that manipulates broccoli trees throughout the build. Themes are addons that inherit from untitled-ui's `theme.js` or from a parent theme.

The theme core is a very stateful object, but is available to ember-cli to get information about what each theme contains in the way of scss, js, and hbs files at any point during the build.

This enables us to analyze the subtheming dependency graph and determine which components to generate for a given scss file in a theme. It is also used to serve up the components api which allows for also automating style guides, demo pages, and the interactive theme editor.

### resolver

Just like Ember's resolver knows what to lookup when it enters a route, untitled-ui's resolver knows what component to generate for a given scss file. It accepts the subtheme dependency graph and an scss file path to then return what, if anything, needs to be generated. It does not generate the actual files themselves, which is delegated to the asset preprocessors in the library.




