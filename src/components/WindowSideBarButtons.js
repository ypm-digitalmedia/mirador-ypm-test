import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Badge from '@material-ui/core/Badge';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@material-ui/icons/InfoSharp';
import AnnotationIcon from '@material-ui/icons/CommentSharp';
import AttributionIcon from '@material-ui/icons/CopyrightSharp';
import CanvasIndexIcon from './icons/CanvasIndexIcon';
import { keys, chars } from '../lib/KeyHelper';
/**
 *
 */
export class WindowSideBarButtons extends Component {
  /**
   * selects the given tab
   * @param {*} tab the tab to activate
   */
  static activateTab(tab) {
    tab.removeAttribute('tabindex');
    tab.setAttribute('aria-selected', 'true');
  }

  /** */
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  /**
   *
   */
  componentDidMount() {
    this.tabBar = ReactDOM.findDOMNode(this.tabsRef); // eslint-disable-line react/no-find-dom-node
    this.tabs = Array.from(this.tabBar.querySelectorAll('button[role=tab]'));

    /*
      the change event isn't fired, when the tabs component is initialized,
      so we have to perform the required actions on our own
    */
    const selectedTab = this.tabs.find(t => (t.getAttribute('aria-selected')) === 'true') || this.tabs[0];
    this.selectTab(selectedTab);
    selectedTab.focus();
  }

  /**
   * Set the ref to the parent tabs element
   */
  setTabsRef(ref) {
    if (this.tabsRef) return;

    this.tabsRef = ref;
  }

  /**
   * @param {object} event the change event
   * @param {string} value the tab's value
  */
  handleChange(event, value) {
    const { addCompanionWindow } = this.props;
    const tab = event.target;
    this.selectTab(tab);
    addCompanionWindow(value);
  }

  /**
   *
   * @param {*} tab the tab to select
   */
  selectTab(tab) {
    WindowSideBarButtons.activateTab(tab);
    this.deactivateTabs(this.tabs.indexOf(tab));
  }

  /**
   * @param {number} omit tab index to omit
   */
  deactivateTabs(omit = -1) {
    this.tabs.map((v, k) => {
      if (k !== omit) {
        v.setAttribute('tabindex', '-1');
        v.setAttribute('aria-selected', 'false');
      }
      return null;
    });
  }

  /**
   *
   * @param {object} event the keyUp event
   */
  handleKeyUp(event) {
    if (event.key === keys.up || event.which === chars.up) {
      event.preventDefault();
      return this.focusPreviousTab(event.target);
    }
    if (event.key === keys.down || event.which === chars.down) {
      event.preventDefault();
      return this.focusNextTab(event.target);
    }
    return null;
  }

  /**
   * focus the previous tab
   * @param {object} tab the currently selected tab
   */
  focusPreviousTab(tab) {
    const previousTab = tab.previousSibling || this.tabs[this.tabs.length - 1];
    previousTab.focus();
  }

  /**
   * focus the next tab
   * @param {object} tab the currently selected tab
   */
  focusNextTab(tab) {
    const nextTab = tab.nextSibling || this.tabs[0];
    nextTab.focus();
  }

  /**
   * render
   *
   * @return {type}  description
   */
  render() {
    const {
      classes,
      hasAnnotations,
      hideAnnotationsPanel,
      sideBarPanel,
      t,
    } = this.props;

    /** */
    const TabButton = props => (
      <Tooltip title={t('openCompanionWindow', { context: props.value })}>
        <Tab
          {...props}
          classes={{ root: classes.tab, selected: classes.tabSelected }}
          aria-label={
            t('openCompanionWindow', { context: props.value })
          }
          disableRipple
          onKeyUp={this.handleKeyUp}
        />
      </Tooltip>
    );

    return (
      <Tabs
        classes={{ flexContainer: classes.tabsFlexContainer, indicator: classes.tabsIndicator }}
        value={sideBarPanel === 'closed' ? false : sideBarPanel}
        onChange={this.handleChange}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
        aria-orientation="vertical"
        aria-label={t('sidebarPanelsNavigation')}
        ref={ref => this.setTabsRef(ref)}
      >
        <TabButton
          value="info"
          icon={(<InfoIcon />)}
        />
        <TabButton
          value="attribution"
          icon={(<AttributionIcon />)}
        />
        <TabButton
          value="canvas"
          icon={(<CanvasIndexIcon />)}
        />
        {!hideAnnotationsPanel && (
          <TabButton
            value="annotations"
            icon={(
              <Badge classes={{ badge: classes.badge }} invisible={!hasAnnotations} variant="dot">
                <AnnotationIcon />
              </Badge>
            )}
          />
        )}
      </Tabs>
    );
  }
}

WindowSideBarButtons.propTypes = {
  addCompanionWindow: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.string),
  hasAnnotations: PropTypes.bool,
  hideAnnotationsPanel: PropTypes.bool,
  sideBarPanel: PropTypes.string,
  t: PropTypes.func,
};

WindowSideBarButtons.defaultProps = {
  classes: {},
  hasAnnotations: false,
  hideAnnotationsPanel: false,
  sideBarPanel: 'closed',
  t: key => key,
};
