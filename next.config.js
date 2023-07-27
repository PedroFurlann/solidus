/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'www.github.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
