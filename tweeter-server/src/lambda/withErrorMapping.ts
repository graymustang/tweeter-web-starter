export const withErrorMapping = <Request, Response>(
  handler: (request: Request) => Promise<Response>): ((request: Request) => Promise<Response>) => async (request: Request): Promise<Response> => {
  try {
    return await handler(request);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/^(bad-request|unauthorized|internal-server-error):/.test(message)) throw error;
    console.error(error);
    throw new Error(`internal-server-error: ${message}`);
  }
};
