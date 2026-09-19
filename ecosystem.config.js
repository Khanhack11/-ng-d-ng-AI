module.exports = {
  apps: [
    {
      name: 'ecommerce-backend',
      script: './backend/server.js',
      instances: 'max', // Or a specific number like 2 for cluster mode
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      }
    }
  ]
};
