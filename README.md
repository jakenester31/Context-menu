Use releases instead of the main branch. The main branch is designed to showcase the code, not for use in websites

.
Settings:
State - decides if the webpage should use the custom or web browsers context menu
autoCloseChild - decides if the child menus should close on mouse leaving them or their parent
childClickSwitch - decides if child menus should close or open if a parent button is clicked

.
Icons:
I got my icons from https://fonts.google.com/icons?icon.size=24&icon.color=%23e3e3e3. Great website, check it out!


.
Selector guide:
There are 3 selectors and 1 pseudo selector. They go in order of priority from the top (having least priority)

standard selectors

Default selector, tag:(all), the selector chosen if no other selector is chosen, there should only be one

Element selector, standard selector for right clicking on an element, ex. img, div, p, etc...

State selector, startTag:(?), evaluates a condition and if true, choses the selector, ex. ?t == 1, ?t != 3

.
pseudo selectors:

Child selector, startTag:(#), links a menu to parent buttons, ex. #add, #test123
