UPDATE payment_settings
SET paystack_qr_url = 'https://i.postimg.cc/BnMcnsrT/Paystack-QR.jpg'
WHERE id = 1
  AND (paystack_qr_url IS NULL OR paystack_qr_url = '');

UPDATE payment_settings
SET paystack_payment_link = 'https://paystack.com/buy/medinnovate-20-dhnwdw'
WHERE id = 1
  AND (paystack_payment_link IS NULL OR paystack_payment_link = '');
