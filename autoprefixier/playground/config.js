const fs = require('fs');
const postcss = require('postcss');
const autoprefixer = require('../solution.js');

const testVendorPrefixes = {
  'display': ['webkit', 'moz'],
  'border-radius': ['webkit', 'moz', 'ms', 'o'],
  '::placeholder': ['ms-input', 'moz']
};

fs.readFile('input.css', (_, css) => {
  postcss([
    autoprefixer({ vendorPrefixes: testendorPrefixes }),
  ])
    .process(css, { from: 'input.css', to: 'output.css' })
    .then(result => {
      result.warnings().forEach(warn => {
        console.warn(warn.toString())
      });

      fs.writeFile('output.css', result.css, () => true)
    })
});
