const Transaction = require('../models/Transaction');

const getTransactions = async(req,res) => {
    try{
        const trans = await Transaction.find({adminId:req.user._id}).sort({createdAt:-1});
        res.status(201).json(trans);
    }catch(err){
        res.status(500).json({message:err.message})
    }
};

const addTransaction = async(req,res) => {
    try{
        const { user,description, amount, status } = req.body;
        const trans = await Transaction.create({
            adminId: req.user._id, 
            user : user || description || 'New Client',
            amount :Number(amount),
            status : status || 'completed'
        });
        res.status(201).json(trans);
    }catch(err){
        res.status(500).json({message:err.message})
    }
};

const deleteTransaction= async(req,res) => {
    try{
        const transaction = await Transaction.findById(req.params.id);

        if(!transaction){
            res.status(404);
            throw new Error('Transaction not found');
        }
        if(!transaction.adminId ||transaction.adminId.toString() !== req.user._id.toString()){
            res.status(401);
            throw new Error('User not authorized to delete this data');
        }

        await transaction.deleteOne();
        res.status(200).json({ id: req.params.id });
    }catch(e){
        res.status(500).json({ message: e.message });
    }
}
module.exports = { getTransactions,addTransaction,deleteTransaction };