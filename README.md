# flatpickr Bulma Theme

[Bulma](https://bulma.io) theme for [flatpickr](https://flatpickr.js.org) built with [Sass](https://sass-lang.com)

## Demo

- [Demo](https://raw.githack.com/mymth/flatpickr-bulma-theme/v0.1/examples/)

## Usage

#### for Node.js

Install the package using npm.

```sh
npm i -D flatpickr-bulma-theme
```

Import `flatpickr-bulma.scss` after importing Bulma.

```scss
@import "../node_modules/bulma/bulma";
//...
@import "../node_modules/flatpickr-bulma-theme/flatpickr-bulma";
```

> If you don't need RTL support, you can import `src/sass/flatpickr.scss` instead for smaller file size.

#### for browser

Instead of flatpickr's, include this theme's css in your HTML file

- from CDN

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr-bulma-theme/dist/flatpickr-bulma.min.css">
```

- or, download `dist/flatpickr-bulma.css` into your project

```html
<link rel="stylesheet" type="text/css" href="_your_css_dir_/flatpickr-bulma.css">
```

## Customize

You can use these variables to customize this theme. (For the computed values, see [Bulma's document](https://bulma.io/documentation/customize/variables/))

### Variables

Name|Type|Default value
---|---|---
`$flatpickr-font-size`|`size`|`$size-normal`
`$flatpickr-month-font-size`|`size`|`$size-medium`
`$flatpickr-line-height`|`size`|`1.5`
`$flatpickr-day-size`|`size`|`2.5rem`
`$flatpickr-month-nav-height`|`size`|`2.25rem`
`$flatpickr-weekdays-height`|`size`|`$size-small * 1.5`
`$flatpickr-calendar-background`|`color`|`$white`
`$flatpickr-calendar-border-color`|`color`|`rgba($black, 0.1)`
`$flatpickr-calendar-shadow`|`size`|`0 2px 3px $flatpickr-calendar-border-color`
`$flatpickr-month-background`|`color`|`transparent`
`$flatpickr-month-foreground`|`color`|`$text-strong`
`$flatpickr-arrow-hover-color`|`color`|`$red`
`$flatpickr-weekdays-background`|`color`|`transparent`
`$flatpickr-weekdays-foreground`|`color`|`$text-light`
`$flatpickr-day-foreground`|`color`|`$text`
`$flatpickr-day-hover-background`|`color`|`$light`
`$flatpickr-today-color`|`color`|`$primary`
`$flatpickr-today-fg-color`|`color`|`$white`
`$flatpickr-selected-day-background`|`color`|`$link`
`$flatpickr-selected-day-foreground`|`color`|`$white`
`$flatpickr-disabled-color`|`color`|`$text-light`
`$flatpickr-disabled-border-color`|`color`|`transparent`
`$flatpickr-disabled-day-foreground`|`color`|`$grey-lighter`

## Plugins

The package includes stylesheet for plugins. To use them, simply include the stylesheet file into your project after this theme. You can also customize the stylesheet using the variables. 

### confirmDate

```js
@import "../node_modules/flatpickr-bulma-theme/src/plugins/confirmDate/confirmDate";
```
or
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr-bulma-theme/dist/plugins/confirmDate.min.css">
```

#### Variables

Name|Type|Default value
---|---|---
`$flatpickr-confirm-height`|`size`|`2.25rem`
`$flatpickr-confirm-background`|`color`|`$background`

### weekSelect

```js
@import "../node_modules/flatpickr-bulma-theme/src/plugins/weekSelect/weekSelect";
```
or
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr-bulma-theme/dist/plugins/weekSelect.min.css">
```

### shortcut-buttons-flatpickr

Stylesheet for the [Shortcut buttons](https://github.com/jcsmorais/shortcut-buttons-flatpickr) plugin ([shortcut-buttons-flatpickr](https://github.com/jcsmorais/shortcut-buttons-flatpickr)).

```js
@import "../node_modules/flatpickr-bulma-theme/src/plugins/shortcut-buttons-flatpickr/shortcut-buttons-flatpickr";
```
or
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr-bulma-theme/dist/plugins/shortcut-buttons-flatpickr.min.css">
```

#### Variables

Name|Type|Default value
---|---|---
`$flatpickr-scbtns-background`|`color`|`$background`
`$flatpickr-scbtns-foreground`|`color`|`$flatpickr-day-foreground`
`$flatpickr-scbtns-button-font-size`|`size`|`$size-small`
`$flatpickr-scbtns-button-line-height`|`size`|`1.5`
`$flatpickr-scbtns-button-color`|`color`|`$grey-darker`
`$flatpickr-scbtns-button-background-color`|`color`|`$white`
`$flatpickr-scbtns-button-border`|`size`|`1px solid $grey-lighter`
`$flatpickr-scbtns-button-border-radius`|`size`|`$radius-small`
`$flatpickr-scbtns-button-padding`|`size`|`calc(0.375em - 1px) 0.75em`
`$flatpickr-scbtns-button-hover-color`|`color`|`$link-hover`
`$flatpickr-scbtns-button-hover-border-color`|`color`|`$link-hover-border`
`$flatpickr-scbtns-button-focus-color`|`color`|`$link-focus`
`$flatpickr-scbtns-button-focus-border-color`|`color`|`$link-focus-border`
`$flatpickr-scbtns-button-focus-box-shadow`|`size`|`0 0 0 0.125em rgba($link, 0.25)`
`$flatpickr-scbtns-button-active-color`|`color`|`$link-active`
`$flatpickr-scbtns-button-active-border-color`|`color`|`$link-active-border`


## License

- [MIT](./LICENSE)
