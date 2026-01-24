import re
from sqlalchemy import insert
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from db.schemas.user import user as user_table
from db.connection import engine

EMAIL_REGEX = re.compile(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")
USERNAME_REGEX = re.compile(r"^[A-Za-z0-9_]{3,30}$")

class DatabaseError(Exception):
    pass

class DuplicateUsernameError(DatabaseError):
    pass

class DuplicateEmailError(DatabaseError):
    pass

def create_user(user_data: dict) -> int:
    """
    Create a new user in a transaction.
    Args:
        user_data: Dictionary with user fields (e.g., {"username": "John", "email": "john@example.com", ...}).
    Returns:
        The inserted primary key or None if failed.
    """
    # Clean and validate input
    username = user_data.get("username")
    email = user_data.get("email")
    password_hash = user_data.get("password_hash")

    if username:
        username = username.strip().lower()
    if email:
        email = email.strip().lower()

    # Validate username format
    if not username or not USERNAME_REGEX.match(username):
        print("Invalid username format. Only 3-30 alphanumeric characters or underscores allowed.")
        return None
    # Validate email format
    if not email or not EMAIL_REGEX.match(email):
        print("Invalid email format.")
        return None
    # Validate required fields
    if not password_hash:
        print("Missing required fields.")
        return None

    user_data_clean = {
        "username": username,
        "email": email,
        "password_hash": password_hash
    }

    try:
        conn = engine.connect()
        trans = conn.begin()
        try:
            result = conn.execute(insert(user_table).values(**user_data_clean))
            trans.commit()
            return result.inserted_primary_key[0]
        except IntegrityError as e:
            trans.rollback()
            msg = str(e.orig)
            if 'user_username_key' in msg:
                raise DuplicateUsernameError("Username already exists.")
            elif 'user_email_key' in msg:
                raise DuplicateEmailError("Email already exists.")
            else:
                raise DatabaseError(f"Integrity error: {e}")
        except SQLAlchemyError as e:
            trans.rollback()
            raise DatabaseError(f"Error creating user: {e}")
        finally:
            conn.close()
    except (DuplicateUsernameError, DuplicateEmailError):
        raise
    except Exception as e:
        raise DatabaseError(f"Error connecting to the database or starting transaction: {e}")
    
def get_user_by_username(username: str) -> dict | None:
    """
    Retrieve a user by username.
    Args:
        username: The username of the user to retrieve.
    Returns:
        A dictionary with user fields or None if not found.
    """
    try:
        conn = engine.connect()
        query = user_table.select().where(user_table.c.username == username)
        result = conn.execute(query).fetchone()
        conn.close()
        if result:
            return dict(result._mapping)
        return None
    except Exception as e:
        raise DatabaseError(f"Error retrieving user: {e}")
    
def update_user(user_id: int, update_data: dict) -> bool:
    """
    Update user fields by ID.
    Args:
        user_id: The ID of the user to update.
        update_data: Dictionary with fields to update (e.g., {"email": "john@gmail.com"}).
    Returns:
        True if update was successful, False otherwise.
    """
    # Clean and validate fields if present
    update_data_clean = {}
    if "username" in update_data:
        username = update_data["username"].strip().lower()
        if not USERNAME_REGEX.match(username):
            print("Invalid username format. Only 3-30 alphanumeric characters or underscores allowed.")
            return False
        update_data_clean["username"] = username
    if "email" in update_data:
        email = update_data["email"].strip().lower()
        if not EMAIL_REGEX.match(email):
            print("Invalid email format.")
            return False
        update_data_clean["email"] = email
    if "password_hash" in update_data:
        update_data_clean["password_hash"] = update_data["password_hash"]
    if not update_data_clean:
        print("No valid fields to update.")
        return False
    try:
        conn = engine.connect()
        trans = conn.begin()
        try:
            query = user_table.update().where(user_table.c.id == user_id).values(**update_data_clean)
            result = conn.execute(query)
            trans.commit()
            return result.rowcount > 0
        except IntegrityError as e:
            trans.rollback()
            msg = str(e.orig)
            if 'user_username_key' in msg:
                raise DuplicateUsernameError("Username already exists.")
            elif 'user_email_key' in msg:
                raise DuplicateEmailError("Email already exists.")
            else:
                raise DatabaseError(f"Integrity error: {e}")
        except SQLAlchemyError as e:
            trans.rollback()
            raise DatabaseError(f"Error updating user: {e}")
        finally:
            conn.close()
    except (DuplicateUsernameError, DuplicateEmailError):
        raise
    except Exception as e:
        raise DatabaseError(f"Error connecting to the database or starting transaction: {e}")
    
def delete_user(user_id: int) -> bool:
    """
    Delete a user by ID.
    Args:
        user_id: The ID of the user to delete.
    Returns:
        True if deletion was successful, False otherwise.
    """
    try:
        conn = engine.connect()
        trans = conn.begin()
        try:
            query = user_table.delete().where(user_table.c.id == user_id)
            result = conn.execute(query)
            trans.commit()
            return result.rowcount > 0
        except SQLAlchemyError as e:
            trans.rollback()
            raise DatabaseError(f"Error deleting user: {e}")
        finally:
            conn.close()
    except Exception as e:
        raise DatabaseError(f"Error connecting to the database or starting transaction: {e}")
