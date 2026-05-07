---
name: Git File Commits
description: Command that adds, commits, and pushes each changed file separately, with a commit message based on the file name. Show a tutorial for small projects.
compatibility: []
---

## Usage in Chat
Send the skill name to invoke and it will run the script. The script will commit each modified file individually and push to origin. The commit message defaults to `Add <filename>`.

```
git-file-commits
```

The skill uses the `scripts/git_file_commits.js` script bundled with the skill.

## Example
If your workspace has `index.js` modified, the skill will:

1. `git add index.js`
2. `git commit -m "Add index.js"`
3. Push the commit.

After running, you can view the commit log to confirm.
