import { assert, describe, it } from 'vitest';
import { FN } from '../src';

describe('format', () => {
  it('FN', () => {
    let result = FN('00123415678.987654321000');
    assert.equal(result.toNumber(), '123415678.987654321');
    result = result.compact({ rounding: 'down', precision: 4 }).prefix('$');
    let _object = result.toObject();
    assert.equal(_object.value, '123.4156');
    assert.equal(_object.compactedSymbol, 'M');
    assert.equal(_object.prefix, '$');
    result = result.round({ rounding: 'up', precision: 1 }).suffix(' Token');
    _object = result.toObject();
    assert.equal(_object.value, '123.5');
    assert.equal(_object.suffix, ' Token');
    assert.equal(result.toNumber(), '$123.5M Token');
  });
});
