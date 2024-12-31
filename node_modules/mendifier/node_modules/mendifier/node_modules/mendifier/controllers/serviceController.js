const Provider = require('../models/Provider');

exports.searchServices = async (req, res) => {
    try {
        const { type } = req.query; // Get service type from query params
        const providers = await Provider.find({ serviceType: type });
        res.status(200).json(providers);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching services' });
    }
};
