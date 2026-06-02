# MongoDB Atlas Connection Issue on Hostinger Production Server

This document outlines the troubleshooting process, root causes, and resolutions for MongoDB connection issues encountered when deploying the backend application to a Hostinger cPanel/VPS environment while it runs successfully in a local development environment.

---

## 1. Symptom

During deployment, the backend application fails to start under PM2, printing the following error message in the console logs:

```log
MongoDB connection error: MongooseServerSelectionError: Could not connect to any servers in your MongoDB Atlas cluster.
One common reason is that you're trying to access the database from an IP that isn't whitelisted.
Make sure your current IP address is on your Atlas cluster's IP whitelist: https://www.mongodb.com/docs/atlas/security-whitelist/
  reason: TopologyDescription {
    type: 'Unknown',
    servers: Map(1) {
      'cluster0.zpnyany.mongodb.net:27017' => [ServerDescription]
    },
    ...
  }
```

---

## 2. Root Causes

This issue is typically caused by one or both of the following reasons:

### Cause A: Environment Variable Mismatch (`.env`)
The database connection string configured in the server's `.env` file does not match the active database cluster.
* **Local `.env` connection string:** Points to `ac-lvquyke-shard-00-00.ehvxkhj.mongodb.net`
* **Hostinger server `.env` connection string:** Points to `cluster0.zpnyany.mongodb.net`

Even if IP whitelisting (`0.0.0.0/0`) is configured on the new database cluster, the Hostinger server will still fail to connect because it is hitting the old/incorrect database endpoint.

### Cause B: Outbound Firewall Port Restrictions
Hostinger servers (especially standard cPanel or VPS hosting) block outbound TCP traffic on non-standard ports by default. MongoDB Atlas communicates over port **`27017`**. If this port is closed outbound, the server cannot connect to MongoDB Atlas.

---

## 3. Diagnosis & Resolution

### Step 1: Check Network Connectivity
Run this command from the Hostinger SSH terminal to verify if the server can reach MongoDB Atlas on port `27017`:
```bash
curl -v ac-lvquyke-shard-00-00.ehvxkhj.mongodb.net:27017
```

* **If it says `Connected to ...`**: The outbound port `27017` is open. Move directly to **Step 3 (Update `.env` configuration)**.
* **If it hangs, times out, or fails to connect**: The outbound port is blocked by the Hostinger firewall. Proceed to **Step 2**.

### Step 2: Open Outbound Port 27017
If you are logged in as `root` via SSH, configure your firewall to allow outbound connections to port `27017`.

#### For CSF (ConfigServer Security & Firewall) — Common on cPanel VPS:
1. Locate the configuration file `/etc/csf/csf.conf`.
2. Find the list of allowed outgoing ports (`TCP_OUT`).
3. Add `27017` to the list (e.g., `TCP_OUT = "...,27017"`).
4. Run the following command to apply the changes:
   ```bash
   # Add port 27017 to outgoing TCP rules in CSF
   sed -i 's/^TCP_OUT = "/TCP_OUT = "27017,/g' /etc/csf/csf.conf
   
   # Restart CSF firewall
   csf -r
   ```

#### For firewalld (CentOS/RHEL):
```bash
firewall-cmd --zone=public --add-port=27017/tcp --permanent
firewall-cmd --reload
```

#### For UFW (Ubuntu/Debian):
```bash
sudo ufw allow out 27017/tcp
```

### Step 3: Update Server Environment Variables
Once network connectivity is established, update the server's `.env` configuration to use the correct MongoDB connection string.

1. Open the `.env` file on the Hostinger server:
   ```bash
   nano /root/Project/VerifyMyKyc/backend/.env
   ```
2. Update the `MONGO_URI` field to match the working local database URI:
   ```env
   MONGO_URI=mongodb://ankur_db_user:ix3LZwO17NHiOMRY@ac-lvquyke-shard-00-00.ehvxkhj.mongodb.net:27017,ac-lvquyke-shard-00-01.ehvxkhj.mongodb.net:27017,ac-lvquyke-shard-00-02.ehvxkhj.mongodb.net:27017/verifymykyc?ssl=true&replicaSet=atlas-d36qb2-shard-0&authSource=admin&retryWrites=true&w=majority
   ```
3. Save the file (`CTRL + O`, `Enter`) and exit (`CTRL + X`).

### Step 4: Restart the Application
Restart your Node.js application process under PM2 to apply the configuration updates:
```bash
# Restart the process
pm2 restart verifymykyc-backend

# Monitor logs to verify successful connection
pm2 logs verifymykyc-backend
```
