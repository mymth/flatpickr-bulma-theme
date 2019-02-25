module.exports = {
  plugins: [
    require('postcss-node-sass')({
      outputStyle: 'expanded',
    }),
    require('autoprefixer'),
  ],
};
