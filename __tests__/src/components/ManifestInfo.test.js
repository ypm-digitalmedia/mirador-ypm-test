import React from 'react';
import { shallow } from 'enzyme';
import Typography from '@material-ui/core/Typography';
import { ManifestInfo } from '../../../src/components/ManifestInfo';
import { LabelValueMetadata } from '../../../src/components/LabelValueMetadata';
import CollapsibleSection from '../../../src/containers/CollapsibleSection';
import { SanitizedHtml } from '../../../src/components/SanitizedHtml';

describe('ManifestInfo', () => {
  const metadata = [{ label: {}, value: {} }];
  let wrapper;

  describe('when metadata is present', () => {
    beforeEach(() => {
      wrapper = shallow(
        <ManifestInfo
          id="xyz"
          manifestLabel="The Manifest Label"
          manifestDescription="The Manifest Description"
          manifestMetadata={metadata}
          t={str => str}
        />,
      );
    });

    it('renders the content in a CollapsibleSection', () => {
      expect(wrapper.find(CollapsibleSection).length).toBe(1);
    });

    it('renders manifest label', () => {
      expect(
        wrapper.find(Typography).at(0).matchesElement(
          <Typography>The Manifest Label</Typography>,
        ),
      ).toBe(true);
    });

    it('renders manifest description in SanitizedHtml component', () => {
      expect(
        wrapper.find(Typography).at(1).matchesElement(
          <Typography>
            <SanitizedHtml htmlString="The Manifest Description" ruleSet="iiif" />
          </Typography>,
        ),
      ).toBe(true);
    });

    it('renders manifest metadata in LabelValueMetadata component', () => {
      expect(
        wrapper.find(LabelValueMetadata).at(0).matchesElement(
          <LabelValueMetadata labelValuePairs={metadata} />,
        ),
      ).toBe(true);
    });
  });

  describe('when metadata is not present', () => {
    beforeEach(() => {
      wrapper = shallow(
        <ManifestInfo id="xyz" />,
      );
    });

    it('does not render empty elements elements', () => {
      expect(wrapper.find(LabelValueMetadata).length).toBe(0);
    });
  });
});
