
    // request Axios
    const axios = require('axios');

    axios.get('https://app.scrapingbee.com/api/v1', {
        params: {
            'api_key': '89PM6KI706OG031RL625WFH791HTXYEY06KNJT8E7FQ930R7FIAEHAAAV74EGI2MG2UIM5DD7EOB5VHO',
            'url': 'https://www.scrapingbee.com/blog',
            'extract_rules': '{"text":"body"}',
        }
    }).then(function (response) {
        console.log(response);
    })
    