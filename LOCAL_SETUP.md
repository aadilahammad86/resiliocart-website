# Local Setup Instructions

## Prerequisites: Setting up WSL and Docker (Windows)

If you are starting on a fresh Windows machine, you need WSL (Windows Subsystem for Linux) and Docker to use our container-based database setup.

1. **Install WSL (Ubuntu):**
   Open PowerShell as Administrator and run:

   ```powershell
   wsl --install
   ```

   Restart your computer if prompted.

2. **Install Docker:**
   - **Option A (Docker Desktop):** Download and install [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop). Once installed, open Settings -> General, and verify that "Use the WSL 2 based engine" is checked.
   - **Option B (Docker engine directly in WSL):** If you prefer not to use Docker Desktop, open your Ubuntu WSL terminal and install the Docker engine natively without Docker Desktop:
     ```bash
     curl -fsSL https://get.docker.com -o get-docker.sh
     sudo sh get-docker.sh
     sudo usermod -aG docker $USER
     ```

---

## PostgreSQL Database Setup

For this project, we are using PostgreSQL. It is recommended to use the provided `docker-compose.yml` to spin up the database locally.

### Windows / WSL Instructions

If you are developing on Windows and using Docker Desktop or Docker inside WSL, you might face networking timeouts using the Windows Docker CLI. We recommend running Docker directly from your WSL instance.

1. **Configure Environment Variables**
   Ensure your `.env` file has the correct database credentials:

   ```env
   DATABASE_URL="postgres://user:password@localhost:5432/resiliocart"
   ```

2. **Start the Database Container via WSL**
   Open your WSL terminal (e.g., Ubuntu) and run the following commands without `sudo` (assuming your docker socket is configured for your user):

   ```bash
   cd /mnt/c/Users/aadil/Project/resiliocart-website
   docker compose up -d
   ```

   _Note: This starts the `postgres:15-alpine` container on port 5432 automatically mapped to `localhost`._

3. **Initialize the Prisma Schema**
   Once the container is running smoothly, apply the Prisma schema from your standard Windows terminal to create the tables in the database:
   ```bash
   npx prisma db push
   ```

Now your local PostgreSQL database is verified and running!

---

### Alternative: Native Windows Setup for Legacy/Production Servers (e.g. Windows Server 2016)

If your development environment or **production deployment server (like Windows Server 2016/2019)** does not support WSL, modern Docker versions, or `winget`, you cannot realistically run Linux-based Postgres containers. In this case, you install everything natively:

1. **Download and Install PostgreSQL (Database)**
   - Head to the [official PostgreSQL downloads page for Windows](https://www.postgresql.org/download/windows/) and download the interactive graphical installer, which works on older Windows Server editions perfectly.
   - Run the installer. During setup:
     - Install the **pgAdmin 4** utility (included) if you want a graphical interface to view the database.
     - Take note of the **password** you set for the default `postgres` superuser.
     - Leave the default port as `5432`.

2. **Create the Database**
   - Open **pgAdmin 4** or use the `psql` command-line tool.
   - Connect using the `postgres` user and the password you set.
   - Create a new database named `resiliocart` (or execute `CREATE DATABASE resiliocart;` in psql).

3. **Configure Environment Variables**
   Update your `.env` file with the direct native connection string:

   ```env
   # Format: postgres://<username>:<password>@localhost:5432/<dbname>
   DATABASE_URL="postgres://postgres:YOUR_PASSWORD_HERE@localhost:5432/resiliocart"
   ```

4. **Initialize the Prisma Schema**
   Just like the Docker setup, generate the tables by running:
   ```bash
   npx prisma db push
   ```
