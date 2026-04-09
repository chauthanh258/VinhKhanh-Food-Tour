import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import routes from './routes/index';
import { errorHandler } from './middlewares/error.middleware';
import { env } from './config/env';

const app = express();
const PORT = env.PORT;

// Middleware
app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL }));
app.use(morgan('dev'));
app.use(express.json());

// Swagger Setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Food Tour API',
      version: '1.0.0',
      description: 'API documentation for the Food Tour Application',
    },
    servers: [
      {
        url: env.API_BASE_URL,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Load spec via endpoint so the server URL can be generated from the current request host.
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: '/api/openapi.json',
    },
  })
);
app.get('/api/openapi.json', (req, res) => {
  const forwardedProto = req.header('x-forwarded-proto');
  const protocol = forwardedProto || req.protocol;
  const host = req.header('host');
  const dynamicApiUrl = host ? `${protocol}://${host}/api` : env.API_BASE_URL;

  res.json({
    ...swaggerSpec,
    servers: [{ url: dynamicApiUrl }],
  });
});

// Routes
app.use('/api', routes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error Handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📖 Documentation available at http://localhost:${PORT}/api/docs`);
});
