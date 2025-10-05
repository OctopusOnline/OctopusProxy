#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const rootDir = process.cwd();

const serverPackagePath = path.join(rootDir, 'packages/server/package.json');
const serverImageDir = path.join(rootDir, 'images/server/src');
const serverImagePackagePath = path.join(serverImageDir, 'package.json');
const serverImageLockPath = path.join(serverImageDir, 'package-lock.json');

const serverPackage = JSON.parse(fs.readFileSync(serverPackagePath, 'utf8'));
const serverImagePackage = JSON.parse(fs.readFileSync(serverImagePackagePath, 'utf8'));

const newServerVersion = serverPackage.version;
const oldServerVersion = serverImagePackage.dependencies['@octopusproxy/server'];
const serverNeedsUpdate = newServerVersion !== oldServerVersion;

if (!serverNeedsUpdate) {
    console.log('No version change detected for @octopusproxy/server.');
    process.exit(0);
}

console.log(`Updating server image dependency to v${newServerVersion}`);
serverImagePackage.dependencies['@octopusproxy/server'] = newServerVersion;
fs.writeFileSync(serverImagePackagePath, JSON.stringify(serverImagePackage, null, 2) + '\n', 'utf8');

console.log('Running npm install in image directory...');
process.chdir(serverImageDir);
execSync('npm cache clean --force', { stdio: 'inherit' });
execSync('npm install', { stdio: 'inherit' });
process.chdir(rootDir);

const filesToCommit = [serverImagePackagePath, serverImageLockPath];

const diff = execSync(`git diff --name-only ${filesToCommit.join(' ')}`).toString().trim();
if (!diff) {
    console.log('No changes to commit after npm install.');
    process.exit(0);
}

console.log('Committing and pushing changes...');
execSync(`git add ${filesToCommit.join(' ')}`);
const commitMessage = `build(image): update server image to v${newServerVersion}`;
execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
execSync('git push', { stdio: 'inherit' });

console.log('Successfully updated, committed, and pushed the server image changes.');
