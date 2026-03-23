"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendResponse = void 0;
const sendResponse = (res, statusCode, data = null, message = 'Success') => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};
exports.sendResponse = sendResponse;
const sendError = (res, statusCode, error) => {
    return res.status(statusCode).json({
        success: false,
        error
    });
};
exports.sendError = sendError;
//# sourceMappingURL=response.util.js.map