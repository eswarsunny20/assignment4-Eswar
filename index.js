var express  = require('express');
var mongoose = require('mongoose');
var app      = express();
var database = require('./config/database');
var path = require('path');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
const exphbs = require('express-handlebars');
const hbs = exphbs.create({ extname: '.hbs' });
// Handlebars setup

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));
var port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json


mongoose.connect(database.url);
app.set('views', path.join(__dirname, 'views'));
var Sale = require('./models/invoice');


app.get('/', (req, res) => {
    res.render('home');
});

app.get('/api/sales', async (req, res) => {
    try {
        const sales = await Sale.find();
        res.render('invoice', { title: 'Sales Page', sales }); // Render 'sales.hbs' passing sales data
    } catch (err) {
        console.error(err); // Log the error for debugging purposes
        res.status(500).send('Error retrieving sales data');
    }
});


// Route to search for sales records by product line
app.get('/api/sales/searchProductLine', async (req, res) => {
    try {
        const { productLine } = req.query;

        // Find sales records matching the provided product line
        const searchResults = await Sale.find({ "Product line": productLine });

        res.render('results', { sales: searchResults, searchQuery: productLine });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error searching sales records by product line');
    }
});






// Route to render the form for adding a new invoice
app.get('/api/sales/new', (req, res) => {
    console.log('Reached /api/sales/new route');
    res.render('new'); // Render a form for adding a new invoice in 'invoice.hbs'
});

// Route to handle the submission of a new invoice
app.post('/api/sales/new', async (req, res) => {
    try {
        // Retrieve the data from the form submission
        const {
            invoiceId,
            branch,
            city,
            customerType,
            productLine,
            name,
            image,
            unitPrice,
            quantity,
            tax,
            total,
            date,
            time,
            payment,
            cogs,
            grossIncome,
            rating
            
        } = req.body;

        // Create a new Sale instance with the submitted data
        const newSale = new Sale({
            "Invoice ID": invoiceId,
            "Branch": branch,
            "City": city,
            "Customer type": customerType,
            "Product line": productLine,
            "name": name,
            "image": image,
            "Unit price": unitPrice,
            "Quantity": quantity,
            "Tax 5%": tax,
            "Total": total,
            "Date": date,
            "Time": time,
            "Payment": payment,
            "cogs": cogs,
            "gross income": grossIncome,
            "Rating": rating
            
        });

        // Save the new invoice to the database
        await newSale.save();

        res.redirect('/api/sales'); // Redirect to the list of all sales after adding the new invoice
    } catch (err) {
        console.error(err); // Log the error for debugging purposes
        res.status(500).send('Error adding a new invoice');
    }
});

// Get a sales record by ID
app.get('/api/sales/:invoiceId', async (req, res) => {
    try {
        const invoiceId = req.params.invoiceId;

        // Find the sale data by matching Invoice ID
        const sale = await Sale.findOne({ "Invoice ID": invoiceId });

        if (!sale) {
            return res.status(404).send("Sale not found");
        }

        res.render('sales', { sales: [sale] }); // Render 'sales.hbs' passing matched sale data as an array
    } catch (err) {
        console.error(err); // Log the error for debugging purposes
        res.status(500).send('Error retrieving sales data');
    }
});



// Route to insert a new invoice
app.post('/api/sales', async (req, res) => {
    try {
        const newSale = new Sale(req.body); // Assuming req.body contains the necessary fields for a new Sale

        await newSale.save();

        res.status(201).json({ message: 'Invoice added successfully', newSale });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding a new invoice');
    }
});

// Route to delete an existing invoice by _id or invoiceID
app.delete('/api/sales/:invoiceId', async (req, res) => {
    try {
        const invoiceId = req.params.invoiceId;
        const deletedInvoice = await Sale.findOneAndDelete({ "Invoice ID": invoiceId });

        if (!deletedInvoice) {
            return res.status(404).send("Invoice not found");
        }

        res.json({ message: 'Invoice deleted successfully', deletedInvoice });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting the invoice');
    }
});


// Route to update "Customer type" & "unit price" of an existing invoice by _id or invoiceID
// Route to update an existing invoice by _id or invoiceID using PUT
app.put('/api/sales/:invoiceId', async (req, res) => {
    try {
        const invoiceId = req.params.invoiceId;
        const { customerType, unitPrice } = req.body;

        // Verify if the required fields are present in the request
        if (!customerType || !unitPrice) {
            return res.status(400).send("Please provide both customerType and unitPrice for update");
        }

        const updatedInvoice = await Sale.findOneAndUpdate(
            { "Invoice ID": invoiceId }, // Find by Invoice ID
            { $set: { "Customer type": customerType, "Unit price": unitPrice } }, // Update fields
            { new: true }
        );

        if (!updatedInvoice) {
            return res.status(404).send("Invoice not found");
        }

        return res.json({ message: 'Customer type and Unit price updated successfully', updatedInvoice });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Error updating the invoice');
    }
});





app.listen(port);
console.log("App listening on port : " + port);