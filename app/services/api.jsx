const api = {
    getFXRates: () => {
        return fetch('https://openexchangerates.org/api/latest.json?app_id=cfb68785207144bca524a42f4c4794a2')
            .then(res => res.json())
            .then(res => res.rates)
            .catch(err => {
                throw err;
            });
    }
};

export default api;
