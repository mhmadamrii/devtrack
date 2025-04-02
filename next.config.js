/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import './src/env.js';

const config = {
  experimental: {
    reactCompiler: true,
  },
};

export default config;
