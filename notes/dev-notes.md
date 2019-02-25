# Dev Notes

### Clean up

- remove IE hacks 
  - `width: unquote('7ch\0');`
  - `-ms` plefixed stuff other than `-ms-clear` _(it functions on Edge)_
- remove [control derectivs for RTLCSS](https://rtlcss.com/learn/usage-guide/control-directives/index.html)
- remove all `box-sizing: border-box;` because it's bulma's default
- remove all existance checks of `$no-calendar-border` by leaving their false blocks
- with all the other variables with existence check
  - define them using their false blocks' values
  - remove all their existance checks by leaving their true blocks
- remove ineffective rules
  - `.dayContainer, .flatpickr-weeks` _(completely overridden by other rules)_
  - `.flatpickr-day`>`.week.selected` _(style for weekSelect plugin; should be provided in a separate file)_
  - `span.cur-month`>`:hover` _(setting hover effect to static text is pointless)_
  - in `.flatpickr-months`>`.flatpickr-prev-month, .flatpickr-next-month`
    - `i` _(unused; arrows are drawn with svg)_
    - `svg`>`path` _(setting transition to hover effect is pointless)_
  - `.numInputWrapper`>`svg` _(unused; arrows are drawn with border)_
  - `.flatpickr-calendar`>`.hasWeeks, .hasTime` _(unused; because of lacking preceding `&`)_

### Revising variables

- prefix all variables with `flatpickr-`
- new variables
  - `$flatpickr-disabled-color`: `$text-light`
  - `$flatpickr-disabled-day-foreground`: `$grey-lighter`

### Changes of styling

- restructure the `.flatpickr-day` block to reflect the overrule precedence that the original css produces.
  > ```css
  > high  .hidden
  >  ▲     ⤷ .notAllowed (except .today:hover), .disabled
  >  |         ⤷ .selected, .startRange, .endRange (+ their :hover, :focus)
  >  |             ⤷ .today:hover, .today:focus
  >  |                 ⤷ .inRange
  >  |                     ⤷ :hover, :focus
  >  |                         ⤷ .prevMonthDay, .nextMonthDay
  >  ▼                             ⤷ .today
  > low                                ⤷ (plain .flatpickr-day)
  > ```
  > 1. except having `:focus`/`:hover`, `.today` indicator only appears when it's a day of current month
  > 2. days of `.prevMonthDay`, `.nextMonthDay` are selectable, thus have fucus/hover effects
  > 3. `.startRange` and `.endRange` are used to extend `.selected` and `.inRange` never overlaps with them
  > 4. no fucus/hover effects on days of `.selected`/`.inRange` (although they can be fucused)
  > 5. `.today`'s fucus/hover effects works when it has `.inRange` or `.notAllowed` as well, but doesn't with `.selected`
  > 6. `.notAllowed` only appears while selecting a range and never coexists with `.selected`/`.inRange`
  > 7. days of `.disabled` cannot turn to `.selected`/`.inRange`/`.notAllowed`
  > 8. `.hidden` is used for `.prevMonthDay`, `.nextMonthDay` in multi-month mode
- use characters (triagle bullet) to draw up/down buttons of number input instead of borders
- style `.flatpickr-current-month` with flexbox and set equal-sized spacing to month/year
  - `justify-content: center` to `.flatpickr-current-month` 
  - `1rem` to the padding on both sides of `.cur-month` (month name)
  - size of 4 digits + extra 1rem to the width of `.numInputWrapper input`
  > This makes RTL support simpler. We only need to control the up/down buttons' positions.
  > ```
  > LTR:
  > |<--------- .flatpickr-current-month ---------->|
  > |   |<----- .cur-month ----->||<-- input -->|   |
  > |   |<1rem>[month name]<1rem>||[year <1rem>]|   |
  > |                                    |<-▲▼->|   |
  >
  > RTL:
  > |<--------- .flatpickr-current-month ---------->|
  > |   |<-- input -->||<----- .cur-month ----->|   |
  > |   |[<1rem> year]||<1rem>[month name]<1rem>|   |
  > |   |<-▲▼->|                                    |
  > ```
- remove the margin of day elements and use `background` instead of `box-shadow` for background colors.
  - drop `$day-margin` variable
  > no more shadow size control for RTL and multi-month mode.
- style `.flatpickr-time` with flexbox
  - `align-items: baseline` to `.flatpickr-time` 
  - `flex: 1` to `.numInputWrapper`
  - `flex-shrink: 0` to `.flatpickr-time-separator` and `.flatpickr-am-pm`
  - remove `width` from all child elements
  > no more size adjustment for 24-hour and has-second modes.
