from fastapi import HTTPException

from jpg_backend.utils import verify_date_format


def test_verify_date_format_valid():
    valid_dates = [
        "2022-12-27T11:21:08+01:00",
        "2023-01-01T00:00:00Z",
        "2021-06-15T15:30:45-05:00",
        "2020-02-29T23:59:59+00:00",
        "2020-02-29 23:59:59+00:00" # Should be accepted as valid ISO format even with a space instead of 'T'
    ]
    for date_str in valid_dates:
        try:
            verify_date_format(date_str)
        except Exception as e:
            assert (
                False
            ), f"verify_date_format raised an exception for valid date '{date_str}': {e}"

def test_verify_date_format_invalid():
    invalid_dates = [
        "2022/12/27T11:21:08+01:00",
        "27-12-2022T11:21:08+01:00",
        "2022-13-01T00:00:00Z",
        "2022-00-10T10:10:10+00:00",
        "2022-12-32T12:00:00+00:00",
        "InvalidDateString",
        "",
    ]
    for date_str in invalid_dates:
        try:
            verify_date_format(date_str)
            assert (
                False
            ), f"verify_date_format did not raise an exception for invalid date '{date_str}'"
        except HTTPException:
            pass  # Expected exception
        except Exception as e:
            assert (
                False
            ), f"verify_date_format raised an unexpected exception for date '{date_str}': {e}"