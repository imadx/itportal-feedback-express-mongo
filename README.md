# Installation

To use your local mongodb server, set `MONGODB_URI` environment variable.

## Database configuration

### This app needs a mongodb server configured, to function properly.

To install a local mongodb server instance.

1. Install MongoDB
2. Run MongoDB with `mongod`
3. Set MONGODB_URI environment variable,
```bash
set MONGODB_URI=mongodb://127.0.0.1 # local mongodb server
```
### Run the application

To run the NodeJS express application.

1. Install the dependencies
```javascript
npm install
```
2. Start the server

```javascript
npm start
```