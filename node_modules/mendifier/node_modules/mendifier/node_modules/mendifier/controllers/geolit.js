const geoip = require('geoip-lite');

exports.checkCountry = (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const geo = geoip.lookup(ip);

    const blacklistedCountries = ['NG', 'GH']; // Example blacklist
    if (blacklistedCountries.includes(geo?.country)) {
        return res.status(403).json({ error: 'Access restricted in your country' });
    }
    next();
};
