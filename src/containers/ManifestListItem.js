import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import { withPlugins } from '../extend/withPlugins';
import {
  getManifest,
  getManifestTitle, getManifestThumbnail, getManifestCanvases,
  getManifestLogo, getManifestProvider, getWindowManifests,
} from '../state/selectors';
import * as actions from '../state/actions';
import { ManifestListItem } from '../components/ManifestListItem';

/** */
const mapStateToProps = (state, { manifestId }) => ({
  active: getWindowManifests(state).includes(manifestId),
  error: getManifest(state, { manifestId }).error,
  isFetching: getManifest(state, { manifestId }).isFetching,
  manifestLogo: getManifestLogo(state, { manifestId }),
  provider: getManifest(state, { manifestId }).provider
    || getManifestProvider(state, { manifestId }),
  ready: !!getManifest(state, { manifestId }).json,
  size: getManifestCanvases(state, { manifestId }).length,
  thumbnail: getManifestThumbnail(state, { manifestId }),
  title: getManifestTitle(state, { manifestId }),
});

/**
 * mapDispatchToProps - used to hook up connect to action creators
 * @memberof ManifestListItem
 * @private
 */
const mapDispatchToProps = { addWindow: actions.addWindow, fetchManifest: actions.fetchManifest };

/**
 *
 * @param theme
 * @returns {{root: {}, label: {textAlign: string, textTransform: string}}}
 */
const styles = theme => ({
  active: {},
  buttonGrid: {
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  label: {
    textAlign: 'left',
    textTransform: 'initial',
  },
  logo: {
    height: '2.5rem',
    paddingRight: 8,
  },
  placeholder: {
    backgroundColor: theme.palette.grey[300],
  },
  root: {
    ...theme.mixins.gutters(),
    '&$active': {
      borderLeft: `4px solid ${theme.palette.primary.main}`,
    },
    borderLeft: '4px solid transparent',
  },
});

const enhance = compose(
  withTranslation(),
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('ManifestListItem'),
);

export default enhance(ManifestListItem);
