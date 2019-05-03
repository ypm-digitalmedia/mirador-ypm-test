import React from 'react';
import { shallow } from 'enzyme';
import MiradorMenuButton from '../../../src/containers/MiradorMenuButton';
import { ZoomControls } from '../../../src/components/ZoomControls';

/** Utility function to create a shallow rendering */
function createWrapper(props) {
  return shallow(
    <ZoomControls
      classes={{ divider: 'divider', zoom_controls: 'zoom_controls' }}
      windowId="xyz"
      zoomToWorld={() => {}}
      {...props}

    />,
  );
}

describe('ZoomControls', () => {
  let wrapper;
  const viewer = { x: 100, y: 100, zoom: 1 };
  const showZoomControls = false;
  let updateViewport;

  beforeEach(() => {
    updateViewport = jest.fn();
    wrapper = createWrapper({ showZoomControls, updateViewport, viewer });
  });

  describe('with showZoomControls=false', () => {
    it('renders nothing unless asked', () => {
      expect(wrapper.find('div.zoom_controls').length).toBe(0);
    });
  });

  describe('with showZoomControls=true', () => {
    const zoomToWorld = jest.fn();
    beforeEach(() => {
      updateViewport = jest.fn();
      wrapper = createWrapper({
        showZoomControls: true, updateViewport, viewer, zoomToWorld,
      });
    });

    it('renders a couple buttons', () => {
      expect(wrapper.find('div.zoom_controls').length).toBe(1);
      expect(wrapper.find(MiradorMenuButton).length).toBe(3);
    });

    it('has a zoom-in button', () => {
      const button = wrapper.find({ 'aria-label': 'zoomIn' }).first();
      button.props().onClick(); // Trigger the onClick prop
      expect(updateViewport).toHaveBeenCalledTimes(1);
      expect(updateViewport).toHaveBeenCalledWith('xyz', { x: 100, y: 100, zoom: 2 });
    });

    it('has a zoom-out button', () => {
      const button = wrapper.find({ 'aria-label': 'zoomOut' }).first();
      button.props().onClick(); // Trigger the onClick prop
      expect(updateViewport).toHaveBeenCalledTimes(1);
      expect(updateViewport).toHaveBeenCalledWith('xyz', { x: 100, y: 100, zoom: 0.5 });
    });

    it('has a zoom reset button', () => {
      const button = wrapper.find({ 'aria-label': 'zoomReset' }).first();
      button.props().onClick(); // Trigger the onClick prop
      expect(zoomToWorld).toHaveBeenCalledTimes(1);
      expect(zoomToWorld).toHaveBeenCalledWith(false);
    });
  });

  describe('handleZoomInClick', () => {
    it('increases the zoom value on Zoom-In', () => {
      wrapper.instance().handleZoomInClick();
      expect(updateViewport).toHaveBeenCalled();
    });
  });

  describe('responsive divider', () => {
    it('is present when the displayDivider prop is true (default)', () => {
      wrapper = createWrapper({ showZoomControls: true, viewer });
      expect(wrapper.find('span.divider').length).toEqual(1);
    });

    it('is not present when the displayDivider prop is false', () => {
      wrapper = createWrapper({ displayDivider: false, showZoomControls: true, viewer });
      expect(wrapper.find('.divider').length).toEqual(0);
    });
  });
});
