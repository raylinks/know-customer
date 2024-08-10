"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorHandler;
// Error handler to display the error as HTML
// eslint-disable-next-line no-unused-vars, no-shadow
function errorHandler(err, res) {
    if (typeof err === 'string') {
        res.status(400).json({ message: err });
    }
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ message: 'Invalid Token' });
    }
    // default to 500 server error
    res.status(err.status);
    res.send(`<h1>${err.status} Error</h1>` + `<pre>${err.message}</pre>`);
}
//# sourceMappingURL=error.handler.js.map