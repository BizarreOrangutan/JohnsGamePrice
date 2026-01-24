from db.crud.user import create_user, get_user_by_username, update_user, delete_user, DatabaseError, DuplicateUsernameError, DuplicateEmailError
import pytest

def test_create_user_happy():
    user_data = {
        "username": "testuser",
        "email": "testuser@example.com",
        "password_hash": "hashedpassword"
    }

    user_id = create_user(user_data)
    assert user_id is not None

def test_create_user_missing_field():
    user_data = {
        "username": "testuser2",
        # Missing email
        "password_hash": "hashedpassword"
    }

    user_id = create_user(user_data)
    assert user_id is None

def test_create_user_duplicate_username():
    user_data = {
        "username": "testuser3",
        "email": "testuser3@example.com", 
        "password_hash": "hashedpassword"
    }
    user_id1 = create_user(user_data)
    assert user_id1 is not None
    user_data_duplicate = {
        "username": "testuser3",  # Duplicate username
        "email": "duplicate@example.com",
        "password_hash": "hashedpassword"
    }
    with pytest.raises(DuplicateUsernameError):
        create_user(user_data_duplicate)

def test_create_user_duplicate_email():
    user_data = {
        "username": "testuser4",
        "email": "testuser4@example.com",
        "password_hash": "hashedpassword"
    }
    user_id1 = create_user(user_data)
    assert user_id1 is not None
    user_data_duplicate = {
        "username": "uniqueusername",
        "email": "testuser4@example.com",  # Duplicate email
        "password_hash": "hashedpassword"
    }
    with pytest.raises(DuplicateEmailError):
        create_user(user_data_duplicate)

def test_create_user_invalid_email_format():
    user_data = {
        "username": "testuser5",
        "email": "invalidemailformat",  # Invalid email format
        "password_hash": "hashedpassword"
    }

    user_id = create_user(user_data)
    assert user_id is None

def test_create_user_long_username():
    user_data = {
        "username": "a" * 300,  # Excessively long username
        "email": "longusername@example.com",
        "password_hash": "hashedpassword"
    }

    user_id = create_user(user_data)
    assert user_id is None

def test_create_user_sql_injection():
    user_data = {
        "username": "testuser6'; DROP TABLE user; --",
        "email": "sqlinjection@example.com",
        "password_hash": "hashedpassword"
    }

    user_id = create_user(user_data)
    assert user_id is None

def test_create_user_database_connection_failure(monkeypatch):
    def mock_connect_failure():
        raise Exception("Database connection failed")
    monkeypatch.setattr("db.connection.engine.connect", mock_connect_failure)
    user_data = {
        "username": "testuser7",
        "email": "testuser7@example.com",
        "password_hash": "hashedpassword"
    }
    with pytest.raises(DatabaseError):
        create_user(user_data)

def test_get_user_by_username_happy():
    user_data = {
        "username": "testuser8",
        "email": "testuser8@example.com",
        "password_hash": "hashedpassword"
    }

    user_id = create_user(user_data)
    assert user_id is not None

    user = get_user_by_username("testuser8")
    assert user is not None
    assert user["username"] == "testuser8"

def test_get_user_by_username_not_found():
    user = get_user_by_username("nonexistentuser")
    assert user is None

def test_get_user_by_username_database_connection_failure(monkeypatch):
    def mock_connect_failure():
        raise Exception("Database connection failed")
    monkeypatch.setattr("db.connection.engine.connect", mock_connect_failure)
    with pytest.raises(DatabaseError):
        get_user_by_username("anyuser")

def test_update_user_happy():
    user_data = {
        "username": "testuser9",
        "email": "testuser9@example.com",
        "password_hash": "hashedpassword"
    }

    user_id = create_user(user_data)
    assert user_id is not None

    update_data = {
        "email": "updatedemail@example.com",
    }

    success = update_user(user_id, update_data)
    assert success

    updated_user = get_user_by_username("testuser9")
    assert updated_user["email"] == "updatedemail@example.com"


def test_update_user_not_found():
    update_data = {
        "email": "updatedemail@example.com",
    }

    success = update_user(9999, update_data)  # Assuming 9999 does not exist
    assert not success

def test_update_user_invalid_email_format():
    user_data = {
        "username": "testuser10",
        "email": "validemail@example.com",  # Valid email format
        "password_hash": "hashedpassword"
    } 

    user_id = create_user(user_data)
    assert user_id is not None

    update_data = {
        "email": "invalidemailformat",  # Invalid email format
    }

    success = update_user(user_id, update_data)
    assert not success

def test_update_user_invalid_username_format():
    user_data = {
        "username": "testuser13",
        "email": "testuser13@example.com",
        "password_hash": "hashedpassword"
    }

    user_id = create_user(user_data)
    assert user_id is not None

    update_data = {
        "username": "invalid username!",  # Invalid username format
    }

    success = update_user(user_id, update_data)
    assert not success

def test_invalid_update_user_duplicate_email():
    user_data1 = {
        "username": "testuser11",
        "email": "testuser11@example.com",
        "password_hash": "hashedpassword",
    }
    user_id1 = create_user(user_data1)
    assert user_id1 is not None
    user_data2 = {
        "username": "testuser12",
        "email": "testuser12@example.com",  # Unique email
        "password_hash": "hashedpassword",
    }
    user_id2 = create_user(user_data2)
    assert user_id2 is not None
    update_data = {
        "email": "testuser11@example.com",  # Duplicate email
    }
    with pytest.raises(DuplicateEmailError):
        update_user(user_id2, update_data)

def test_update_user_database_connection_failure(monkeypatch):
    def mock_connect_failure():
        raise Exception("Database connection failed")
    monkeypatch.setattr("db.connection.engine.connect", mock_connect_failure)
    update_data = {
        "email": "updatedemail@example.com",
    }
    with pytest.raises(DatabaseError):
        update_user(1, update_data)

def test_delete_user_happy():
    user_data = {
        "username": "testuser14",
        "email": "testuser14@example.com",
        "password_hash": "hashedpassword"
    }

    user_id = create_user(user_data)
    assert user_id is not None

    success = delete_user(user_id)
    assert success

def test_delete_user_not_found():
    success = delete_user(9999)  # Assuming 9999 does not exist
    assert not success

def test_delete_user_database_connection_failure(monkeypatch):
    def mock_connect_failure():
        raise Exception("Database connection failed")
    monkeypatch.setattr("db.connection.engine.connect", mock_connect_failure)
    with pytest.raises(DatabaseError):
        delete_user(1)