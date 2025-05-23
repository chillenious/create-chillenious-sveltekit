export { Lucia } from './core';
export { Scrypt, LegacyScrypt, generateId, generateIdFromEntropySize } from './crypto';
export { TimeSpan } from './date.js';
export { Cookie, type CookieAttributes } from './cookie';
export { verifyRequestOrigin } from './request';

export type { User, Session, SessionCookieOptions, SessionCookieAttributesOptions } from './core.js';
export type { DatabaseSession, DatabaseUser, Adapter } from './database.js';
export type { PasswordHashingAlgorithm } from './crypto.js';

import type { Lucia } from './core.js';

export interface Register {}

export type UserId = Register extends {
  UserId: infer _UserId;
}
  ? _UserId
  : string;

export type RegisteredLucia = Register extends {
  Lucia: infer _Lucia;
}
  ? _Lucia extends Lucia<any, any>
    ? _Lucia
    : Lucia
  : Lucia;

export type RegisteredDatabaseUserAttributes = Register extends {
  DatabaseUserAttributes: infer _DatabaseUserAttributes;
}
  ? _DatabaseUserAttributes
  : {};

export type RegisteredDatabaseSessionAttributes = Register extends {
  DatabaseSessionAttributes: infer _DatabaseSessionAttributes;
}
  ? _DatabaseSessionAttributes
  : {};
