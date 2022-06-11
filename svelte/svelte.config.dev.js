"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _adapterAuto = _interopRequireDefault(require("@sveltejs/adapter-auto"));

var _sveltePreprocess = _interopRequireDefault(require("svelte-preprocess"));

var _vite = require("vite");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//import { sequence } from '@sveltejs/kit/dist/hooks.js';

/** @type {import('@sveltejs/kit').Config} */
var config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: (0, _sveltePreprocess["default"])(),
  kit: {
    adapter: (0, _adapterAuto["default"])(),
    // Override http methods in the Todo forms
    methodOverride: {
      allowed: ['PATCH', 'DELETE']
    },
    vite: {
      server: {
        fs: {
          allow: ['..', (0, _vite.searchForWorkspaceRoot)(process.cwd()), 'local'],
          deny: []
        },
        fsServe: {
          root: '../'
        }
      }
    }
  }
};
var _default = config;
exports["default"] = _default;