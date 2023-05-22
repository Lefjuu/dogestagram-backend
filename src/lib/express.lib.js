const helmet = require('helmet');
const bodyParser = require('body-parser');
const compression = require('compression');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { CLIENT_HOSTNAME, PROJECT_MODE } = require('../config/index.js');

const create = async app => {
  app.use(helmet());
  app.use(
    bodyParser.json({
      limit: '50mb',
      extended: true
    })
  );
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(compression());

  app.use(methodOverride());

  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minute
      max: 1000, // limit each ip to 1000 requests per windowMs
      message: 'You have exceeded the requests in 1 minute limit!',
      headers: true
    })
  );
  app.use(cookieParser());

  const corsOptions = {
    origin: CLIENT_HOSTNAME,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ['Content-Type', 'Authorization']
  };

  app.use(cors(corsOptions));

  if (PROJECT_MODE === 'development') {
    app.use(morgan('dev'));
  }
};

module.exports = { create };
