const test = require('ava');
const path = require('path');
const fs = require('fs-extra');
const WebappWebpackPlugin = require('../src');

const {logo, generate, mkdir, compare, expected} = require('./util');

test.beforeEach(async t => t.context.root = await mkdir());

test('should correctly handle an empty prefix', async t => {
  const dist = path.join(t.context.root, 'dist');
  const stats=  await generate({
    context: t.context.root,
    output: {
      path: dist,
    },
    plugins: [new WebappWebpackPlugin({logo, prefix: ''})],
  });

  t.deepEqual(await compare(dist, path.resolve(expected, 'unprefixed')), []);
});

test.afterEach(t => fs.remove(t.context.root));
