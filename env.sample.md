# Environment Variables Sample

Below is a sample `.env` file with descriptions for each variable. Replace the placeholder values with your actual configuration.

```js
# MongoDB connection string
MONGODB_URI= "mongodb+srv://username:Password@cluster0.test.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" // replace with your mongo db URI
# Port number for the server to listen on
PORT= 5000

# Secret key for JWT authentication
JWT_SECRET="kjdfkj" // replace with your jwt token

# Node environment (e.g., development, production)
NODE_ENV= 

# URL of the client application
CLIENT_URL= //frontend url goes here 

# Gmail user for sending emails
GMAIL_USER= //enter your mail id from where you send the verifications mail

# Gmail password for sending emails
GMAIL_PASS= //obtain tour pass from gmail dashboard
```