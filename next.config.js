module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/ws',
        destination: 'http://localhost:3001/ws',
      },
    ]
  },
};
