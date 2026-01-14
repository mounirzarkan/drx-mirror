class ErrorEvent {
  constructor(status, success, errorCode, message) {
    this.status = status;
    this.success = success;
    this.errorCode = errorCode;
    this.message = message;
  }

  getStatus() {
    return this.status;
  }

  getPayloadStr() {
    return JSON.stringify(this.getPayload());
  }

  getPayload() {
    return {
      success: this.success,
      data: {
        errorCode: this.errorCode,
        message: this.message
      }
    };
  }

  getPayloadContext() {
    return {
      success: this.success,
      errorCode: this.errorCode,
      message: this.message
    };
  }
}

module.exports = ErrorEvent;
