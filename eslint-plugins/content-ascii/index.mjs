import onlyAscii from './only-ascii.mjs';

/** @type {import('eslint').ESLint.Plugin} */
export default {
	rules: {
		'only-ascii': onlyAscii
	}
};
