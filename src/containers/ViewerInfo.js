import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withPlugins } from '../extend/withPlugins';
import { ViewerInfo } from '../components/ViewerInfo';
import { getCanvasLabel, getManifestCanvases, getCanvasIndex } from '../state/selectors';

/**
 * mapStateToProps - to hook up connect
 * @memberof Window
 * @private
 */
const mapStateToProps = (state, props) => {
  const { windowId } = props;
  const canvases = getManifestCanvases(state, { windowId });
  const canvasIndex = getCanvasIndex(state, { windowId });

  return {
    canvasCount: canvases.length,
    canvasIndex,
    canvasLabel: getCanvasLabel(state, {
      canvasIndex,
      windowId,
    }),
  };
};

const enhance = compose(
  withTranslation(),
  connect(mapStateToProps, null),
  withPlugins('ViewerInfo'),
);

export default enhance(ViewerInfo);
