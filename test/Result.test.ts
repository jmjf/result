import assert from 'node:assert';
import { test } from 'node:test';

import { okResult, errorResult } from '../src/Result.ts';

test('okResult returns the expected value and error === null', () => {
	const testVal = 'success';

	const testResult = okResult(testVal);

	assert.equal(testResult.error, null, 'error is null');
	assert.equal(testResult.value, testVal, 'value is expected value');
});

test('errorResult returns the expected error value and value === null', () => {
	const testVal = 'error';

	const testResult = errorResult(testVal);

	assert.equal(testResult.error, testVal, 'error is expected value');
	assert.equal(testResult.value, null, 'value is null');
});
