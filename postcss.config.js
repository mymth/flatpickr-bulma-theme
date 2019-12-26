module.exports = {
  plugins: [
    require('postcss-node-sass')({
      outputStyle: 'expanded',
    }),
    require('css-declaration-sorter')({
        order: 'concentric-css',
    }),
    require('autoprefixer'),
  ],
};
