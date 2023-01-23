const express = require('express');
const cors = require('cors');
const env = require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_KEY);
const app = express();
const YOUR_DOMAIN = 'YOUR FRONTEND DOMAIN';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.post('/create-checkout-session', async (req, res) => {
	console.log('REQUEST', req.body);

	const session = await stripe.checkout.sessions.craete({
		payment_method_types: ['cards'],
		line_items: [
			{
				name: req.body.name,
				images: req.body.images,
				description: req.body.description,
				amount: req.body.price,
				currency: 'usd',
				quantity: 1,
			},
		],
		mode: 'payment',
		success_url: `${YOUR_DOMAIN}/success.html`,
		cancel_url: `${YOUR_DOMAIN}/cancel.html`,
	});
	res.json({ id: session.id });
});

app.listen(4242, () => console.log('Running on port 4242'));