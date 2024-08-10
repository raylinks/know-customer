import pino from 'pino';

const l = pino({
  name:"kyc",
  level: "info",
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

export default l;
