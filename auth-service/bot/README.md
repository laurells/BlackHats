1. InstaBot Class
This class defines a bot that automates interactions with Instagram.

ConstructorParameters:

login: Instagram username.
password: Instagram password.
likePerDay: Number of likes per day.
moreThanLikes: Minimum likes a post must have to be considered.
tagList: List of tags to search for media.
maxLikeForOneTag: Maximum number of likes for a single tag.
logMod: Logging mode (0 for console, 1 for file).

Initialization:
Initializes various properties and URLs for interacting with Instagram's API.
Sets up logging if logMod is set to 1.
Calls the login method to attempt logging in.

Methods

login:
Attempts to log in by fetching the CSRF token and then sending login credentials.
Checks if login was successful and updates loginStatus.

logout:
Logs out if currently logged in and resets loginStatus.

getMediaIdByTag:
Fetches media IDs by querying Instagram with a specific tag.
Parses the page's JSON data to extract media nodes.

likeAllExistMedia:
Likes media posts from the mediaByTag list based on conditions.
Implements error handling and delays between likes.

like:
Sends a request to like a specific media item.

comment:
Sends a comment to a specific media item if the bot is logged in.

follow:
Sends a request to follow a user by user ID.

unfollow:
Sends a request to unfollow a user by user ID.

autoMod:
Periodically selects a random tag, gets media by that tag, and likes media posts.
Loops until running is set to false.

randomInt:
Helper function to generate a random integer between a given range.

setupLogger:
Configures logging with winston if logMod is set to 1.

writeLog:
Logs messages to the console or file based on logMod.

stop:
Stops the bot by setting running to false.
Includes a sleep period to ensure any ongoing operations complete.

sleep:
Returns a promise that resolves after a specified time, used for delays.

2. Controller Functions (startInstaBot and stopInstaBot)
These functions handle HTTP requests to start and stop the bot.

startInstaBot:

Receives the account ID from the request parameters.
Calls startBot with the account ID and returns a success message if the bot starts.
stopInstaBot:

Receives the account ID from the request parameters.
Calls stopBot with the account ID and returns a success message if the bot stops.

3. instabotService.js Functions (startBot and stopBot)
These functions manage the bot instances.
startBot:

Retrieves the account information from the database using the account ID.
Checks if a bot is already running for this account.
Creates a new InstaBot instance with account credentials and settings.
Starts the bot's autoMod loop and stores the instance in the bots object.

stopBot:

Checks if a bot is running for the given account ID.
Stops the bot and removes it from the bots object.
How They Interact

Initialization:

The InstaBot class is instantiated with user credentials and settings. After instantiation, it attempts to log in using the login method.

The startInstaBot function is called via an HTTP request. It triggers startBot which creates and starts an InstaBot instance, managing the bot in memory.

The stopInstaBot function is called via an HTTP request. It triggers stopBot, which stops the bot and cleans up the instance.


