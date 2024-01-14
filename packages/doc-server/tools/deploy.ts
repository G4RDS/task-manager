#!/usr/bin/env zx

import { $, cd } from 'zx';

const cwd = await $`pwd`;
if (!cwd.toString().trim().endsWith('/packages/doc-server')) {
  throw new Error('Run from the doc-server directory');
}

await cd('../..');
await $`docker build -f packages/doc-server/Dockerfile --platform linux/amd64 -t asia-northeast1-docker.pkg.dev/g4rds-task-manager/g4rds-task-manager-repo/doc-server:latest .`;
await $`docker push asia-northeast1-docker.pkg.dev/g4rds-task-manager/g4rds-task-manager-repo/doc-server:latest`;
await $`gcloud run deploy doc-server --image asia-northeast1-docker.pkg.dev/g4rds-task-manager/g4rds-task-manager-repo/doc-server:latest`;
