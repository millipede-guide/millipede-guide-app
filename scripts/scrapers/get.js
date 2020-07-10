import axios from 'axios';

axios.defaults.headers.common['User-Agent'] = 'millipede.app / v1.0 https://millipede.app';

export default (url) => {
    return new Promise((resolve) => {
        axios
            .get(url)
            .then(function (response) {
                if (response.status >= 200 && response.status < 300) {
                    resolve(response.data);
                } else {
                    console.log('RESPONSE', response.status);
                    resolve(null);
                }
            })
            .catch(function (error) {
                console.log('ERROR', error);
                resolve(null);
            });
    });
};
