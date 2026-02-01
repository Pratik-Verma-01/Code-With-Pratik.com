// Helper to handle CORS for Vercel Serverless
export function allowCors(fn) {
  return async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    return await fn(req, res);
  };
}

// Secure Error Handler (Masks internal server errors)
export function handleError(res, error) {
  console.error('[SERVER ERROR]:', error); // Log real error to Vercel logs

  if (error.name === 'ZodError') {
    return res.status(400).json({ 
      error: 'Validation Error', 
      details: error.errors 
    });
  }

  // Generic message for user
  return res.status(500).json({ 
    error: 'Internal Server Error', 
    message: 'Something went wrong processing your request.' 
  });
}
