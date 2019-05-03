import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import OpenSeadragon from 'openseadragon';
import ns from '../config/css-ns';
import OpenSeadragonCanvasOverlay from '../lib/OpenSeadragonCanvasOverlay';
import CanvasWorld from '../lib/CanvasWorld';

/**
 * Represents a OpenSeadragonViewer in the mirador workspace. Responsible for mounting
 * and rendering OSD.
 */
export class OpenSeadragonViewer extends Component {
  /**
   * annotationsMatch - compares previous annotations to current to determine
   * whether to add a new updateCanvas method to draw annotations
   * @param  {Array} currentAnnotations
   * @param  {Array} prevAnnotations
   * @return {Boolean}
   */
  static annotationsMatch(currentAnnotations, prevAnnotations) {
    if (currentAnnotations.length === 0 && prevAnnotations.length === 0) return true;
    if (currentAnnotations.length !== prevAnnotations.length) return false;
    return currentAnnotations.every((annotation, index) => {
      const newIds = annotation.resources.map(r => r.id);
      const prevIds = prevAnnotations[index].resources.map(r => r.id);
      if (newIds.length === 0 && prevIds.length === 0) return true;
      if (newIds.length !== prevIds.length) return false;

      if ((annotation.id === prevAnnotations[index].id) && (isEqual(newIds, prevIds))) {
        return true;
      }
      return false;
    });
  }

  /**
   * @param {Object} props
   */
  constructor(props) {
    super(props);

    this.viewer = null;
    this.osdCanvasOverlay = null;
    // An initial value for the updateCanvas method
    this.updateCanvas = () => {};
    this.ref = React.createRef();
    this.onUpdateViewport = this.onUpdateViewport.bind(this);
    this.onViewportChange = this.onViewportChange.bind(this);
    this.zoomToWorld = this.zoomToWorld.bind(this);
    this.osdUpdating = false;
  }

  /**
   * React lifecycle event
   */
  componentDidMount() {
    const { viewer } = this.props;
    if (!this.ref.current) {
      return;
    }

    this.viewer = new OpenSeadragon({
      alwaysBlend: false,
      blendTime: 0.1,
      id: this.ref.current.id,
      preserveImageSizeOnResize: true,
      preserveViewport: true,
      showNavigationControl: false,

    });

    this.osdCanvasOverlay = new OpenSeadragonCanvasOverlay(this.viewer);
    this.viewer.addHandler('update-viewport', this.onUpdateViewport);
    // Set a flag when OSD starts animating (so that viewer updates are not used)
    this.viewer.addHandler('animation-start', () => {
      this.osdUpdating = true;
    });
    this.viewer.addHandler('animation-finish', this.onViewportChange);
    this.viewer.addHandler('animation-finish', () => {
      this.osdUpdating = false;
    });

    if (viewer) {
      this.viewer.viewport.panTo(viewer, true);
      this.viewer.viewport.zoomTo(viewer.zoom, viewer, true);
    }
    this.addAllTileSources();
  }

  /**
   * When the tileSources change, make sure to close the OSD viewer.
   * When the annotations change, reset the updateCanvas method to make sure
   * they are added.
   * When the viewport state changes, pan or zoom the OSD viewer as appropriate
   */
  componentDidUpdate(prevProps) {
    const {
      viewer, highlightedAnnotations, selectedAnnotations,
    } = this.props;
    const highlightsUpdated = !OpenSeadragonViewer.annotationsMatch(
      highlightedAnnotations, prevProps.highlightedAnnotations,
    );
    const selectionsUpdated = !OpenSeadragonViewer.annotationsMatch(
      selectedAnnotations, prevProps.selectedAnnotations,
    );

    if (highlightsUpdated || selectionsUpdated) {
      this.updateCanvas = () => {
        this.osdCanvasOverlay.clear();
        this.osdCanvasOverlay.resize();
        this.osdCanvasOverlay.canvasUpdate(() => {
          this.annotationsToContext(highlightedAnnotations, '#00BFFF');
          this.annotationsToContext(selectedAnnotations, 'yellow');
        });
      };
      this.viewer.forceRedraw();
    }

    if (!this.tileSourcesMatch(prevProps.tileSources)) {
      this.viewer.close();
      this.addAllTileSources();
    } else if (viewer && !this.osdUpdating) {
      const { viewport } = this.viewer;

      if (viewer.x !== viewport.centerSpringX.target.value
        || viewer.y !== viewport.centerSpringY.target.value) {
        this.viewer.viewport.panTo(viewer, false);
      }

      if (viewer.zoom !== viewport.zoomSpring.target.value) {
        this.viewer.viewport.zoomTo(viewer.zoom, viewer, false);
      }
    }
  }

