import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as actions from '../../../src/state/actions';
import ActionTypes from '../../../src/state/actions/action-types';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('annotation actions', () => {
  describe('requestAnnotation', () => {
    it('requests an annotation from given a url', () => {
      const canvasId = 'foo';
      const annotationId = 'abc123';
      const expectedAction = {
        annotationId,
        canvasId,
        type: ActionTypes.REQUEST_ANNOTATION,
      };
      expect(actions.requestAnnotation(canvasId, annotationId)).toEqual(expectedAction);
    });
  });
  describe('receiveAnnotation', () => {
    it('recieves an annotation', () => {
      const canvasId = 'foo';
      const annotationId = 'abc123';
      const json = {
        annotationId,
        content: 'annotation request',
      };
      const expectedAction = {
        annotationId,
        annotationJson: json,
        canvasId,
        type: ActionTypes.RECEIVE_ANNOTATION,
      };
      expect(actions.receiveAnnotation(canvasId, annotationId, json)).toEqual(expectedAction);
    });
  });
  describe('fetchAnnotation', () => {
    let store = null;
    beforeEach(() => {
      store = mockStore({});
    });
    describe('success response', () => {
      beforeEach(() => {
        fetch.mockResponseOnce(JSON.stringify({ data: '12345' })); // eslint-disable-line no-undef
      });
      it('dispatches the REQUEST_ANNOTATION action', () => {
        store.dispatch(actions.fetchAnnotation(
          'https://iiif.harvardartmuseums.org/manifests/object/299843/canvas/canvas-47174896',
          'https://iiif.harvardartmuseums.org/manifests/object/299843/list/47174896',
        ));
        expect(store.getActions()).toEqual([
          {
            annotationId: 'https://iiif.harvardartmuseums.org/manifests/object/299843/list/47174896',
            canvasId: 'https://iiif.harvardartmuseums.org/manifests/object/299843/canvas/canvas-47174896',
            type: 'REQUEST_ANNOTATION',
          },
        ]);
      });
      it('dispatches the REQUEST_ANNOTATION and then RECEIVE_ANNOTATION', () => {
        store.dispatch(actions.fetchAnnotation(
          'https://iiif.harvardartmuseums.org/manifests/object/299843/canvas/canvas-47174896',
          'https://iiif.harvardartmuseums.org/manifests/object/299843/list/47174896',
        ))
          .then(() => {
            const expectedActions = store.getActions();
            expect(expectedActions).toEqual([
              {
                annotationId: 'https://iiif.harvardartmuseums.org/manifests/object/299843/list/47174896',
                canvasId: 'https://iiif.harvardartmuseums.org/manifests/object/299843/canvas/canvas-47174896',
                type: 'REQUEST_ANNOTATION',
              },
              {
                annotationId: 'https://iiif.harvardartmuseums.org/manifests/object/299843/list/47174896',
                annotationJson: { data: '12345' },
                canvasId: 'https://iiif.harvardartmuseums.org/manifests/object/299843/canvas/canvas-47174896',
                type: 'RECEIVE_ANNOTATION',
              },
            ]);
          });
      });
    });
    describe('error response', () => {
      it('dispatches the REQUEST_ANNOTATION and then RECEIVE_ANNOTATION', () => {
        store.dispatch(actions.fetchAnnotation(
          'https://iiif.harvardartmuseums.org/manifests/object/299843/canvas/canvas-47174896',
          'https://iiif.harvardartmuseums.org/manifests/object/299843/list/47174896',
        ))
          .then(() => {
            const expectedActions = store.getActions();
            expect(expectedActions).toEqual([
              {
                annotationId: 'https://iiif.harvardartmuseums.org/manifests/object/299843/list/47174896',
                canvasId: 'https://iiif.harvardartmuseums.org/manifests/object/299843/canvas/canvas-47174896',
                type: 'REQUEST_ANNOTATION',
              },
              {
                annotationId: 'https://iiif.harvardartmuseums.org/manifests/object/299843/list/47174896',
                canvasId: 'https://iiif.harvardartmuseums.org/manifests/object/299843/canvas/canvas-47174896',
                error: new Error('invalid json response body at undefined reason: Unexpected end of JSON input'),
                type: 'RECEIVE_ANNOTATION_FAILURE',
              },
            ]);
          });
      });
    });
  });

  it('handles the selectAnnotation action', () => {
    const windowId = 'wId1';
    const canvasId = 'cId1';
    const annotationId = 'aId1';
    const expectedAction = {
      annotationId,
      canvasId,
      type: ActionTypes.SELECT_ANNOTATION,
      windowId,
    };
    expect(actions.selectAnnotation(windowId, canvasId, annotationId)).toEqual(expectedAction);
  });

  it('handles the deselectAnnotation action', () => {
    const windowId = 'wId1';
    const canvasId = 'cId1';
    const annotationId = 'aId1';
    const expectedAction = {
      annotationId,
      canvasId,
      type: ActionTypes.DESELECT_ANNOTATION,
      windowId,
    };
    expect(actions.deselectAnnotation(windowId, canvasId, annotationId)).toEqual(expectedAction);
  });

  it('handles the toggleAnnotationDisplay action', () => {
    const windowId = 'wId1';
    const expectedAction = {
      type: ActionTypes.TOGGLE_ANNOTATION_DISPLAY,
      windowId,
    };
    expect(actions.toggleAnnotationDisplay(windowId)).toEqual(expectedAction);
  });

  it('handles the highlightAnnotation action', () => {
    const windowId = 'wId1';
    const annotationId = 'aId1';
    const expectedAction = {
      annotationId,
      type: ActionTypes.HIGHLIGHT_ANNOTATION,
      windowId,
    };
    expect(actions.highlightAnnotation(windowId, annotationId)).toEqual(expectedAction);
  });
});
