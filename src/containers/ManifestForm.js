import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import { withPlugins } from '../extend/withPlugins';
import * as actions from '../state/actions';
import { ManifestForm } from '../components/ManifestForm';

/**
 * mapDispatchToProps - used to hook up connect to action creators
 * @memberof ManifestForm
 * @private
 */
const mapDispatchToProps = { fetchManifest: actions.fetchManifest };
/**
 *
 * @param theme
 */
const styles = theme => ({
  buttons: {
    textAlign: 'right',
    [theme.breakpoints.up('sm')]: {
      textAlign: 'inherit',
    },
  },
  input: {
    ...theme.typography.body1,
  },
});

const enhance = compose(
  withStyles(styles),
  withTranslation(),
  connect(null, mapDispatchToProps),
  withPlugins('ManifestForm'),
);

export default enhance(ManifestForm);
