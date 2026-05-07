#!/usr/bin/env node
"use strict";
const { execSync } = require('child_process');

function exec(cmd) {
  return execSync(cmd, { encoding: 'utf8' }).trim();
}

// Resolve all unstaged and staged but uncommitted changes
const stagedFiles = exec('git diff --cached --name-only').split('\n').filter(Boolean);
const unstagedFiles = exec('git diff --name-only').split('\n').filter(Boolean);
const allFiles = [...new Set([...stagedFiles, ...unstagedFiles])];
if (allFiles.length === 0) {
  console.log('No changes to commit.');
  process.exit(0);
}

allFiles.forEach(file => {
  exec(`git add ${file}`);
  const msg = `Add ${file}`;
  exec(`git commit -m "${msg}"`);
  console.log(`Committed ${file}`);
});

// Push to default remote
const remote = exec('git remote -v | sed -n "1p" | awk \'{print $1}\'');
const branch = exec('git rev-parse --abbrev-ref HEAD') || 'main';
exec(`git push ${remote} ${branch}`);
console.log(`Pushed ${remote}/${branch}`);
