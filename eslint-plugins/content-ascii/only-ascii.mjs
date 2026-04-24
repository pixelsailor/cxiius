/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require ASCII-only source in $lib/content TypeScript files (no smart quotes, em dashes, emoji, etc.).'
    },
    schema: [],
    messages: {
      nonAscii: 'Non-ASCII character "{{char}}" (U+{{code}}). Use plain ASCII in source files under $lib/content.'
    }
  },
  create(context) {
    const sourceCode = context.sourceCode;
    return {
      Program() {
        const text = sourceCode.getText();
        for (let i = 0; i < text.length; ) {
          const cp = text.codePointAt(i);
          const len = cp > 0xffff ? 2 : 1;
          if (cp > 127) {
            const start = sourceCode.getLocFromIndex(i);
            const end = sourceCode.getLocFromIndex(i + len);
            context.report({
              loc: { start, end },
              messageId: 'nonAscii',
              data: {
                char: String.fromCodePoint(cp),
                code: cp.toString(16).toUpperCase()
              }
            });
          }
          i += len;
        }
      }
    };
  }
};
