const mongoose = require('mongoose');
const { Schema } = mongoose;

const customerSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  name: String,
  username: String,
  firstName: String,
  lastName:String,
  address: {
    postalCode: Number,
    city: String,
  },
  profile: {
    firstName: String,
    lastName: String,
  },
  companyName: String,
  id: Number,
  orders: [
    {
      createdAt: { type: Date, default: Date.now },
      orderId: Number,
      customerId: Number,
    },
  ],
  email: String,
  guid: String,
}, { collection: 'customers' });

export const customer = mongoose.model('Customer', customerSchema);