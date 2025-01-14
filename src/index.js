import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { elementScrollIntoViewPolyfill } from "seamless-scroll-polyfill";

import JsSpatialNavigation from './lib/spatial_navigation.js';
import withForwardedRef from 'react-with-forwarded-ref';

// Polyfill Samsung Tizen
elementScrollIntoViewPolyfill();

const defaultConfig = {
  activeClassName: 'active',
  focusableClassName: 'focusable',
  selector: '.focusable',
};
let config = {};

const VERSION = '[AIV]{version}[/AIV]';

/**
 * This component initialize the Spatial Navigation library.
 * It should be used only one time and in the root node of the application.
 * The spatial navigation only work within the Focusable components.
 */
class SpatialNavigation extends Component {

  getConfigFromProps() {
    let propsConfig = {};

    // React Custom: Set activeClassName
    if (typeof this.props.activeClassName === 'string') {
      propsConfig.activeClassName = this.props.activeClassName;
    }

    // React Custom: Set focusableClassName
    if (typeof this.props.focusableClassName === 'string') {
      propsConfig.focusableClassName = this.props.focusableClassName;
    }

    // React Custom: Set customInit
    if (typeof this.props.customInit === 'function') {
      propsConfig.customInit = this.props.customInit;
    }

    // Set defaultElement
    if (typeof this.props.defaultElement === 'string') {
      propsConfig.defaultElement = this.props.defaultElement;
    }

    // Set disabled
    if (typeof this.props.disabled === 'boolean') {
      propsConfig.disabled = this.props.disabled;
    }

    // Set enterTo
    if (typeof this.props.enterTo === 'string') {
      propsConfig.enterTo = this.props.enterTo;
    }

    // Set leaveFor
    if (typeof this.props.leaveFor === 'object') {
      propsConfig.leaveFor = this.props.leaveFor;
    }

    // Set navigableFilter
    if (typeof this.props.navigableFilter === 'function') {
      propsConfig.navigableFilter = this.props.navigableFilter;
    }

    // Set rememberSource
    if (typeof this.props.rememberSource === 'string') {
      propsConfig.rememberSource = this.props.rememberSource;
    }

    // Set restrict
    if (typeof this.props.restrict === 'string') {
      propsConfig.restrict = this.props.restrict;
    }

    // Set selector
    if (typeof this.props.selector === 'string') {
      propsConfig.selector = this.props.selector;
    }

    // Set straightOnly
    if (typeof this.props.straightOnly === 'boolean') {
      propsConfig.straightOnly = this.props.straightOnly;
    }

    // Set straightOverlapThreshold
    if (typeof this.props.straightOverlapThreshold === 'number') {
      propsConfig.straightOverlapThreshold = this.props.straightOverlapThreshold;
    }

    // Set tabIndexIgnoreList
    if (typeof this.props.tabIndexIgnoreList === 'string') {
      propsConfig.tabIndexIgnoreList = this.props.tabIndexIgnoreList;
    }

    // Set custom init config
    if (typeof this.props.initConfig === 'object') {
      propsConfig.initConfig = this.props.initConfig;
    }

    return propsConfig;
  }

  componentWillMount() {
    config = Object.assign(defaultConfig, this.getConfigFromProps.call(this));
  }

  componentDidMount() {
    if (!this.props.customInit) {
      JsSpatialNavigation.init(config);
      JsSpatialNavigation.add(config);
      JsSpatialNavigation.focus();

    } else {
      this.props.customInit.call(this, config);
    }
  }

  componentWillUnmount() {
    JsSpatialNavigation.uninit();
  }

  render() {
    let classNames = [];

    if (this.props.className) {
      classNames.push(this.props.className);
    }

    return (
      <div className={classNames.join(' ')}>{this.props.children}</div>
    );
  }
}

function getSelector(id) {
  return `.${id}`;
}

