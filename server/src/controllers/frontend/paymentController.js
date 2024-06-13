const stripe = require('stripe')('sk_test_8yTMfGjWta7zVzyhB6S3N2ws');
const Payment = require('../../models/Payment');
const Receipt = require('../../models/Receipt');
const User = require('../../models/Users');

const paymentController = {
	createCheckoutSession: async (req, res) => {
		const { price, userId, currency } = req.body;
		try {
			const user = await User.findById(userId);
			const session = await stripe.checkout.sessions.create({
				payment_method_types: ['card'],
				payment_method_options: {
					card: {
						request_three_d_secure: 'any'
					}
				},
				line_items: [
					{
						price_data: {
							currency: currency,
							product_data: {
								name: 'Custom Payment'
							},
							unit_amount: price * 100
						},
						quantity: 1
					}
				],
				mode: 'payment',
				customer_email: user.email,
				success_url: `${req.headers.origin}/en/payment/success?payment_id={CHECKOUT_SESSION_ID}`,
				cancel_url: `${req.headers.origin}/en/payment/failed?payment_id={CHECKOUT_SESSION_ID}`
			});

			const payment = new Payment({
				user: userId,
				amount: price,
				paymentMethod: 'stripe',
				currency: currency,
				transactionId: session.id,
				status: 'success'
			});
			await payment.save();

			const receipt = new Receipt({
				userId: userId,
				// brandId: brandId,
				dueDate: new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
				amount: price
			});

			await receipt.save();

			res.json({ id: session.id });
		} catch (error) {
			res.status(500).json({ error: 'Error creating checkout session' });
		}
	}
};

module.exports = paymentController;
