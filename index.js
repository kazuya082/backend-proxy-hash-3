// 🚨 Nonaktifkan TLS verification (gunakan hanya untuk testing!)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// 🟢 Root endpoint untuk test
app.get('/', (req, res) => {
    res.send('✅ Proxy Server is running on Railway!');
    console.log(process.env.ABUSEIPDB_KEY);
    console.log(process.env.HA_API_KEY);
});

// 🔍 Hybrid Analysis - Search by hash
app.get('/ha/search', async (req, res) => {
    const { hash } = req.query;
    if (!hash) return res.status(400).json({ error: "Missing hash parameter" });

    try {
        const response = await fetch(`https://www.hybrid-analysis.com/api/v2/search/hash?hash=${hash}`, {
            headers: {
                'api-key': process.env.HA_API_KEY,
                'User-Agent': 'Falcon Sandbox'
            }
        });

        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📄 Hybrid Analysis - Summary by ID
app.get('/ha/summary/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const response = await fetch(`https://www.hybrid-analysis.com/api/v2/report/${id}/summary`, {
            headers: {
                'api-key': process.env.HA_API_KEY,
                'User-Agent': 'Falcon Sandbox'
            }
        });

        const text = await response.text();
        res.setHeader('Content-Type', 'application/json');
        res.send(text);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔐 AbuseIPDB - Check IP
app.get('/abuseipdb', async (req, res) => {
    const { ip } = req.query;
    if (!ip) return res.status(400).json({ error: "Missing ip parameter" });

    try {
        const response = await fetch(`https://api.abuseipdb.com/api/v2/check?ipAddress=${ip}&verbose`, {
            headers: {
                'Key': process.env.ABUSEIPDB_KEY,
                'Accept': 'application/json'
            }
        });

        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Proxy server running on port ${PORT}`);
});
