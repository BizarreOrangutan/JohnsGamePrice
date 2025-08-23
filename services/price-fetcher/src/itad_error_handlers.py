import traceback
import sys
from .logger import get_logger

logger = get_logger("ITADErrorHandlers")

def handle_http_error(e, response):
    status_code = response.status_code if response is not None else 'Unknown'
    if status_code == 401:
        logger.error(f"HTTP 401: Invalid API key")
    elif status_code == 429:
        logger.error(f"HTTP 429: Rate limit exceeded")
    elif status_code == 404:
        logger.error(f"HTTP 404: Endpoint not found")
    else:
        logger.error(f"HTTP {status_code}: {e}")
    logger.debug(traceback.format_exc())
    return None

def handle_connection_error(e):
    logger.error(f"Connection Error: {e}")
    logger.debug(traceback.format_exc())
    return None

def handle_timeout_error(e):
    logger.error(f"Timeout Error: {e}")
    logger.debug(traceback.format_exc())
    return None

def handle_request_error(e):
    logger.error(f"Request Error: {e}")
    logger.debug(traceback.format_exc())
    return None

def handle_json_error(e):
    logger.error(f"JSON Error: Invalid response format - {e}")
    logger.debug(traceback.format_exc())
    return None

def handle_generic_exception(e):
    exc_type, exc_value, exc_traceback = sys.exc_info()
    line_no = exc_traceback.tb_lineno if exc_traceback else 'Unknown'
    filename = exc_traceback.tb_frame.f_code.co_filename if exc_traceback else 'Unknown'
    logger.error(f"Unexpected Error: {e}")
    logger.error(f"File: {filename}, Line: {line_no}")
    logger.debug(f"Full traceback:\n{traceback.format_exc()}")
    return None