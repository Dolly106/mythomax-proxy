const axios = require('axios');

const OPENROUTER_API_BASE = 'https://openrouter.ai/api/v1';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  const path = req.url.split('?')[0];

  if (path === '/api/health') {
    return res.json({
      status: 'ok',
      service: 'MythoMax Proxy',
      model: 'gryphe/mythomax-l2-13b'
    });
  }

  if (path === '/api/v1/chat/completions') {
    try {
      const { messages, temperature = 0.7, max_tokens = 2048 } = req.body;

      const response = await axios.post(
        `${OPENROUTER_API_BASE}/chat/completions`,
        {
          model: 'gryphe/mythomax-l2-13b',
          messages,
          temperature,
          max_tokens
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://mythomax-proxy.vercel.app',
            'X-Title': 'MythoMax RP Proxy'
          }
        }
      );

      return res.json(response.data);
    } catch (error) {
      return res.status(500).json({ error: { message: error.message } });
    }
  }

  return res.status(404).json({ error: { message: 'Not found' } });
};
