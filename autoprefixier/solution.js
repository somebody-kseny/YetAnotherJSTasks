// https://coderun.yandex.ru/selections/2024-summer-frontend/problems/autoprefixer

const processed = Symbol('processed');

const processRule = (rule, vendorPrefixes) => {
  if (rule[processed] || !rule.selector.includes('::')) {
    return;
  }

  rule[processed] = true;

  rule.selector
    .split(',')
    .filter(name => name.includes('::'))
    .forEach((name) => {
      const [elem, pseudoElem] = name.split('::');

      const prefixies = vendorPrefixes[`::${pseudoElem}`];

      if (!prefixies) {
        return;
      }

      prefixies.forEach(prefix => {
        const cloned = rule.clone({
          selector: `${elem}::-${prefix}-${pseudoElem}`,
        });
        cloned[processed] = true;

        rule.before(cloned);
      });
    });
};

const declarationsFilterCreator = (vendorPrefixes) => {
  return Object.keys(vendorPrefixes)
    .filter(key => !key.startsWith('::'))
    .reduce((acc, cur) => {
      acc[cur] = (node) => {
        vendorPrefixes[cur].forEach(prefix => {
          node.cloneBefore({ prop: `-${prefix}-${node.prop}` });
        });
      };

      return acc;
    }, {});
};

module.exports = ({ vendorPrefixes } = { vendorPrefixes: {} }) => {
  return {
    postcssPlugin: 'bicycle-autoprefixier',
    Rule: (rule) => processRule(rule, vendorPrefixes),
    Declaration: declarationsFilterCreator(vendorPrefixes),
  }
};

module.exports.postcss = true;
