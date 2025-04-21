const { stripePayment, stripePaymentSuccess } = require('../Controllers/payments/stripe/stripe.controller');
const { createCryptoPayment, handleCryptoWebhook, checkCryptoPaymentStatus } = require('../Controllers/payments/crypto/crypto.controller');

// Stripe payment routes
router.post('/stripe', stripePayment);
router.get('/success', stripePaymentSuccess);

// Crypto payment routes
router.post('/crypto', createCryptoPayment);
router.post('/crypto/webhook', handleCryptoWebhook);
router.get('/crypto/status/:chargeId', checkCryptoPaymentStatus); 