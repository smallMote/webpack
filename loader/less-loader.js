const less = require('less');
// 将less转换成css
function loader(source) {
  let css = '';
  less.render(source, (err, c) => {
    css = c.css;
  });
  css = css.replace(/\n/g, '\\n');
  return css;
}

module.exports = loader;