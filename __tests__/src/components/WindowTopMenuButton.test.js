import React from 'react';
import { shallow } from 'enzyme';
import WindowTopMenu from '../../../src/containers/WindowTopMenu';
import { WindowTopMenuButton } from '../../../src/components/WindowTopMenuButton';
import MiradorMenuButton from '../../../src/containers/MiradorMenuButton';

/** create wrapper */
function createWrapper(props) {
  return shallow(
    <WindowTopMenuButton
      windowId="xyz"
      classes={{ ctrlBtnSelected: 'ctrlBtnSelected' }}
      t={str => str}
      {...props}
    />,
  );
}

describe('WindowTopMenuButton', () => {
  it('renders all needed elements', () => {
    const wrapper = createWrapper();
    expect(wrapper.find(MiradorMenuButton).length).toBe(1);
    expect(wrapper.find(WindowTopMenu).length).toBe(1);
  });

  it('passes correct props to <WindowTopMenu/>', () => {
    const wrapper = createWrapper();
    const props = wrapper.find(WindowTopMenu).first().props();
    const { handleMenuClose } = wrapper.instance();
    expect(props.windowId).toBe('xyz');
    expect(props.anchorEl).toBe(null);
    expect(props.handleClose).toBe(handleMenuClose);
  });

  it('passes correct props to <MiradorMenuButton />', () => {
    const wrapper = createWrapper();
    const props = wrapper.find(MiradorMenuButton).first().props();
    const { handleMenuClick } = wrapper.instance();
    expect(props.onClick).toBe(handleMenuClick);
  });

  it('toggles anchor element in <WindowTopMenu/> on menu open/close', () => {
    const wrapper = createWrapper();
    expect(wrapper.find(WindowTopMenu).first().props().anchorEl).toBe(null);

    wrapper.instance().handleMenuClick({ currentTarget: 'bubu' });
    expect(wrapper.find(WindowTopMenu).first().props().anchorEl).toBe('bubu');

    wrapper.instance().handleMenuClose();
    expect(wrapper.find(WindowTopMenu).first().props().anchorEl).toBe(null);
  });

  it('the button has a class indicating that it is "selected" once it is clicked', () => {
    const wrapper = createWrapper();
    const menuButton = wrapper.find(MiradorMenuButton).first();

    expect(wrapper.find(MiradorMenuButton).first().props().className).toEqual(null);
    menuButton.props().onClick({ currentTarget: 'anElement' });
    expect(wrapper.find(MiradorMenuButton).first().props().className).toEqual('ctrlBtnSelected');
    menuButton.props().onClick({});
    expect(wrapper.find(MiradorMenuButton).first().props().className).toEqual(null);
  });
});
