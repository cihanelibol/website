// Only preloaded by isolated-build.mjs; never used by normal development/production.
/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS Node preload runs before ESM initialization. */
const deny = () => { throw new Error('Outbound network is disabled during isolated build'); };
globalThis.fetch = deny;
require('node:http').request = deny;
require('node:http').get = deny;
require('node:https').request = deny;
require('node:https').get = deny;
