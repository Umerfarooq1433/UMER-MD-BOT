/**
   * Create By ᑌᗰᗴᖇ ᖴᗩᖇOOᑫ.
   * Contact Me On wa.me/923150075526
*/

const fetch = require('node-fetch')
const axios = require("axios");

// Helper function to sleep/delay
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper function to check if string is a URL
const isUrl = (url) => {
    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'gi'))
}

// Get buffer from URL
const getBuffer = async (url, options = {}) => {
    try {
        const res = await axios({
            method: "get",
            url,
            headers: {
                'DNT': 1,
                'Upgrade-Insecure-Request': 1
            },
            ...options,
            responseType: 'arraybuffer'
        })
        return res.data
    } catch (e) {
        console.log(`Error in getBuffer: ${e}`)
    }
}

// Get size of media
const getSizeMedia = (buffer) => {
    return new Promise((resolve, reject) => {
        const size = Buffer.byteLength(buffer)
        if (size >= 1000000000) {
            resolve((size / 1000000000).toFixed(2) + ' GB')
        } else if (size >= 1000000) {
            resolve((size / 1000000).toFixed(2) + ' MB')
        } else if (size >= 1000) {
            resolve((size / 1000).toFixed(2) + ' KB')
        } else {
            resolve(size + ' B')
        }
    })
}

// Generate message tag
const generateMessageTag = () => {
    return `3EB0${Math.floor(Math.random() * 1000000000)}`
}

class Function {
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    runtime(seconds) {
        seconds = Number(seconds);
        var d = Math.floor(seconds / (3600 * 24));
        var h = Math.floor(seconds % (3600 * 24) / 3600);
        var m = Math.floor(seconds % 3600 / 60);
        var s = Math.floor(seconds % 60);
        var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
        var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
        return dDisplay + hDisplay + mDisplay + sDisplay;
    }
    
    async fetchJson(url, options = {}) {
        try {
            let data = await axios(url, {
                method: "get",
                headers: {
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
                    origin: url,
                    referer: url
                },
                responseType: 'json'
            })

            return data?.data
        } catch (e) {
            return e
        }
    }

    getUserName(user) {
        try {
            var last_name = user["last_name"] || ""
            var full_name = user.first_name + " " + last_name
            user["full_name"] = full_name.trim()
            return user
        } catch (e) {
            throw e
        }
    }
    
    isUrl(url) {
        return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'gi'))
    }
    
    range(start, stop, step) {
        if (typeof stop == 'undefined') {
            stop = start;
            start = 0;
        }
        if (typeof step == 'undefined') {
            step = 1;
        }
        if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
            return [];
        }
        var result = [];
        for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
            result.push(i);
        }
        return result;
    }
}

// Export all functions
module.exports = {
    simple: new Function(),
    sleep,
    isUrl,
    getBuffer,
    getSizeMedia,
    generateMessageTag,
    fetch
}