/**
 * A Focusable component that handle the onFocus, onUnfocus, onClickEnter events.
 *
 * Props:
 *
 *   onBeforeFocus: (optional)
 *     A function that will be fired when the comonent is about to be focused, can be used
 *     to scroll items into view, fire an animation, etc.
 *
 *   onFocus: (optional)
 *     A function that will be fired when the component is focused.
 *
 *   onUnfocus: (optional)
 *     A function that will be fired when the component is unfocused.
 *
 *   onClickEnter: (optional)
 *     A function that will be fired when the component is focused and enter key is pressed. *
 *
 *   onKeyDown: (optional)
 *     A function that will be fired when any key is pressed on the component. *
 *
 *   onKeyUp: (optional)
 *     A function that will be fired when any key is released on the component
 */
class Focusable extends Component {
  componentWillFocus(e) {
    // console.warn('Focusable.componentWillFocus: ' + this.context.focusableSectionId, e.target);
    if (this.props.onBeforeFocus) {
      this.props.onBeforeFocus(e);
    }
  }

  componentFocused(e) {
    // console.warn('Focusable.componentFocused: ' + this.context.focusableSectionId, e.target);
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  }

  componentUnfocused(e) {
    // console.warn('Focusable.componentUnfocused: ' + this.context.focusableSectionId, e.target);
    if (this.props.onUnfocus) {
      this.props.onUnfocus(e);
    }
  }

  componentClickEnter(e) {
    // console.warn('Focusable.componentClickEnter: ' + this.context.focusableSectionId, e.target);
    if (this.props.onClickEnter) {
      this.props.onClickEnter(e);
    }
  }

  componentKeyDown(e) {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }
  }
  componentKeyUp(e) {
    if (this.props.onKeyUp) {
      this.props.onKeyUp(e);
    }
  }
  autoScroll(e) {
    if (this.props.autoScroll) {
      //browser will scroll it into view
    } else {
      e.preventDefault();//don't let browser scroll
    }
  }

  _componentWillFocus = (event) => this.componentWillFocus(event);
  _componentFocused = (event) => this.componentFocused(event);
  _componentUnfocused = (event) => this.componentUnfocused(event);
  _componentClickEnter = (event) => this.componentClickEnter(event);
  _componentKeyDown = (event) => this.componentKeyDown(event);
  _componentKeyUp = (event) => this.componentKeyUp(event);
  _autoScroll = (event) => this.autoScroll(event);

  componentDidMount() {
    if (!this.el)
      return;

    this.el.addEventListener('sn:willfocus', this._componentWillFocus);
    this.el.addEventListener('sn:focused', this._componentFocused);
    this.el.addEventListener('sn:unfocused', this._componentUnfocused);
    this.el.addEventListener('sn:enter-up', this._componentClickEnter);
    this.el.addEventListener('keydown', this._componentKeyDown);
    this.el.addEventListener('keyup', this._componentKeyUp);
    this.el.addEventListener('focus', this._autoScroll);
  }

  componentWillUnmount() {
    this.el.removeEventListener('sn:willfocus', this._componentWillFocus);
    this.el.removeEventListener('sn:focused', this._componentFocused);
    this.el.removeEventListener('sn:unfocused', this._componentUnfocused);
    this.el.removeEventListener('sn:enter-up', this._componentClickEnter);
    this.el.removeEventListener('keydown', this._componentKeyDown);
    this.el.removeEventListener('keyup', this._componentKeyUp);
    this.el.removeEventListener('focus', this._autoScroll);
  }

  render() {
    const { active, className, id, children } = this.props;
    let classNames = [this.context.focusableSectionId ? this.context.focusableSectionId : config.focusableClassName];

    let aria = {};
    for (let key in this.props) {
      if (key.indexOf('aria') === 0 || key === 'role') {
        aria[key] = this.props[key];
      }
    }

    if (active) {
      classNames.push(config.activeClassName);
    }

    if (className) {
      classNames.push(className);
    }

    return (
      <div {...aria} className={classNames.join(' ')} id={id} ref={e => this.el = e} tabIndex="-1">
        {children}
      </div>
    );
  }
}

Focusable.contextTypes = {
  focusableSectionId: PropTypes.string
};

