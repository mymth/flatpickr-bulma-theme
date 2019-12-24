#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const { spawn } = require('child_process');

const argv = require('minimist')(process.argv.slice(2), {
  string: ['srcDir', 'destDir', 'compileOpts', 'minifyOpts'],
  boolean: ['minify', 'plugin'],
  alias: {m: 'minify', p: 'plugin'},
  default: {
    srcDir: 'src/plugins',
    destDir: 'dist/plugins',
    compileOpts: '--no-map',
  },
});

const runCmd = (cmd, args, outOnData = undefined, errOndata = undefined) => {
  if (typeof outOnData != 'function') {
    outOnData = (data) => {
      console.log(data.toString());
    };
  }
  if (typeof errOndata != 'function') {
    errOndata = (data) => {
      console.error(data.toString());
    };
  }

  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args);

    proc.stdout.on('data', outOnData);
    proc.stderr.on('data', errOndata);

    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject();
      }
    });
  });
};

const addOption = (cmd, opt) => {
  cmd.push(opt);
  return cmd;
};

const build = (src, dest) => {
  const compileCmd = ['postcss', src];
  if (argv.compileOpts) {
    argv.compileOpts.split(/\s+/).reduce(addOption, compileCmd);
  }

  const fdDest = fs.openSync(dest, 'w');
  const writeCss = (data) => {
    fs.writeSync(fdDest, data);
  };

  console.info(`\n> ${compileCmd.join(' ')} > ${dest}`);
  return runCmd('npx', compileCmd, writeCss)
    .then(
      () => {
        fs.closeSync(fdDest);
        if (!argv.minify) {
          return;
        }

        const minifyCmd = ['csso'];
        if (argv.minifyOpts) {
          argv.minifyOpts.split(/\s+/).reduce(addOption, minifyCmd);
        }
        minifyCmd.push(dest);
        minifyCmd.push('--output');
        minifyCmd.push(dest.replace(/(\.\w+)$/, '.min$1'));

        console.info(`\n> ${minifyCmd.join(' ')}`);
        return runCmd('npx', minifyCmd);
      },
      () => {
        fs.closeSync(fdDest);
      }
    )
    .catch((err) => {
      console.error(err);
    });
};

const checkSrcPath = (src) => {
  if (fs.existsSync(src)) {
    return;
  }
  console.error(`Error: ${src} does not exist.\n`);
  process.exit(1);
};

const startPluginMode = () => {
  let plugins;
  if (argv._.length) {
    plugins = argv._;
  } else {
    plugins = fs.readdirSync(argv.srcDir, {withFileTypes: true})
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
  }

  const files = plugins.map((plugin) => {
    const src = `${argv.srcDir}/${plugin}/index.scss`;
    const dest = `${argv.destDir}/${plugin}.css`;

    checkSrcPath(src);
    return [src, dest];
  });

  if (!fs.existsSync(argv.destDir)) {
    fs.mkdirSync(argv.destDir, {recursive: true});
  }
  return Promise.all(files.map(args => build(...args)));
};

const startNormalMode = () => {
  if (argv._.length < 2) {
    console.error('Error: Missing source and/or destination file path(s)\n');
    process.exit(1);
  }
  checkSrcPath(argv._[0]);
  return build(...argv._.slice(0, 2));
};

const task = argv.plugin ? startPluginMode() : startNormalMode();
task.then(() => {
  console.log();
});
