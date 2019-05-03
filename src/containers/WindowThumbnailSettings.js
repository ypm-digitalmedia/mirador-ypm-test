import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { withPlugins } from '../extend/withPlugins';
import * as actions from '../state/actions';
import { getThumbnailNavigationPosition } from '../state/selectors';
import { WindowThumbnailSettings } from '../components/WindowThumbnailSettings';

/**
 * mapDispatchToProps - used to hook up connect to action creators
 * @memberof ManifestListItem
 * @private
 */
const mapDispatchToProps = { setWindowThumbnailPosition: actions.setWindowThumbnailPosition };

/**
 * mapStateToProps - to hook up connect
 * @memberof WindowViewer
 * @private
 */
const mapStateToProps = (state, { windowId }) => (
  {
    thumbnailNavigationPosition: getThumbnailNavigationPosition(state, { windowId }),
  }
);

/** */
const styles = theme => ({
  label: {
    borderBottom: '2px solid transparent',
  },
  MenuItem: {
    display: 'inline',
  },
  selectedLabel: {
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
    color: theme.palette.secondary.main,
  },
});

const enhance = compose(
  withStyles(styles),
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('WindowThumbnailSettings'),
  // further HOC go here
);

export default enhance(WindowThumbnailSettings);
