import { createLogProvider } from '../logs/providers/createLog.provider.js';

export const actionLogger = (req, res, next) => {
  const originalJson = res.json;
  const originalSend = res.send;

  let responseBody;

  res.json = function (body) {
    responseBody = body;
    return originalJson.call(this, body);
  };

  res.send = function (body) {
    responseBody = body;
    return originalSend.call(this, body);
  };

  res.on('finish', () => {
    // Ignore OPTIONS requests or requests without payload for cleaner logs
    if (req.method === 'OPTIONS') return;

    // Determine input string
    const inputObj = Object.keys(req.body).length ? req.body : req.query;
    let inputString = JSON.stringify(inputObj);

    // If it's a file upload (multipart/form-data), body might be empty in initial parsing, but let's log whatever we have
    if (!inputString || inputString === '{}') {
      inputString = `{"method":"${req.method}","path":"${req.path}"}`;
    }

    // Determine output result
    const outputResult = typeof responseBody === 'object' ? JSON.stringify(responseBody) : String(responseBody || '{}');
    
    // Get User ID if available
    const userId = req.user && req.user.userId ? req.user.userId : null;

    // Save asynchronously
    createLogProvider({ userId, inputString, outputResult });
  });

  next();
};
