(function(define){'use strict';define(function(require,exports,module){

/**
 * Dependencies
 */

var utils = require('gaia-component-utils');

/**
 * Locals
 */

var packagesBaseUrl = window.packagesBaseUrl || '/bower_components/';
var baseUrl = window.GaiaTabsBaseUrl || packagesBaseUrl + 'gaia-tabs/';
var indexOf = [].indexOf;
var stylesheets = [
  { url: baseUrl + 'style.css', scoped: true }
];

// Extend from the HTMLElement prototype
var proto = Object.create(HTMLElement.prototype);

/**
 * Runs when an instance of `GaiaTabs`
 * is first created.
 *
 * The intial value of the `select` attribute
 * is used to select a tab.
 *
 * @private
 */
proto.createdCallback = function() {
  for (var el = this.firstElementChild; el; el = el.nextElementSibling) {
    el.setAttribute('role', 'tab');
  }
  this.setAttribute('role', 'tablist');
  utils.style.call(this, stylesheets);
  this.addEventListener('click', this.onClick);
  this.select(this.getAttribute('selected'));
};

/**
 * Updates the selected tab when
 * the `selected` attribute changes.
 *
 * @param  {String} attr
 * @param  {String|null} oldVal
 * @param  {String|null} newVal [description]
 * @private
 */
proto.attributeChangedCallback = function(attr, oldVal, newVal) {
  if (attr === 'selected') { this.select(newVal); }
};

/**
 * Walks up the DOM from the `event.target`
 * until it finds an immendiate child
 * of the element, then selects the index
 * of that element.
 *
 * @param  {Event} e
 * @private
 */
proto.onClick = function(e) {
  var el = e.target;
  var i;
  while (el) {
    i = indexOf.call(this.children, el);
    if (i > -1) { return this.select(i); }
    el = el.parentNode;
  }
};

/**
 * Select a tab by index.
 *
 * @param  {Number} index
 * @public
 */
proto.select = function(index) {
  if (index === null) { return; }

  // Make sure it's a number
  index = Number(index);

  var el = this.children[index];
  this.deselect(this.selected);
  this.selectedChild = el;
  this.selected = index;

  el.setAttribute('aria-selected', 'true');
  el.classList.add('selected');

  var e = new CustomEvent('change');
  setTimeout(this.dispatchEvent.bind(this, e));
};

/**
 * Deselect a tab by index.
 * @param  {Number} index
 * @public
 */
proto.deselect = function(index) {
  var el = this.children[index];
  if (!el) { return; }
  el.removeAttribute('aria-selected');
  el.classList.remove('selected');
  if (this.current == el) {
    this.selectedChild = null;
    this.selected = null;
  }
};

// Register and return the constructor
module.exports = document.registerElement('gaia-tabs', { prototype: proto });

});})((function(n,w){'use strict';return typeof define=='function'&&define.amd?
define:typeof module=='object'?function(c){c(require,exports,module);}:
function(c){var m={exports:{}},r=function(n){return w[n];};
w[n]=c(r,m.exports,m)||m.exports;};})('gaia-tabs',this));