/*
* A Focusable Section can specify a behaviour before focusing an element.
* I.e. selecting a default element, the first element or an active one.
*
* Props:
*   defaultElement: (default: '')
*     The default element that will be focused when entering this section.
*     This can be:
*       * a valid selector string for "querySelectorAll".
*       * a NodeList or an array containing DOM elements.
*       * a single DOM element.
*       * an empty string.
*
*   enterTo: (default: 'default-element')
*     If the focus comes from another section, you can define which element in this section should be focused first.
*     This can be:
*       * 'last-focused' indicates the last focused element before we left this section last time. If this section has never been focused yet, the default element (if any) will be chosen next.
*       * 'default-element' indicates the element defined in defaultElement.
*       * an empty string.
*
*   neighborUp/neighborRight/neighborDown/neighborLeft: (default: null)
*     The `<string> sectionId` of a section which should be navigated to when the user navigates
*     out of this section in a given direction. Important - an empty string means to treat
*     that direction as if there is a wall, so leave null/undefined if you want it to be
*     automatically determined by `js-spatial-navigation`
*       * Example: "menu" or "section-1"
*
*   sectionId: (default is automatically generated by `js-spatial-navigation`)
*     Optional `<string>` an id used to reference this section when using declarative navigation
*     between sections.
*       * ```<FocusableSection sectionId="menu" neighborRight="details">
 *             <FocusableItem>Home</FocusableItem>
 *             <FocusableItem>About</FocusableItem>
 *             <FocusableItem>News</FocusableItem>
 *             <FocusableItem>Movies</FocusableItem>
 *           </FocusableSection>
 *
 *           <FocusableSection sectionId="details" neighborLeft="menu" neighborUp="" />
 *             This is a really great movie
 *             <FocusableItem>Buy Now</FocusableItem>
 *           </FocusableSection>
 *           ```
*/
class FocusableSection extends Component {

  static counter = 0;

  static propTypes = {
    sectionId: PropTypes.string,
    neighborUp: PropTypes.string,
    neighborRight: PropTypes.string,
    neighborDown: PropTypes.string,
    neighborLeft: PropTypes.string,
    onBeforeFocus: PropTypes.func,
    onBeforeChildFocus: PropTypes.func,
    onFocus: PropTypes.func,
    onClickEnter: PropTypes.func,
    onUnfocus: PropTypes.func,
    role: PropTypes.string,
  };

  static defaultProps = {
    sectionId: null,
    neighborUp: null,
    neighborRight: null,
    neighborDown: null,
    neighborLeft: null,
    onBeforeFocus: null,
    onBeforeChildFocus: null,
    onFocus: null,
    onClickEnter: null,
    onUnfocus: null,
    role: null,
  };

  static eventOptions = true;//use capture, using boolean vs option because need to support older webkit < 10

  constructor(props) {
    super(props);
    this.el = this.props.forwardedRef || React.createRef();
    if (props.sectionId) {
      this.sectionId = props.sectionId;
    } else {
      this.sectionId = 'section-' + FocusableSection.counter;
      FocusableSection.counter++;
    }
  }

  componentWillFocus(e) {
    const prevIsChild = e.detail.previousElement && this.el.current.contains(e.detail.previousElement);

    if (this.props.onBeforeChildFocus) {
      this.props.onBeforeChildFocus(e, this.el.current);
    }

    if(prevIsChild){
      return;
    }
    // console.warn('FocusableSection.componentWillFocus: ' + this.sectionId, e.target.className, document.activeElement);
    if (this.props.onBeforeFocus) {
      this.props.onBeforeFocus(e, this.el.current);
    }
  }

  componentFocused(e) {
    const prevIsChild = e.detail.previousElement && this.el.current.contains(e.detail.previousElement);
    if(prevIsChild){
      return;
    }
    // console.warn('FocusableSection.componentFocused: ' + this.sectionId, e.target.className, document.activeElement);
    if (this.props.onFocus) {
      this.props.onFocus(e, this.el.current);
    }
  }

  componentUnfocused(e) {
    const leaving = this.sectionId !== e.detail.nextSectionId;
    if(!leaving){
      return;
    }
    // console.warn('FocusableSection.componentUnfocused: ' + this.sectionId, e.target.className, document.activeElement);
    if (this.props.onUnfocus && leaving) {
      this.props.onUnfocus(e, this.el.current);
    }
  }

