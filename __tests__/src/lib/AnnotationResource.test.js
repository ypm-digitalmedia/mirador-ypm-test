import AnnotationResource from '../../../src/lib/AnnotationResource';

describe('AnnotationResource', () => {
  describe('id', () => {
    it('returns the @id', () => {
      expect(new AnnotationResource({ '@id': 'foo' }).id).toEqual('foo');
    });
    it('creates a memoized uuid', () => {
      const annoResource = new AnnotationResource();
      const expected = annoResource.id;
      expect(annoResource.id).toEqual(expected);
    });
  });

  describe('targetId', () => {
    it('removes fragmentSelector coords from string targets', () => {
      expect(
        new AnnotationResource({ on: 'www.example.com/#xywh=10,10,100,200' }).targetId,
      ).toEqual('www.example.com/');
    });

    it('can target an array of selectors', () => {
      expect(
        new AnnotationResource({ on: [{ full: 'www.example.com/#xywh=10,10,100,200' }] }).targetId,
      ).toEqual('www.example.com/');
    });

    it('removes fragmentSelector coords from object targets', () => {
      expect(
        new AnnotationResource({ on: { full: 'www.example.com/#xywh=10,10,100,200' } }).targetId,
      ).toEqual('www.example.com/');
    });

    it('returns null when there is no target', () => {
      expect(new AnnotationResource().targetId).toBeNull();
    });
  });

  describe('motivations', () => {
    it('with no motivation', () => {
      expect(new AnnotationResource().motivations).toEqual([]);
    });
    it('with a single motivation', () => {
      expect(new AnnotationResource({ motivation: 'oa:commenting' })
        .motivations).toEqual(['oa:commenting']);
    });
    it('with multiple motivations', () => {
      expect(new AnnotationResource({ motivation: ['oa:commenting', 'sc:funstuff'] })
        .motivations).toEqual(['oa:commenting', 'sc:funstuff']);
    });
  });
  describe('resources', () => {
    it('with no resource', () => {
      expect(new AnnotationResource().resources).toEqual([]);
    });
    it('with a single resource', () => {
      expect(new AnnotationResource({ resource: 'foo' })
        .resources).toEqual(['foo']);
    });
    it('with multiple resources', () => {
      expect(new AnnotationResource({ resource: ['foo', 'bar'] })
        .resources).toEqual(['foo', 'bar']);
    });
  });
  describe('on', () => {
    it('with no on', () => {
      expect(new AnnotationResource().on).toEqual([]);
    });
    it('with a single on', () => {
      expect(new AnnotationResource({ on: 'foo' })
        .on).toEqual(['foo']);
    });
    it('with multiple on', () => {
      expect(new AnnotationResource({ on: ['foo', 'bar'] })
        .on).toEqual(['foo', 'bar']);
    });
  });
  describe('selector', () => {
    it('returns the on string (for simple fragment selector)', () => {
      expect(new AnnotationResource({ on: 'yolo' }).selector).toEqual('yolo');
    });
    it('picks the default selector when given a choice', () => {
      expect(new AnnotationResource({ on: { selector: { '@type': 'oa:Choice', default: { value: 'www.example.com/#xywh=10,10,100,200' } } } })
        .selector).toEqual({ value: 'www.example.com/#xywh=10,10,100,200' });
    });
    it('returns the selector when not given a choice', () => {
      expect(new AnnotationResource({ on: { selector: { value: 'www.example.com/#xywh=10,10,100,200' } } })
        .selector).toEqual({ value: 'www.example.com/#xywh=10,10,100,200' });
    });
  });
  describe('chars', () => {
    it('with no resource', () => {
      expect(new AnnotationResource().chars).toEqual('');
    });
    it('with a single resource', () => {
      expect(new AnnotationResource({ resource: { chars: 'foo' } })
        .chars).toEqual('foo');
    });
    it('with multiple resources', () => {
      expect(new AnnotationResource({ resource: [{ chars: 'foo' }, { chars: 'bar' }] })
        .chars).toEqual('foo bar');
    });
  });
  describe('fragmentSelector', () => {
    it('simple string', () => {
      expect(new AnnotationResource({ on: 'www.example.com/#xywh=10,10,100,200' })
        .fragmentSelector).toEqual([10, 10, 100, 200]);
    });

    it('array of selectors', () => {
      expect(new AnnotationResource({ on: [{ selector: { value: 'www.example.com/#xywh=10,10,100,200' } }] })
        .fragmentSelector).toEqual([10, 10, 100, 200]);
    });

    it('more complex selector', () => {
      expect(new AnnotationResource({ on: { selector: { value: 'www.example.com/#xywh=10,10,100,200' } } })
        .fragmentSelector).toEqual([10, 10, 100, 200]);
    });

    it('choice selector', () => {
      expect(new AnnotationResource({ on: { selector: { '@type': 'oa:Choice', default: { value: 'www.example.com/#xywh=10,10,100,200' } } } })
        .fragmentSelector).toEqual([10, 10, 100, 200]);
    });
  });
});
