import mongoose from 'mongoose'

const CustomerSchema = new mongoose.Schema({
    customer_id: String,
    name: String,
    email: String,
    subscription: String,
    paid_status: String,
    date_updated: String
})

const Customer = mongoose.models.customer || mongoose.model('customer', CustomerSchema)

export default Customer
// module.exports = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema)