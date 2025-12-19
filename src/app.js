const express = require('express');
const cors = require('cors');
const path = require('path');
const mainRouter = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', mainRouter);

app.get('/partials/*', (req, res, next) => {
    const requestedPath = req.path.replace('/partials/', '');
    const filename = requestedPath.split('/').pop();
    
    if (!filename.endsWith('.html')) {
        return res.status(400).send('Invalid file type');
    }
    
    const filePath = path.resolve(__dirname, '..', 'views', 'partials', filename);
    
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('Partial not found');
        }
    });
});

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'views', 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'views', 'partials', 'admin.html'));
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({
        message: err.message || 'Terjadi kesalahan internal pada server.',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

module.exports = app;
