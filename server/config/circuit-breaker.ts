import CircuitBreaker from 'opossum';
import logger from '../common/logger';
const http = require('http');

async function asyncFunctionThatCouldFail(abortSignal: any): Promise<number> {
  return await new Promise((resolve, reject) => {
    http.get('http://httpbin.org/delay/10', { signal: abortSignal }, (res: { statusCode: number }) => {
      if (res.statusCode < 300) {
        resolve(res.statusCode);
        return;
      }

      reject(res.statusCode);
    });
  });
}
const abortController = new AbortController();
const options = {
  abortController,
  timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
};

const breaker = new CircuitBreaker(asyncFunctionThatCouldFail, options);

breaker.fire(abortController.signal).then(logger.info).catch(logger.error);

// if asyncFunctionThatCouldFail starts to fail, firing the breaker
// will trigger our fallback function
breaker.fallback(() => 'Sorry, out of service right now');
breaker.on('fallback', (result) => {
  reportFallbackEvent(result);
});

function reportFallbackEvent(result: unknown): void {
  logger.info(result);
}
