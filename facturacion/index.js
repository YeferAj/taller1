const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON in requests

const sales = [
    { id: 1, invoiceNumber: 'FAC001', unitsSold: 10, customerName: 'Juana de Arco', totalValue: 500 },
    { id: 2, invoiceNumber: 'FAC002', unitsSold: 5, customerName: 'Policarpa Salavarrieta', totalValue: 250 },
    { id: 3, invoiceNumber: 'FAC003', unitsSold: 20, customerName: 'Tutankamon', totalValue: 1000 },
    { id: 4, invoiceNumber: 'FAC004', unitsSold: 7, customerName: 'Sócrates', totalValue: 350 },
    { id: 5, invoiceNumber: 'FAC005', unitsSold: 12, customerName: 'Simón Bolivar', totalValue: 600 }
];

// 1. GET method to calculate and return the total number of units sold
app.get('/total-unidades', (req, res) => {
    const totalUnits = sales.reduce((sum, sale) => sum + sale.unitsSold, 0);
    res.json({ totalUnits: `El número total de unidades vendidas es: ${totalUnits}` });
});

// 2. GET method to calculate and return the total invoiced value
app.get('/valor-total', (req, res) => {
    const totalValue = sales.reduce((sum, sale) => sum + sale.totalValue, 0);
    res.json({ totalValue: `El valor total facturado es: $${totalValue}` });
});

// 3. GET method to return the details of a specific invoice by ID
app.get('/factura/:id', (req, res) => {
    const invoice = sales.find(sale => sale.id === parseInt(req.params.id));
    if (invoice) {
        res.json(invoice);
    } else {
        res.status(404).json({ message: 'Factura no encontrada' });
    }
});

// 4. GET method to return the ID and customer name for all invoices
app.get('/facturas-clientes', (req, res) => {
    const customerInvoices = sales.map(sale => ({
        id: sale.id,
        customerName: sale.customerName
    }));
    res.json(customerInvoices);
});

// 5. POST method to insert a new invoice
app.post('/factura', (req, res) => {
    const newInvoice = req.body;
    newInvoice.id = sales.length + 1; // Assign incremental ID
    sales.push(newInvoice);
    res.status(201).json(newInvoice);
});

// 6. PUT method to apply a percentage decrement to the total value of all invoices
app.put('/facturas/decremento', (req, res) => {
    const percentage = parseFloat(req.body.percentage);
    if (percentage >= 1 && percentage <= 10) {
        sales.forEach(sale => {
            sale.totalValue -= sale.totalValue * (percentage / 100);
        });
        res.json({ message: `Todas las facturas actualizadas con un ${percentage}% de decremento`, sales });
    } else {
        res.status(400).json({ message: 'El porcentaje debe estar entre 1 y 10' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
