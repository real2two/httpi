import env from '@/env';

import cluster from 'cluster';
import { cpus } from 'os';

// Sets the worker file to worker.ts
cluster.setupPrimary({
  exec: 'src/http/listen.ts',
});

// When the cluster crashes, it creates a new cluster.
cluster.on('exit', (worker) => {
  console.log(`#${worker.process.pid} The worker died.`);
  createCluster();
});

// Spawn in clusters.
const clusterCount = env.WebsiteClusters || cpus().length;
for (let i = 0; i < clusterCount; ++i) {
  createCluster();
}

/**
 * Create a cluster
 */
function createCluster() {
  const worker = cluster.fork();
  console.log(`#${worker.process.pid} A worker has spawned.`);
}
