import React from 'react';
import { shallow } from 'enzyme';
import { WorkspaceExport } from '../../../src/components/WorkspaceExport';

describe('WorkspaceExport', () => {
  let wrapper;
  let handleClose;
  let mockState;

  beforeEach(() => {
    handleClose = jest.fn();
    mockState = {
      companionWindows: {},
      config: {},
      elasticLayout: {},
      viewers: {},
      windows: {},
      workspace: {},
    };

    wrapper = shallow(
      <WorkspaceExport
        open
        handleClose={handleClose}
        state={mockState}
      />,
    );
  });

  it('renders without an error', () => {
    expect(wrapper.find('WithStyles(Dialog)').length).toBe(1);
  });

  it('renders an exportable version of state', () => {
    expect(wrapper.find('pre').length).toBe(1);
    expect(wrapper.find('pre').text()).toMatch('"companionWindows":');
    expect(wrapper.find('pre').text()).toMatch('"config":');
    expect(wrapper.find('pre').text()).toMatch('"elasticLayout":');
    expect(wrapper.find('pre').text()).toMatch('"viewers":');
    expect(wrapper.find('pre').text()).toMatch('"windows":');
    expect(wrapper.find('pre').text()).toMatch('"workspace":');
    expect(wrapper.find('pre').text()).not.toMatch('"manifests":');
  });
});
