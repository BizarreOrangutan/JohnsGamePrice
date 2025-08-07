from src.itad_error_handlers import (
    handle_http_error,
    handle_connection_error,
    handle_timeout_error,
    handle_request_error,
    handle_json_error,
    handle_generic_exception,
)
import requests

class DummyResponse:
    def __init__(self, status_code=500):
        self.status_code = status_code

def test_handle_http_error_401(capsys):
    handle_http_error(requests.exceptions.HTTPError("401 error"), DummyResponse(401))
    captured = capsys.readouterr()
    # No assertion needed, just ensure no exception is raised

def test_handle_connection_error(capsys):
    handle_connection_error(Exception("conn error"))
    captured = capsys.readouterr()

def test_handle_timeout_error(capsys):
    handle_timeout_error(Exception("timeout"))
    captured = capsys.readouterr()

def test_handle_request_error(capsys):
    handle_request_error(Exception("request error"))
    captured = capsys.readouterr()

def test_handle_json_error(capsys):
    handle_json_error(Exception("json error"))
    captured = capsys.readouterr()

def test_handle_generic_exception(capsys):
    handle_generic_exception(Exception("generic error"))
    captured = capsys.readouterr()