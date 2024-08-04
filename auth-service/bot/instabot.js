const axios = require('axios');
const randomInt = require('random-int');
const fs = require('fs');
const path = require('path');
const winston = require('winston');

class InstaBot {
    constructor(login, password, likePerDay = 1000, moreThanLikes = 10, tagList = ['cat', 'car', 'dog'], maxLikeForOneTag = 5, logMod = 0) {
        this.likePerDay = likePerDay;
        this.timeInDay = 24 * 60 * 60;
        this.likeDelay = this.timeInDay / this.likePerDay;
        this.moreThanLikes = moreThanLikes;
        this.tagList = tagList;
        this.maxLikeForOneTag = maxLikeForOneTag;
        this.logMod = logMod;
        this.mediaByTag = [];
        this.loginStatus = false;
        this.likeCounter = 0;
        this.error400 = 0;
        this.error400ToBan = 3;
        this.banSleepTime = 2 * 60 * 60 * 1000; // milliseconds
        this.running = false;
        this.userLogin = login.toLowerCase();
        this.userPassword = password;

        this.url = 'https://www.instagram.com/';
        this.urlTag = 'https://www.instagram.com/explore/tags/';
        this.urlLikes = 'https://www.instagram.com/web/likes/%s/like/';
        this.urlComment = 'https://www.instagram.com/web/comments/%s/add/';
        this.urlFollow = 'https://www.instagram.com/web/friendships/%s/follow/';
        this.urlUnfollow = 'https://www.instagram.com/web/friendships/%s/unfollow/';
        this.urlLogin = 'https://www.instagram.com/accounts/login/ajax/';
        this.urlLogout = 'https://www.instagram.com/accounts/logout/';

        this.userAgent = "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.103 Safari/537.36";
        this.acceptLanguage = 'ru-RU,ru;q=0.8,en-US;q=0.6,en;q=0.4';

        if (this.logMod === 1) {
            this.logFilePath = '/var/www/python/log/';
            this.setupLogger();
        }

        this.login();
    }

    async login() {
        this.writeLog(`Trying to login with ${this.userLogin}...`);

        try {
            const response = await axios.get(this.url, { headers: { 'User-Agent': this.userAgent } });
            const csrftoken = response.headers['set-cookie'].find(cookie => cookie.startsWith('csrftoken')).split(';')[0].split('=')[1];

            await axios.post(this.urlLogin, {
                username: this.userLogin,
                password: this.userPassword
            }, {
                headers: {
                    'X-CSRFToken': csrftoken,
                    'User-Agent': this.userAgent
                }
            });

            const loginCheckResponse = await axios.get(this.url, { headers: { 'X-CSRFToken': csrftoken } });
            if (loginCheckResponse.data.includes(this.userLogin)) {
                this.loginStatus = true;
                this.writeLog(`Login successful with ${this.userLogin}`);
            } else {
                this.loginStatus = false;
                this.writeLog('Login error! Check your login data!');
            }
        } catch (error) {
            this.writeLog('Login error! Connection error!');
            console.error(error);
        }
    }

    async logout() {
        if (this.loginStatus) {
            this.writeLog(`Logging out, likes count: ${this.likeCounter}`);
            try {
                await axios.post(this.urlLogout, null, {
                    headers: {
                        'X-CSRFToken': this.csrftoken
                    }
                });
                this.writeLog('Logout successful!');
                this.loginStatus = false;
            } catch (error) {
                this.writeLog('Logout error!');
                console.error(error);
            }
        }
    }

    async getMediaIdByTag(tag) {
        if (this.loginStatus) {
            this.writeLog(`Getting media ID by tag: ${tag}`);
            try {
                const response = await axios.get(`${this.urlTag}${tag}/`, {
                    headers: {
                        'User-Agent': this.userAgent,
                        'Accept-Language': this.acceptLanguage
                    }
                });
    
                // Extract JSON from the page source using regex
                const match = response.data.match(/<script type="text\/javascript">window\._sharedData = ({.*?});<\/script>/);
                if (match && match[1]) {
                    const jsonString = match[1];
                    try {
                        // Parse JSON
                        const allData = JSON.parse(jsonString);
                        // Extract media nodes from the JSON data
                        this.mediaByTag = allData.entry_data.TagPage[0].tag.media.nodes;
                    } catch (error) {
                        console.error("Failed to parse JSON data:", error);
                        this.mediaByTag = [];
                    }
                } else {
                    console.error("Failed to find _sharedData in the response.");
                    this.mediaByTag = [];
                }
            } catch (error) {
                this.mediaByTag = [];
                this.writeLog('Exception on get_media!');
                console.error(error);
                await this.sleep(60000); // Wait for a minute before retrying
            }
        }
    }

