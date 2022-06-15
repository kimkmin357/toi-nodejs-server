// TODO. mode 에 따른 config option 설정

console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === "production") {
  module.exports = require('./production');
} else {
  module.exports = require('./development');
}