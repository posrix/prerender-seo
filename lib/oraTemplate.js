module.exports = (status, file) =>
    status && file ? `Prerendering ${file} [${status}]` : 'Prerendering Files';
