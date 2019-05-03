import { validatePlugin } from '../../../src/extend/pluginValidation';

/** */
const createPlugin = props => ({
  component: x => x,
  mapDispatchToProps: x => x,
  mapStateToProps: x => x,
  mode: 'add',
  name: 'test',
  reducers: {
    bar: x => x,
    foo: x => x,
  },
  target: 'Window',
  ...props,
});

describe('validatePlugin', () => {
  it('return true if plugin is valid', () => {
    const plugin = createPlugin();
    expect(validatePlugin(plugin)).toBe(true);
  });

  it('plugin must be a object', () => {
    const plugin = [];
    expect(validatePlugin(plugin)).toBe(false);
  });

  it('name must be undefined or string', () => {
    let plugin = createPlugin({ name: undefined });
    expect(validatePlugin(plugin)).toBe(true);
    plugin = createPlugin({ name: 'test' });
    expect(validatePlugin(plugin)).toBe(true);
    plugin = createPlugin({ name: [] });
    expect(validatePlugin(plugin)).toBe(false);
  });

  it('target must be string', () => {
    let plugin = createPlugin({ target: undefined });
    expect(validatePlugin(plugin)).toBe(false);
    plugin = createPlugin({ target: 'test' });
    expect(validatePlugin(plugin)).toBe(true);
    plugin = createPlugin({ target: [] });
    expect(validatePlugin(plugin)).toBe(false);
  });

  it('mode must be "add" or "wrap"', () => {
    let plugin = createPlugin({ mode: undefined });
    expect(validatePlugin(plugin)).toBe(false);
    plugin = createPlugin({ mode: 'somethink' });
    expect(validatePlugin(plugin)).toBe(false);
    plugin = createPlugin({ mode: 'add' });
    expect(validatePlugin(plugin)).toBe(true);
    plugin = createPlugin({ mode: 'wrap' });
    expect(validatePlugin(plugin)).toBe(true);
  });

  it('component must be function', () => {
    let plugin = createPlugin({ component: undefined });
    expect(validatePlugin(plugin)).toBe(false);
    plugin = createPlugin({ component: 'somethink' });
    expect(validatePlugin(plugin)).toBe(false);
    plugin = createPlugin({ component: x => x });
    expect(validatePlugin(plugin)).toBe(true);
  });

  it('mapStateToProps must be undefined, null or function', () => {
    let plugin = createPlugin({ mapStateToProps: undefined });
    expect(validatePlugin(plugin)).toBe(true);
    plugin = createPlugin({ mapStateToProps: x => x });
    expect(validatePlugin(plugin)).toBe(true);
    plugin = createPlugin({ mapStateToProps: null });
    expect(validatePlugin(plugin)).toBe(true);
    plugin = createPlugin({ mapStateToProps: 'something' });
    expect(validatePlugin(plugin)).toBe(false);
  });

  it('mapDispatchToProps must be undefined, null, function or object', () => {
    let plugin = createPlugin({ mapDispatchToProps: undefined });
    expect(validatePlugin(plugin)).toBe(true);
    plugin = createPlugin({ mapDispatchToProps: x => x });
    expect(validatePlugin(plugin)).toBe(true);
    plugin = createPlugin({ mapDispatchToProps: {} });
    expect(validatePlugin(plugin)).toBe(true);
    plugin = createPlugin({ mapDispatchToProps: null });
    expect(validatePlugin(plugin)).toBe(true);
    plugin = createPlugin({ mapDispatchToProps: 'something' });
    expect(validatePlugin(plugin)).toBe(false);
  });

  it('reducers must be undefined or object', () => {
    let plugin = createPlugin({ reducers: undefined });
    expect(validatePlugin(plugin)).toBe(true);
    plugin = createPlugin({ reducers: {} });
    expect(validatePlugin(plugin)).toBe(true);
    plugin = createPlugin({ reducers: 'something' });
    expect(validatePlugin(plugin)).toBe(false);
  });

  it('each reducer must be a function', () => {
    let reducers = { bar: x => x, foo: x => x };
    let plugin = createPlugin({ reducers });
    expect(validatePlugin(plugin)).toBe(true);
    reducers = { bar: x => x, foo: undefined };
    plugin = createPlugin({ reducers });
    expect(validatePlugin(plugin)).toBe(false);
  });
});
