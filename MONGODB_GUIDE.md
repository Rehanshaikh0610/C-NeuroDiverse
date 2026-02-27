# MongoDB Connection Guide for NeuroDiverse

This guide explains how to connect your NeuroDiverse application to MongoDB, either locally or using MongoDB Atlas.

## Option 1: Connect to Local MongoDB

### Prerequisites
- MongoDB installed on your local machine
- MongoDB service running

### Steps to Install MongoDB (Windows)

1. Download MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the installation wizard
3. Choose "Complete" installation
4. Install MongoDB as a service (recommended)
5. Complete the installation

### Start MongoDB Service

If MongoDB is installed as a service, it should start automatically. Otherwise, you can start it manually:

```powershell
# Navigate to MongoDB bin directory (adjust path as needed)
cd "C:\Program Files\MongoDB\Server\6.0\bin"

# Start MongoDB
.\mongod --dbpath="C:\data\db"
```

Note: You need to create the data directory first (`C:\data\db` in this example)

### Connect to Local MongoDB

Your application is already configured to connect to a local MongoDB instance at:
```
mongodb://localhost:27017/neurodiverse
```

## Option 2: Connect to MongoDB Atlas (Cloud)

### Create a MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Create a new project

### Create a Cluster

1. Click "Build a Database"
2. Choose the free tier (M0)
3. Select your preferred cloud provider and region
4. Click "Create Cluster"

### Configure Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (for development) or add your specific IP
4. Click "Confirm"

### Create a Database User

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Create a username and password (save these securely)
4. Set user privileges to "Read and Write to Any Database"
5. Click "Add User"

### Get Connection String

1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and the latest version
5. Copy the connection string

### Update Your .env.local File

Replace the existing MONGODB_URI with your Atlas connection string:

```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/neurodiverse?retryWrites=true&w=majority
```

Replace `<username>`, `<password>`, and `<cluster-url>` with your actual values.

## Testing Your MongoDB Connection

1. Start your Next.js application:
   ```
   npm run dev
   ```

2. Navigate to the MongoDB test page:
   ```
   http://localhost:3000/test-mongodb
   ```

3. Click "Test Connection" to verify your MongoDB connection
4. Try registering a test user to confirm that data can be written to the database

## Viewing Your MongoDB Data

### Using MongoDB Compass (GUI Tool)

1. Download and install [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Open MongoDB Compass
3. Connect using your connection string (local or Atlas)
4. Browse your databases and collections

### Using MongoDB Shell (Command Line)

For local MongoDB:
```
mongosh
```

Then switch to your database:
```
use neurodiverse
```

View all collections:
```
show collections
```

Query the users collection:
```
db.users.find()
```

## Troubleshooting

### Connection Issues

- Verify that MongoDB is running
- Check your connection string
- Ensure network access is properly configured
- Verify that your database user has the correct permissions

### Data Not Appearing

- Confirm that data is being saved with the correct collection name
- Check for any errors in the console
- Verify that you're connected to the correct database

### Authentication Errors

- Double-check your username and password
- Ensure the user has appropriate permissions
- For Atlas, verify that the user is associated with the correct database 