const CLIENT_ID = 'sp_id_cb7103ee1b39a4e7e6409a97c69c4e8b';
const CLIENT_SECRET = 'sp_sk_cee022063fb75ff1dd6a1e09bd959d39';

async function getToken() {
  const res = await fetch('https://api.sendpulse.com/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });
  const data = await res.json();
  return data.access_token;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { email, listId } = req.body || {};
  if (!email || !listId) return res.status(400).json({ error: 'Missing email or listId' });

  const token = await getToken();

  await fetch(`https://api.sendpulse.com/addressbooks/${listId}/emails`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ emails: [{ email }] }),
  });

  res.status(200).json({ ok: true });
}
