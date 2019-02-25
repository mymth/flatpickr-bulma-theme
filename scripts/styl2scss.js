#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const Inflector = require('inflected');

const argv = require('minimist')(process.argv.slice(2), {
  string: ['inDir', 'outDir'],
  default: {outDir: 'src/raw'},
});

const flatpickrStyleDir = 'node_modules/flatpickr/src/style';
const outDir = argv.outDir;
let files;

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, {recursive: true});
}

if (argv._.length) {
  if (argv.inDir) {
    files = argv._.map(file => file.indexOf('/') < 0 ? file : path.join(argv.inDir, file));
  } else {
    files = argv._;
  }
} else {
  files = [
    `${flatpickrStyleDir}/_vars.styl`,
    `${flatpickrStyleDir}/flatpickr.styl`,
  ];
}

const conversions = [
  (line) => {
    const parts = line.match(/^(\s+)(.+)$/);
    return parts
      ? parts[1] + parts[2].replace(/\s+/g, ' ')
      : line;
  },
  (line) => {
    const re = /@require ['"](.+)['"];?$/;
    const matches = line.match(re);
    if (!matches) {
      return line;
    }
    const dirname = path.dirname(matches[1]);
    const basename = path.basename(matches[1], '.styl').replace(/^_/, '');
    return line.replace(re, `@import '${dirname}/${basename}';`);
  },
  (line) => line.replace(/([^\S@])(if[^(])/, '$1@$2'),
  (line) => line.replace(/([^\S@])(else (if)?)/, '$1@$2'),
  (line) => line.replace(/alpha(\([^,]+, *0?\.\d+\))/, 'rgba$1'),
  // variable handling
  (line) => {
    const matches = line.match(/\$[a-z]+[A-Z_][A-Za-z0-9_-]*/g);
    if (!matches) {
      return line;
    }
    return matches.reduce((newLine, varName) => {
      const newVarName = Inflector.dasherize(Inflector.constantify(varName).toLowerCase());
      return newLine.replace(varName, newVarName);
    }, line);
  },
  (line) => line.replace(/^(\s*\$[a-z0-9_-]+) += +(.+)$/, '$1: $2;'),
  (line) => line.replace(/^(\s*\$[a-z0-9_-]+) +\?= +(.+)$/, '$1: $2 !default;'),
  (line) => line.replace(/\$([a-z0-9-]+) is defined/, 'variable-exists(\'$1\')'),
  // colon, semi-colon insertion
  (line) => line.replace(/^(\s*[a-z-]{3,}) (.*[^{])$/, '$1: $2'),
  (line) => line.replace(/^(\s*.+[^{,;])$/, '$1;'),
  (line) => line.replace(/(\s*\/\/.*);$/, ';$1'),
  // optimization
  (line) => line.replace(/( {2,}|, ?)& +([.#+>:A-Za-z])/g, '$1$2'),
  (line) => line.replace(/([^:]):(before|after)/g, '$1::$2'),
  (line) => line.replace(/([\s(]0)[a-z]+([\s,;)])/g, '$1$2'),
  (line) => line.replace(/(border): none;/g, '$1: 0;'),
  (line) => {
    const matches = line.match(/#[A-Fa-f0-9]{3,6}/g);
    return matches
      ? matches.reduce((newLine, hexColor) => newLine.replace(hexColor, hexColor.toLowerCase()), line)
      : line;
  },
  (line) => line.replace(/"/g, '\''),
];

const applyConv = (line, convList) => {
  if (!convList.length || line.match(/^\s*\/{2}/)) {
    return line;
  }

  const wkConvList = convList.slice(0);
  const conv = wkConvList.shift();

  return applyConv(conv(line), wkConvList);
};

const convertToScss = (inFile) => {
  const stylFileName = path.basename(inFile);
  const scssFileName = stylFileName.replace(/\.styl$/, '.base.scss');
  const outFile = path.join(outDir, scssFileName);

  const output = [];
  const indentLevels = [];

  let prevLine;
  let indentLevel = 0;

  const addOutput = (line, convList = undefined) => {
    output.push(convList ? applyConv(line, convList) : line);
  };

  const closing = (indent) => {
    while (indentLevels.length) {
      if (indentLevels[indentLevels.length - 1] < indent) {
        break;
      }
      indentLevel = indentLevels.pop();
      addOutput('}'.padStart(indentLevel + 1, ' '));
    }
  };

  const rl = readline.createInterface({
    input: fs.createReadStream(inFile),
    crlfDelay: Infinity
  });

  rl.on('line', (line) => {
    if (prevLine === undefined) {
      prevLine = line;
      return;
    }
    // skip continuous blank lines
    if (!line && !prevLine) {
      return;
    }

    const indent = line.match(/^( *).*$/)[1].length;

    if (line) {
      if (prevLine) {
        if (indent > indentLevel && !prevLine.match(/,\s*$/)) {
          // opening
          prevLine += ' {';
          indentLevels.push(indentLevel);
          indentLevel = indent;
        } else if (indent < indentLevel) {
          addOutput(prevLine, conversions);
          closing(indent);
          prevLine = line;
          return;
        }
      } else if (indent != indentLevel) {
        closing(indent);
      }
    }

    addOutput(prevLine, conversions);
    prevLine = line;
  });

  rl.on('close', () => {
    addOutput(prevLine, conversions);
    closing(0);

    fs.writeFileSync(outFile, output.join('\n'), 'utf8');
  });
};

files.forEach(convertToScss);
