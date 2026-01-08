**Prerequisites**
Python 3.10+
pip

**Install dependencies**:
   ```bash
   # Install poetry for automating project management
   pip install poetry

   # Install dependencies including dev
   poetry install

   # Install only production dependencies
   poetry install --no-dev
   ```

**[Optional] Enter virtual environment**:
   ```bash
   # For the first time, install the shell command
   poetry self add poetry-plugin-shell

   # Entering poetry shell removes the need to add poetry at the start of commmands
   poetry shell

   # To get out of the shell
   exit
   ```

**Configure environment**:
   ```bash
   # Create and start editing an .env file
   vi .env
   # or
   notepad .env

   # Within .env declare the ITAD API key
   API_KEY=<YOUR ITAD API KEY>
   ```

**Run the application**:
   ```bash
   poetry run poe dev
   ```

**Add dependencies**:
   ```bash
   poetry add <package>         # production
   poetry add --group dev <package>   # dev only
   ```

**Run formatting scripts**:
   ```bash
   poetry run poe format

   # Or run checks
   poetry run poe check
   ```

**Run tests**:
   ```bash
   poetry run poe test
   
   # With coverage report
   poetry run poe cov
   ```