  componentClickEnter(e) {
    // console.warn('FocusableSection.componentClickEnter: ' + this.sectionId, e.target.className, document.activeElement);
    if (this.props.onClickEnter) {
      this.props.onClickEnter(e, this.el.current);
    }
  }

  getChildContext() {
    return {focusableSectionId: this.sectionId};
  }

  _getSelector() {
    return getSelector(this.sectionId);
  }

  _componentWillFocus = (event) => this.componentWillFocus(event);
  _componentFocused = (event) => this.componentFocused(event);
  _componentUnfocused = (event) => this.componentUnfocused(event);
  _componentClickEnter = (event) => this.componentClickEnter(event);

  componentDidMount() {
    let defaultElement = this.props.defaultElement;
    let leaveFor = {};
    const enterTo = this.props.enterTo === undefined ? 'default-element' : this.props.enterTo;

    if (defaultElement && defaultElement === 'first') {
      defaultElement = this._getSelector() + ':first-child';
    }

    if (defaultElement && defaultElement === 'active') {
      defaultElement = this._getSelector() + `.${config.activeClassName}`;
    }

    if (typeof this.props.neighborLeft === 'string') {
      leaveFor.left = this.props.neighborLeft;
    }

    if (typeof this.props.neighborRight === 'string') {
      leaveFor.right = this.props.neighborRight;
    }

    if (typeof this.props.neighborUp === 'string') {
      leaveFor.up = this.props.neighborUp;
    }

    if (typeof this.props.neighborDown === 'string') {
      leaveFor.down = this.props.neighborDown;
    }

    JsSpatialNavigation.add(this.sectionId, {
      selector: this._getSelector(),
      enterTo: enterTo,
      defaultElement: defaultElement,
      leaveFor: leaveFor
    });

    if (!this.el.current)
      return;

    this.el.current.addEventListener('sn:willfocus', this._componentWillFocus, FocusableSection.eventOptions);
    this.el.current.addEventListener('sn:focused', this._componentFocused, FocusableSection.eventOptions);
    this.el.current.addEventListener('sn:unfocused', this._componentUnfocused, FocusableSection.eventOptions);
    this.el.current.addEventListener('sn:enter-up', this._componentClickEnter, FocusableSection.eventOptions);
  }

  componentDidUpdate(prevProps, prevState) {
    const { neighborUp: up, neighborDown: down, neighborLeft: left, neighborRight: right } = this.props;
    const { neighborUp, neighborDown, neighborLeft, neighborRight } = prevProps;

    if (neighborUp === up && neighborDown === down && neighborLeft === left && neighborRight === right) {
      return;
    }

    JsSpatialNavigation.set(this.sectionId, {
      leaveFor: {up, down, left, right}
    });
  }

  componentWillUnmount() {
    JsSpatialNavigation.remove(this.sectionId);

    this.el.current.removeEventListener('sn:willfocus', this._componentWillFocus, FocusableSection.eventOptions);
    this.el.current.removeEventListener('sn:focused', this._componentFocused, FocusableSection.eventOptions);
    this.el.current.removeEventListener('sn:unfocused', this._componentUnfocused, FocusableSection.eventOptions);
    this.el.current.removeEventListener('sn:enter-up', this._componentClickEnter, FocusableSection.eventOptions);

    this.el = null;
  }

  render() {
    const { className, id, children, role, 'aria-label': ariaLabel } = this.props;
    const {el} = this;
    let classNames = [];

    if (className) {
      classNames.push(className);
    }

    return (
      <div className={classNames.join(' ')} id={id} ref={el} role={role} aria-label={ariaLabel}>
        {children}
      </div>
    );
  }
}

FocusableSection.childContextTypes = {
  focusableSectionId: PropTypes.string
};

const FocusableSectionWithRef = withForwardedRef(FocusableSection);


export {
  SpatialNavigation as default,
  VERSION,
  FocusableSectionWithRef as FocusableSection,
  Focusable,
  JsSpatialNavigation
};
