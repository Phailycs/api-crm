import { Schema, model, models } from 'mongoose';

const productsSchema = new Schema({
    createdAt: Date,
    name: String,
    details: {
        price: Number,
        description: String,
        color: String
    },
    stock: Number,
    id: {
        type: Number,
        required: true,
        unique: true,
    }
});

const productsMongo = models.products || model('products', productsSchema);

export default productsMongo;