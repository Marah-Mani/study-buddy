const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
	cardHolderName: { type: String, required: false },
	amount: { type: Number, required: true },
	currency: { type: String, default: 'usd' },
	paymentMethod: { type: String, enum: ['stripe', 'paypal', 'other'], required: true },
	transactionId: { type: String, required: true },
	status: { type: String, enum: ['pending', 'success', 'failed'], required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model('payment', paymentSchema);

module.exports = Payment;
