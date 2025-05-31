import { expect, test } from 'bun:test';
import { getLogger } from '../src/index';

test('getLogger returns a logger instance', () => {
  const logger = getLogger();
  expect(logger).toBeDefined();
  expect(logger.info).toBeInstanceOf(Function);
  expect(logger.warn).toBeInstanceOf(Function);
  expect(logger.error).toBeInstanceOf(Function);
});

test('getLogger creates a logger instance (basic check)', () => {
  const logger = getLogger();
  expect(logger).toBeDefined();
});
