from fastapi import HTTPException

from jpg_backend.utils import verify_country_code


def test_verify_country_code_valid():
    valid_codes = ["US", "GB", "FR", "DE", "JP", "CN", "IN", "BR", "CA", "AU"]
    for code in valid_codes:
        try:
            verify_country_code(code)
        except Exception as e:
            assert (
                False
            ), f"verify_country_code raised an exception for valid code '{code}': {e}"

def test_verify_country_code_invalid():
    invalid_codes = ["USA", "U", "123", "XX", "ZZ", "abc", "", " ", "U1", "G!"]
    for code in invalid_codes:
        try:
            verify_country_code(code)
            assert (
                False
            ), f"verify_country_code did not raise an exception for invalid code '{code}'"
        except HTTPException:
            pass  # Expected exception
        except Exception as e:
            assert (
                False
            ), f"verify_country_code raised an unexpected exception for code '{code}': {e}"