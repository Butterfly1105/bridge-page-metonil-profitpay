const PROFITPAY_API_KEY = '11924-89d16e6f1eb0b1233651c683aaa3758b';
const PROFITPAY_ENDPOINT = `https://my.profitpay.one/api/wm/push.json?id=${PROFITPAY_API_KEY}`;
const FLOW_ID = '20829';
const OFFER_ID = '408';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const {
    name, phone, gclid,
    utm_source, utm_campaign, utm_content, utm_term, utm_medium,
  } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ success: false, error: 'Nome e telefone são obrigatórios' });
  }

  // Auto-adiciona código do país (48) se número polonês de 9 dígitos
  let normalizedPhone = phone.replace(/\D/g, '');
  if (normalizedPhone.length === 9) {
    normalizedPhone = '48' + normalizedPhone;
  }

  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    '127.0.0.1';

  const payload = new URLSearchParams({
    flow:         FLOW_ID,
    offer:        OFFER_ID,
    ip:           ip,
    name:         name,
    phone:        normalizedPhone,
    utm_source:   utm_source  || 'google',
    utm_campaign: utm_campaign || 'metonil-pl',
    utm_content:  utm_content  || '',
    utm_term:     utm_term     || '',
    utm_medium:   utm_medium   || 'cpc',
    subid:        gclid        || '',
    country:      'PL',
    mobile:       '1',
  });

  try {
    const ppResponse = await fetch(PROFITPAY_ENDPOINT, {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    payload.toString(),
    });

    const ppData = await ppResponse.json();

    if (ppData.status === 'ok') {
      return res.status(200).json({ success: true, id: ppData.id });
    } else {
      console.error('[ProfitPay Error]', ppData);
      return res.status(200).json({ success: false, error: ppData.error, message: ppData.message });
    }
  } catch (err) {
    console.error('[Submit Error]', err);
    return res.status(500).json({ success: false, error: 'server_error' });
  }
}
