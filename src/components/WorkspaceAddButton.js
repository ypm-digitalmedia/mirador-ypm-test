import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/AddSharp';
import CloseIcon from '@material-ui/icons/CloseSharp';

/**
 */
export class WorkspaceAddButton extends Component {
  /**
   * render
   * @return
   */
  render() {
    const {
      classes, t, setWorkspaceAddVisibility, isWorkspaceAddVisible, useExtendedFab,
    } = this.props;
    return (
      <Tooltip title={isWorkspaceAddVisible ? t('closeAddResourceMenu') : t('addResource')}>
        <Fab
          size="medium"
          color="primary"
          id="addBtn"
          disableRipple
          aria-label={isWorkspaceAddVisible ? t('closeAddResourceMenu') : t('addResource')}
          className={classes.fab}
          classes={{ primary: classes.fabPrimary, secondary: classes.fabSecondary }}
          variant={useExtendedFab ? 'extended' : null}
          onClick={() => { setWorkspaceAddVisibility(!isWorkspaceAddVisible); }}
        >
          {
            isWorkspaceAddVisible
              ? <CloseIcon />
              : <AddIcon />
          }
          { useExtendedFab && <Typography color="inherit">{t('startHere')}</Typography> }
        </Fab>
      </Tooltip>
    );
  }
}

WorkspaceAddButton.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  isWorkspaceAddVisible: PropTypes.bool,
  setWorkspaceAddVisibility: PropTypes.func.isRequired,
  t: PropTypes.func,
  useExtendedFab: PropTypes.bool.isRequired,
};

WorkspaceAddButton.defaultProps = {
  isWorkspaceAddVisible: false,
  t: key => key,
};
