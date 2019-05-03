import React from 'react';
import { shallow } from 'enzyme';
import OpenSeadragon from 'openseadragon';
import manifesto from 'manifesto.js';
import { OpenSeadragonViewer } from '../../../src/components/OpenSeadragonViewer';
import OpenSeadragonCanvasOverlay from '../../../src/lib/OpenSeadragonCanvasOverlay';
import Annotation from '../../../src/lib/Annotation';
import CanvasWorld from '../../../src/lib/CanvasWorld';
import fixture from '../../fixtures/version-2/019.json';

const canvases = manifesto.create(fixture).getSequences()[0].getCanvases();

jest.mock('openseadragon');
jest.mock('../../../src/lib/OpenSeadragonCanvasOverlay');


describe('OpenSeadragonViewer', () => {
  let wrapper;
  let updateViewport;
  beforeEach(() => {
    OpenSeadragon.mockClear();
    OpenSeadragonCanvasOverlay.mockClear();

    updateViewport = jest.fn();

    wrapper = shallow(
      <OpenSeadragonViewer
        tileSources={[{
          '@id': 'http://foo',
          height: 200,
          width: 100,
        }, {
          '@id': 'http://bar',
          height: 201,
          width: 150,
        }]}
        windowId="base"
        config={{}}
        updateViewport={updateViewport}
        t={k => k}
        canvasWorld={new CanvasWorld(canvases)}
      >
        <div className="foo" />
        <div className="bar" />
      </OpenSeadragonViewer>,
    );
  });
  it('renders the component', () => {
    expect(wrapper.find('.mirador-osd-container').length).toBe(1);
  });
  it('renders child components enhanced with additional props', () => {
    expect(wrapper.find('.foo').length).toBe(1);
    expect(wrapper.find('.foo').props()).toEqual(expect.objectContaining({
      zoomToWorld: wrapper.instance().zoomToWorld,
    }));
    expect(wrapper.find('.bar').length).toBe(1);
    expect(wrapper.find('.bar').props()).toEqual(expect.objectContaining({
      zoomToWorld: wrapper.instance().zoomToWorld,
    }));
  });

  describe('annotationsMatch', () => {
    it('is false if the annotations are a different size', () => {
      const currentAnnotations = [{ id: 1, resources: [{ id: 'rid1' }] }];
      const previousAnnotations = [{ id: 1, resources: [{ id: 'rid1' }] }, { id: 2, resources: [{ id: 'rid2' }] }];

      expect(
        OpenSeadragonViewer.annotationsMatch(currentAnnotations, previousAnnotations),
      ).toBe(false);
    });

    it('is true if the previous annotation\'s resource IDs all match', () => {
      const currentAnnotations = [{ id: 1, resources: [{ id: 'rid1' }] }];
      const previousAnnotations = [{ id: 1, resources: [{ id: 'rid1' }] }];

      expect(
        OpenSeadragonViewer.annotationsMatch(currentAnnotations, previousAnnotations),
      ).toBe(true);
    });

    it('is true if both are empty', () => {
      expect(OpenSeadragonViewer.annotationsMatch([], [])).toBe(true);
    });

    it('is false if the previous annotation\'s resource IDs do not match', () => {
      const currentAnnotations = [{ id: 1, resources: [{ id: 'rid1' }] }];
      const previousAnnotations = [{ id: 1, resources: [{ id: 'rid2' }] }];

      expect(
        OpenSeadragonViewer.annotationsMatch(currentAnnotations, previousAnnotations),
      ).toBe(false);
    });

    it('returns true if the annotation resources IDs are empty (to prevent unecessary rerender)', () => {
      const currentAnnotations = [{ id: 1, resources: [] }];
      const previousAnnotations = [{ id: 1, resources: [] }];

      expect(
        OpenSeadragonViewer.annotationsMatch(currentAnnotations, previousAnnotations),
      ).toBe(true);
    });
  });

  describe('tileSourcesMatch', () => {
    it('when they do not match', () => {
      expect(wrapper.instance().tileSourcesMatch([])).toBe(false);
    });
    it('with an empty array', () => {
      wrapper.instance().viewer = {
        close: () => {},
      };
      wrapper.setProps({ tileSources: [] });
      expect(wrapper.instance().tileSourcesMatch([])).toBe(true);
    });
    it('when the @ids do match', () => {
      expect(wrapper.instance().tileSourcesMatch([{ '@id': 'http://foo' }])).toBe(true);
    });
  });

  describe('addAllTileSources', () => {
    it('calls addTileSource for every tileSources and then zoomsToWorld', () => {
      wrapper.instance().viewer = {
        close: () => {},
      };
      wrapper.setProps({ tileSources: [1, 2, 3, 4] });
      const mockAddTileSource = jest.fn();
      wrapper.instance().addTileSource = mockAddTileSource;
      wrapper.instance().addAllTileSources();
      expect(mockAddTileSource).toHaveBeenCalledTimes(4);
    });
  });

  describe('addTileSource', () => {
    it('calls addTiledImage asynchronously on the OSD viewer', async () => {
      wrapper.instance().addTileSource({}).then((event) => {
        expect(event).toBe('event');
      });
    });
    it('when a viewer is not available, returns an unresolved Promise', () => {
      expect(wrapper.instance().addTileSource({})).toEqual(expect.any(Promise));
    });
  });
  describe('fitBounds', () => {
    it('calls OSD viewport.fitBounds with provided x, y, w, h', () => {
      wrapper.instance().viewer = {
        viewport: {
          fitBounds: jest.fn(),
        },
      };
      wrapper.instance().fitBounds(1, 2, 3, 4);
      expect(
        wrapper.instance().viewer.viewport.fitBounds,
      ).toHaveBeenCalledWith(expect.any(OpenSeadragon.Rect), true);
    });
  });

  describe('zoomToWorld', () => {
    it('uses fitBounds with the existing CanvasWorld', () => {
      const fitBounds = jest.fn();
      wrapper.instance().fitBounds = fitBounds;
      wrapper.instance().zoomToWorld();
      expect(fitBounds).toHaveBeenCalledWith(0, 0, 5041, 1800, true);
    });
  });

  describe('componentDidMount', () => {
    let panTo;
    let zoomTo;
    let addHandler;
    beforeEach(() => {
      panTo = jest.fn();
      zoomTo = jest.fn();
      addHandler = jest.fn();

      wrapper = shallow(
        <OpenSeadragonViewer
          tileSources={[{ '@id': 'http://foo' }]}
          windowId="base"
          viewer={{ x: 1, y: 0, zoom: 0.5 }}
          config={{}}
          updateViewport={updateViewport}
          canvasWorld={new CanvasWorld([])}
          t={k => k}
        >
          <div className="foo" />
        </OpenSeadragonViewer>,
      );

      wrapper.instance().ref = { current: true };

      OpenSeadragon.mockImplementation(() => ({
        addHandler,
        addTiledImage: jest.fn().mockResolvedValue('event'),
        viewport: { panTo, zoomTo },
      }));
    });

    it('calls the OSD viewport panTo and zoomTo with the component state', () => {
      wrapper.instance().componentDidMount();

      expect(panTo).toHaveBeenCalledWith(
        { x: 1, y: 0, zoom: 0.5 }, true,
      );
      expect(zoomTo).toHaveBeenCalledWith(
        0.5, { x: 1, y: 0, zoom: 0.5 }, true,
      );
    });

    it('adds animation-start/finish flag for rerendering performance', () => {
      wrapper.instance().componentDidMount();

      expect(addHandler).toHaveBeenCalledWith('animation-start', expect.anything());
      expect(addHandler).toHaveBeenCalledWith('animation-finish', expect.anything());
      expect(addHandler).toHaveBeenCalledWith('animation-finish', wrapper.instance().onViewportChange);
    });

    it('sets up a OpenSeadragonCanvasOverlay', () => {
      wrapper.instance().componentDidMount();
      expect(OpenSeadragonCanvasOverlay).toHaveBeenCalledTimes(1);
    });

    it('sets up a listener on update-viewport', () => {
      wrapper.instance().componentDidMount();
      expect(addHandler).toHaveBeenCalledWith('update-viewport', expect.anything());
    });
  });

  describe('componentDidUpdate', () => {
    it('calls the OSD viewport panTo and zoomTo with the component state and forces a redraw', () => {
      const panTo = jest.fn();
      const zoomTo = jest.fn();
      const forceRedraw = jest.fn();

      wrapper.instance().viewer = {
        forceRedraw,
        viewport: {
          centerSpringX: { target: { value: 10 } },
          centerSpringY: { target: { value: 10 } },
          panTo,
          zoomSpring: { target: { value: 1 } },
          zoomTo,
        },
      };

      wrapper.setProps({ viewer: { x: 0.5, y: 0.5, zoom: 0.1 } });
      wrapper.setProps({ viewer: { x: 1, y: 0, zoom: 0.5 } });

      expect(panTo).toHaveBeenCalledWith(
        { x: 1, y: 0, zoom: 0.5 }, false,
      );
      expect(zoomTo).toHaveBeenCalledWith(
        0.5, { x: 1, y: 0, zoom: 0.5 }, false,
      );
      expect(forceRedraw).not.toHaveBeenCalled();
    });

    it('sets up canvasUpdate to add annotations to the canvas and forces a redraw', () => {
      const clear = jest.fn();
      const resize = jest.fn();
      const canvasUpdate = jest.fn();
      const forceRedraw = jest.fn();

      wrapper.instance().osdCanvasOverlay = {
        canvasUpdate,
        clear,
        resize,
      };

      wrapper.instance().viewer = { forceRedraw };

      wrapper.setProps(
        {
          selectedAnnotations: [
            new Annotation(
              { '@id': 'foo', resources: [{ foo: 'bar' }] },
            ),
          ],
        },
      );
      wrapper.setProps(
        {
          selectedAnnotations: [
            new Annotation(
              { '@id': 'foo', resources: [{ foo: 'bar' }] },
            ),
          ],
        },
      );
      wrapper.setProps(
        {
          selectedAnnotations: [
            new Annotation(
              { '@id': 'bar', resources: [{ foo: 'bar' }] },
            ),
          ],
        },
      );
      wrapper.instance().updateCanvas();
      expect(clear).toHaveBeenCalledTimes(1);
      expect(resize).toHaveBeenCalledTimes(1);
      expect(canvasUpdate).toHaveBeenCalledTimes(1);
      expect(forceRedraw).toHaveBeenCalled();
    });
  });

  describe('onViewportChange', () => {
    it('translates the OSD viewport data into an update to the component state', () => {
      wrapper.instance().onViewportChange({
        eventSource: {
          viewport: {
            centerSpringX: { target: { value: 1 } },
            centerSpringY: { target: { value: 0 } },
            zoomSpring: { target: { value: 0.5 } },
          },
        },
      });

      expect(updateViewport).toHaveBeenCalledWith(
        'base',
        { x: 1, y: 0, zoom: 0.5 },
      );
    });
  });

  describe('onUpdateViewport', () => {
    it('fires updateCanvas', () => {
      const updateCanvas = jest.fn();
      wrapper.instance().updateCanvas = updateCanvas;
      wrapper.instance().onUpdateViewport();
      expect(updateCanvas).toHaveBeenCalledTimes(1);
    });
  });

  describe('annotationsToContext', () => {
    it('converts the annotations to canvas', () => {
      const strokeRect = jest.fn();
      wrapper.instance().osdCanvasOverlay = {
        context2d: {
          strokeRect,
        },
      };
      wrapper.instance().viewer = {
        viewport: {
          getZoom: () => (0.0005),
        },
      };

      const annotations = [
        new Annotation(
          { '@id': 'foo', resources: [{ on: 'www.example.com/#xywh=10,10,100,200' }] },
        ),
      ];
      wrapper.instance().annotationsToContext(annotations);
      const context = wrapper.instance().osdCanvasOverlay.context2d;
      expect(context.strokeStyle).toEqual('yellow');
      expect(context.lineWidth).toEqual(4);
      expect(strokeRect).toHaveBeenCalledWith(10, 10, 100, 200);
    });
  });
});