    async likeAllExistMedia(mediaSize = -1) {
        if (this.loginStatus) {
            if (this.mediaByTag.length > 0) {
                for (let i = 0; i < this.mediaByTag.length && (mediaSize > 0 || mediaSize < 0); i++) {
                    if (this.mediaByTag[i].likes.count < this.moreThanLikes) {
                        this.writeLog(`Trying to like media: ${this.mediaByTag[i].id}`);
                        const likeResponse = await this.like(this.mediaByTag[i].id);
                        if (likeResponse.status === 200) {
                            this.error400 = 0;
                            this.likeCounter += 1;
                            this.writeLog(`Liked: ${this.mediaByTag[i].id}. Like #${this.likeCounter}`);
                        } else if (likeResponse.status === 400) {
                            this.writeLog(`Not liked: ${likeResponse.status}`);
                            if (this.error400 >= this.error400ToBan) {
                                await this.sleep(this.banSleepTime);
                            } else {
                                this.error400 += 1;
                            }
                        } else {
                            this.writeLog(`Not liked: ${likeResponse.status}`);
                        }
                        await this.sleep(this.likeDelay * 0.9 + this.likeDelay * 0.2 * Math.random());
                        mediaSize -= 1;
                    }
                }
            } else {
                this.writeLog('No media to like!');
            }
        }
    }

    async like(mediaId) {
        if (this.loginStatus) {
            try {
                return await axios.post(this.urlLikes.replace('%s', mediaId));
            } catch (error) {
                this.writeLog('Exception on like!');
                console.error(error);
                return { status: 0 };
            }
        }
    }

    async comment(mediaId, commentText) {
        if (this.loginStatus && commentText && mediaId > 0) {
            try {
                return await axios.post(this.urlComment.replace('%s', mediaId), {
                    comment_text: commentText
                });
            } catch (error) {
                this.writeLog('Exception on comment!');
                console.error(error);
                return false;
            }
        }
        return false;
    }

    async follow(userId) {
        if (this.loginStatus && userId > 0) {
            try {
                return await axios.post(this.urlFollow.replace('%s', userId));
            } catch (error) {
                this.writeLog('Exception on follow!');
                console.error(error);
                return false;
            }
        }
        return false;
    }

    async unfollow(userId) {
        if (this.loginStatus && userId > 0) {
            try {
                return await axios.post(this.urlUnfollow.replace('%s', userId));
            } catch (error) {
                this.writeLog('Exception on unfollow!');
                console.error(error);
                return false;
            }
        }
        return false;
    }

    async autoMod() {
        this.running = true;
        while (this.running) {
            // Check if the bot is logged in
            if (this.loginStatus) {
                // Get a random tag from the tag list
                const randomTag = this.tagList[randomInt(0, this.tagList.length - 1)];
                
                // Fetch media IDs by the selected tag
                await this.getMediaIdByTag(randomTag);
                
                // Like media posts within the range specified
                await this.likeAllExistMedia(randomInt(1, this.maxLikeForOneTag));
            } else {
                this.writeLog("Not logged in. Exiting autoMod.");
                this.running = false; 
            }
    
            // Sleep for a while before the next iteration
            await this.sleep(1000); 
        }
    }
    
    // Helper function to generate a random integer between min and max (inclusive)
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    setupLogger() {
        const nowTime = new Date();
        const logFileName = `${this.userLogin}_${nowTime.toISOString().slice(0, 19).replace(/:/g, '-')}.log`;
        const logFilePath = path.join(this.logFilePath, logFileName);
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.simple(),
            transports: [
                new winston.transports.File({ filename: logFilePath })
            ]
        });
    }

    writeLog(logText) {
        if (this.logMod === 0) {
            console.log(logText);
        } else if (this.logMod === 1) {
            try {
                this.logger.info(logText);
            } catch (e) {
                console.log('Your text has unicode problems!');
            }
        }
    }

    async stop() {
        this.running = false;
        // Perform any necessary asynchronous cleanup here
        await this.sleep(1000); 
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = InstaBot;
