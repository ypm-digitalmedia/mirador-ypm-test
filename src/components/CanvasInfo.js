import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import CollapsibleSection from '../containers/CollapsibleSection';
import { SanitizedHtml } from './SanitizedHtml';
import { LabelValueMetadata } from './LabelValueMetadata';


/**
 * CanvasInfo
 */
export class CanvasInfo extends Component {
  /**
   * render
   * @return
   */
  render() {
    const {
      canvasDescription,
      canvasLabel,
      canvasMetadata,
      id,
      index,
      t,
      totalSize,
    } = this.props;

    return (
      <CollapsibleSection
        id={`${id}-currentItem-${index}`}
        label={t('currentItem', { context: `${index + 1}/${totalSize}` })}
      >
        <>
          {canvasLabel && (
            <Typography
              aria-labelledby={
                `${id}-currentItem-${index} ${id}-currentItem-${index}-heading`
              }
              id={`${id}-currentItem-${index}-heading`}
              variant="h4"
            >
              {canvasLabel}
            </Typography>
          )}

          {canvasDescription && (
            <Typography variant="body1">
              <SanitizedHtml htmlString={canvasDescription} ruleSet="iiif" />
            </Typography>
          )}

          {canvasMetadata.length > 0 && (
            <LabelValueMetadata labelValuePairs={canvasMetadata} />
          )}
        </>
      </CollapsibleSection>
    );
  }
}

CanvasInfo.propTypes = {
  canvasDescription: PropTypes.string,
  canvasLabel: PropTypes.string,
  canvasMetadata: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  id: PropTypes.string.isRequired,
  index: PropTypes.number,
  t: PropTypes.func,
  totalSize: PropTypes.number,
};

CanvasInfo.defaultProps = {
  canvasDescription: null,
  canvasLabel: null,
  canvasMetadata: [],
  index: 1,
  t: key => key,
  totalSize: 1,
};
