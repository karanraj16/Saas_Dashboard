const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    user: { type: String, required: true }, // Ithu client/company name
    amount: { type: Number, required: true },
    status: { type: String, required: true },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Transaction', transactionSchema);