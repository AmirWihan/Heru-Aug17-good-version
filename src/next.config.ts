import type {NextConfig} from 'next';
import CopyPlugin from 'copy-webpack-plugin';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
   webpack: (config) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs',
            to: 'static/chunks/pdf.worker.min.mjs',
          },
        ],
      }),
    );

    return config;
  },
};

export default nextConfig;
