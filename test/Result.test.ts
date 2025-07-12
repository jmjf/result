import assert from 'node:assert';
import { test } from 'node:test';

import { okResult, errorResult, resultify, resultifyAsync } from '../src/Result.ts';

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

test('when ok, a resultified function returns a result with a value', () => {
	function fn(a1: number): string {
		return `${a1}`
	}

	const testFn = resultify<typeof fn, Error>(fn)
	const testVal = 42

	const result = testFn(testVal);

	assert.equal(result.error, null, 'error is null');
	assert.equal(result.value, `${testVal}`, 'value is expected value')
})

test('when error, a resultified function returns a result with an error', () => {
	const errMsg = 'test error';
	function fn(a1: number): string {
		throw new Error(errMsg)
	}

	const testFn = resultify<typeof fn, Error>(fn)
	const testVal = 42

	const result = testFn(testVal);

	assert.equal(result.value, null, 'value is null')
	if (result.error === null) assert.fail('error is null')
	assert.equal(result.error.message, errMsg, 'error message is expected value');
})

test('when ok, a resultified async function returns a Promised result with a value', async () => {
	async function fn(a1: number): Promise<string> {
		return `${a1}`
	}

	const testFn = resultifyAsync<typeof fn, Error>(fn)
	const testVal = 42

	const result = await testFn(testVal);

	assert.equal(result.error, null, 'error is null');
	assert.equal(result.value, `${testVal}`, 'value is expected value')
})

test('when error, a resultified async function returns a Promised result with an error', async () => {
	const errMsg = 'test error';
	async function fn(a1: number): Promise<string> {
		throw new Error(errMsg)
	}

	const testFn = resultifyAsync<typeof fn, Error>(fn)
	const testVal = 42

	const result = await testFn(testVal);

	assert.equal(result.value, null, 'value is null')
	if (result.error === null) assert.fail('error is null')
	assert.equal(result.error.message, errMsg, 'error message is expected value');
})