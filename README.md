# Realtools Front-end

These tools were made on request from a close friend of mine who plays this game. A live instance can be found at [realtools.shay.cat](https://realtools.shay.cat).

The source is provided here primarily for educational purposes - I am aware that the target audience of this program is not tech-savvy in this way.

# Self-hosting

A running instance of this server requires there to also be a running instance of [the API backend](https://github.com/hr-tools/api).

Because Realtools is somewhat proprietary software, you will need to do the following for the two to work in tandem:

* Set `API_BASE` in your `.env` file to the URL of your API server. It may be a local address - the client will not ever request it. This also means you do not need to worry about CORS policy.
