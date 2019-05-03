import CanvasGroupings from '../../../src/lib/CanvasGroupings';

describe('CanvasGroupings', () => {
  describe('constructor', () => {
    it('sets canvases and viewType', () => {
      const subject = new CanvasGroupings([null, null], 'book');
      expect(subject.viewType).toEqual('book');
      expect(subject.canvases.length).toEqual(2);
    });
    it('viewType default is single', () => {
      const subject = new CanvasGroupings([null, null]);
      expect(subject.viewType).toEqual('single');
    });
  });
  describe('groupings', () => {
    describe('single', () => {
      it('creates an array of arrays of the canvases', () => {
        const subject = new CanvasGroupings([null, null, null, null]);
        expect(subject.groupings().length).toEqual(4);
        expect(subject.groupings()[0]).toEqual(expect.arrayContaining([null]));
      });
    });
    describe('book', () => {
      let subject;
      beforeEach(() => {
        subject = new CanvasGroupings([0, 1, 2, 3], 'book');
      });
      it('creates an array of groupings of the canvases', () => {
        expect(subject.groupings().length).toEqual(3);
      });
      it('first grouping has only 1 canvas', () => {
        expect(subject.groupings()[0]).toEqual([0]);
      });
      it('second grouping has 2 canvases', () => {
        expect(subject.groupings()[1]).toEqual([1, 2]);
      });
    });
  });
  describe('getCanvases', () => {
    describe('single', () => {
      it('selects by index', () => {
        const subject = new CanvasGroupings([0, 1, 2, 3]);
        expect(subject.getCanvases(2)).toEqual([2]);
      });
    });
    describe('book', () => {
      let subject;
      beforeEach(() => {
        subject = new CanvasGroupings([0, 1, 2, 3], 'book');
      });
      it('selects by index / 2', () => {
        expect(subject.getCanvases(2)).toEqual([1, 2]);
      });
    });
    describe('gallery', () => {
      it('selects by index', () => {
        const subject = new CanvasGroupings([0, 1, 2, 3]);
        expect(subject.getCanvases(2)).toEqual([2]);
      });
    });
  });
});
