const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment', // One-time payment (Lifetime PRO access)
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'SaaS Dash PRO - Lifetime Access 🚀',
                            description: 'Unlock advanced analytics, custom branding, and premium support.',
                        },
                        unit_amount: 9900, // 9900 cents = $99.00
                    },
                    quantity: 1,
                },
            ],
       
            success_url: 'http://localhost:5173/dashboard?payment=success',
            cancel_url: 'http://localhost:5173/dashboard?payment=cancel',
        });
        res.status(200).json({ url: session.url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createCheckoutSession };