  /**
   */
  componentWillUnmount() {
    this.viewer.removeAllHandlers();
  }

  /**
   * onUpdateViewport - fires during OpenSeadragon render method.
   */
  onUpdateViewport(event) {
    this.updateCanvas();
  }

  /**
   * Forward OSD state to redux
   */
  onViewportChange(event) {
    const { updateViewport, windowId } = this.props;

    const { viewport } = event.eventSource;

    updateViewport(windowId, {
      x: Math.round(viewport.centerSpringX.target.value),
      y: Math.round(viewport.centerSpringY.target.value),
      zoom: viewport.zoomSpring.target.value,
    });
  }

  /**
   * annotationsToContext - converts anontations to a canvas context
   */
  annotationsToContext(annotations, color = 'yellow') {
    const { canvasWorld } = this.props;
    const context = this.osdCanvasOverlay.context2d;
    const zoom = this.viewer.viewport.getZoom(true);
    const width = canvasWorld.worldBounds()[2];
    annotations.forEach((annotation) => {
      annotation.resources.forEach((resource) => {
        const offset = canvasWorld.offsetByCanvas(resource.targetId);
        const fragment = resource.fragmentSelector;
        fragment[0] += offset.x;
        context.strokeStyle = color;
        context.lineWidth = Math.ceil(10 / (zoom * width));
        context.strokeRect(...fragment);
      });
    });
  }

  /** */
  addAllTileSources() {
    const { tileSources } = this.props;
    Promise.all(
      tileSources.map((tileSource, i) => this.addTileSource(tileSource, i)),
    ).then(() => {
      if (tileSources[0]) {
        this.zoomToWorld();
      }
    });
  }

  /**
   */
  addTileSource(tileSource, i = 0) {
    const { canvasWorld } = this.props;
    return new Promise((resolve, reject) => {
      if (!this.viewer) {
        return;
      }
      this.viewer.addTiledImage({
        error: event => reject(event),
        fitBounds: new OpenSeadragon.Rect(
          ...canvasWorld.canvasToWorldCoordinates(i),
        ),
        success: event => resolve(event),
        tileSource,
      });
    });
  }

  /**
   */
  fitBounds(x, y, w, h, immediately = true) {
    this.viewer.viewport.fitBounds(
      new OpenSeadragon.Rect(x, y, w, h),
      immediately,
    );
  }

  /**
   * tileSourcesMatch - compares previous tileSources to current to determine
   * whether a refresh of the OSD viewer is needed.
   * @param  {Array} prevTileSources
   * @return {Boolean}
   */
  tileSourcesMatch(prevTileSources) {
    const { tileSources } = this.props;
    if (tileSources.length === 0 && prevTileSources.length === 0) return true;

    return tileSources.some((tileSource, index) => {
      if (!prevTileSources[index]) {
        return false;
      }
      if (tileSource['@id'] === prevTileSources[index]['@id']) {
        return true;
      }
      return false;
    });
  }

  /**
   * zoomToWorld - zooms the viewer to the extent of the canvas world
   */
  zoomToWorld(immediately = true) {
    const { canvasWorld } = this.props;
    this.fitBounds(...canvasWorld.worldBounds(), immediately);
  }

  /**
   * Renders things
   */
  render() {
    const {
      windowId, children, label, t,
    } = this.props;

    const enhancedChildren = React.Children.map(children, child => (
      React.cloneElement(
        child,
        {
          zoomToWorld: this.zoomToWorld,
        },
      )
    ));

    return (
      <>
        <section
          className={ns('osd-container')}
          id={`${windowId}-osd`}
          ref={this.ref}
          aria-label={t('item', { label })}
        >
          { enhancedChildren }
        </section>
      </>
    );
  }
}

OpenSeadragonViewer.defaultProps = {
  children: null,
  highlightedAnnotations: [],
  label: null,
  selectedAnnotations: [],
  tileSources: [],
  viewer: null,

};

OpenSeadragonViewer.propTypes = {
  canvasWorld: PropTypes.instanceOf(CanvasWorld).isRequired,
  children: PropTypes.node,
  highlightedAnnotations: PropTypes.arrayOf(PropTypes.object),
  label: PropTypes.string,
  selectedAnnotations: PropTypes.arrayOf(PropTypes.object),
  t: PropTypes.func.isRequired,
  tileSources: PropTypes.arrayOf(PropTypes.object),
  updateViewport: PropTypes.func.isRequired,
  viewer: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  windowId: PropTypes.string.isRequired,
};
