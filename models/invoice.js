var mongoose = require('mongoose');
var Schema = mongoose.Schema;
SaleSchema = new Schema({
    "Invoice ID": String,
    "Branch": String,
    "City": String,
    "Customer type": String,
    "Product line": String,
    "name": String,
    "image": String,
    "Unit price": Number,
    "Quantity": Number,
    "Tax 5%": Number,
    "Total": Number,
    "Date": Date,
    "Time": String,
    "Payment": String,
    "cogs": Number,
    "gross income": Number,
    "Rating": Number
});
module.exports = mongoose.model('Sale', SaleSchema);