import type {PrismTheme} from 'prism-react-renderer';

// CSS variables let code highlighting follow the same palette as the page.
const codeTheme: PrismTheme = {
  plain: {color: 'var(--site-text)', backgroundColor: 'var(--site-code-background)'},
  styles: [
    {types: ['comment', 'prolog', 'doctype', 'cdata'], style: {color: 'var(--site-code-comment)'}},
    {types: ['punctuation', 'operator'], style: {color: 'var(--site-text)'}},
    {types: ['keyword', 'atrule'], style: {color: 'var(--site-purple)'}},
    {types: ['string', 'char', 'attr-value', 'inserted', 'selector'], style: {color: 'var(--site-green)'}},
    {types: ['number', 'boolean', 'constant', 'symbol'], style: {color: 'var(--site-orange)'}},
    {types: ['function', 'function-variable'], style: {color: 'var(--site-blue)'}},
    {types: ['class-name', 'builtin'], style: {color: 'var(--site-yellow)'}},
    {types: ['tag', 'property', 'deleted'], style: {color: 'var(--site-red)'}},
    {types: ['attr-name', 'regex', 'variable'], style: {color: 'var(--site-cyan)'}},
    {types: ['important', 'bold'], style: {fontWeight: 'bold'}},
    {types: ['italic'], style: {fontStyle: 'italic'}},
  ],
};

export default codeTheme;
