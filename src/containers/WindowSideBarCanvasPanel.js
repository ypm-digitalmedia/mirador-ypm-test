import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { withPlugins } from '../extend/withPlugins';
import * as actions from '../state/actions';
import { WindowSideBarCanvasPanel } from '../components/WindowSideBarCanvasPanel';
import {
  getCompanionWindow,
  getManifestCanvases,
  getSelectedCanvases,
} from '../state/selectors';

/**
 * mapStateToProps - to hook up connect
 */
const mapStateToProps = (state, { id, windowId }) => {
  const canvases = getManifestCanvases(state, { windowId });
  const { config } = state;
  return {
    canvases,
    config,
    selectedCanvases: getSelectedCanvases(state, { windowId }),
    variant: getCompanionWindow(state, { companionWindowId: id, windowId }).variant,
  };
};

/**
 * mapStateToProps - used to hook up connect to state
 * @memberof WindowSideBarCanvasPanel
 * @private
 */
const mapDispatchToProps = (dispatch, { id, windowId }) => ({
  setCanvas: (...args) => dispatch(actions.setCanvas(...args)),
  toggleDraggingEnabled: () => dispatch(actions.toggleDraggingEnabled()),
  updateVariant: variant => dispatch(
    actions.updateCompanionWindow(windowId, id, { variant }),
  ),
});

/**
 *
 * @param theme
 * @returns {label: {paddingLeft: number}}}
 */
const styles = theme => ({
  label: {
    paddingLeft: theme.spacing.unit,
  },
  listItem: {
    borderBottom: `0.5px solid ${theme.palette.divider}`,
    paddingRight: theme.spacing.unit,
  },
  select: {
    '&:focus': {
      backgroundColor: theme.palette.background.paper,
    },
  },
  selectEmpty: {
    backgroundColor: theme.palette.background.paper,
  },
});

const enhance = compose(
  withTranslation(),
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('WindowSideBarCanvasPanel'),
);

export default enhance(WindowSideBarCanvasPanel);
