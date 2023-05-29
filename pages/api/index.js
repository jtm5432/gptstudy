// pages/api/index.js

export default function handler(req, res) {
    if (req.method === 'GET') {
      res.status(200).json({ message: 'Hello from API!' });
    } else {
      res.setHeader('Allow', 'GET');
      res.status(405).end('Method Not Allowed');
    }
  }
  