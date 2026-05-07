#!/usr/bin/env node
"use strict";
// file_commits.js
// Commit each changed file individually and push to remote.
// Usage: node file_commits.js [--no-push] [--msg-template="[${file}]"]
// The commit message will default to the file name if not provided.

const { execSync } = require('child_process');
const path = require('path');

function exec(cmd) {
  return execSync(cmd, { encoding: 'utf8' }).trim();
}

function run() {
  const args = process.argv.slice(2);
  const noPush = args.includes('--no-push');
  const templateIdx = args.findIndex(a => a.startsWith('--msg-template='));
  const template = templateIdx >= 0 ? args[templateIdx].split('=')[1] : '[${file}]';

  // Get modified files (not staged yet)
  const diffFiles = exec('git diff --name-only').split('\n').filter(Boolean);
  if (diffFiles.length === 0) {
    console.log('No changes to commit.');
    return;
  }

  // Get staged files to avoid double adding
  const staged = exec('git diff --cached --name-only').split('\n').filter(Boolean);

  const toCommit = diffFiles.filter(f => !staged.includes(f));
  if (toCommit.length === 0) {
    console.log('All changed files are already staged. Ready to commit.');
  }

  toCommit.forEach(file => {
    exec(`git add ${file}`);
    const msg = template.replace('${file}', file);
    exec(`git commit -m "${msg}"`);
    console.log(`Committed ${file}`);
  });

  if (!noPush) {
    const remote = exec('git remote -v | head -n1 | awk \'{print $1}\'');
    const branch = exec('git rev-parse --abbrev-ref HEAD') || 'main';
    exec(`git push ${remote} ${branch}`);
    console.log('Pushed to', remote, branch);
  } else {
    console.log('Push skipped.');
  }
}
run();
