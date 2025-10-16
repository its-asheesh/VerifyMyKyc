import https from 'https';

type GaParams = Record<string, any>;

function postJSON(url: string, data: any): Promise<void> {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const payload = Buffer.from(JSON.stringify(data));
      const req = https.request(
        {
          hostname: u.hostname,
          path: u.pathname + u.search,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': payload.length,
          },
        },
        (res) => {
          // Drain response; we don't need body
          res.on('data', () => {});
          res.on('end', () => resolve());
        }
      );
      req.on('error', () => resolve());
      req.write(payload);
      req.end();
    } catch {
      resolve();
    }
  });
}

export async function sendGaEvent(
  userId: string | undefined,
  name: string,
  params: GaParams = {}
): Promise<void> {
  const measurementId = process.env.GA4_MEASUREMENT_ID;
  const apiSecret = process.env.GA4_API_SECRET;
  if (!measurementId || !apiSecret) return; // silently skip if not configured

  const clientId = `${Date.now()}.${Math.floor(Math.random() * 1e6)}`;
  const body = {
    client_id: clientId,
    ...(userId ? { user_id: String(userId) } : {}),
    events: [
      {
        name,
        params,
      },
    ],
  };

  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`;
  await postJSON(url, body);
}


