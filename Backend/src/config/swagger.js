const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HSSTORE API',
      version: '1.0.0',
      description: 'API Documentation for the HSSTORE Backend',
    },
    servers: [
      {
        url: 'https://future-fs-03-vert.vercel.app',
        description: 'Production server',
      },
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/modules/*/routes.js', './src/app.js'], 
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
  const CSS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css';
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCssUrl: CSS_URL,
      customSiteTitle: 'HSSTORE API Docs',
    })
  );
  console.log('📄 Swagger API Documentation available at http://localhost:5000/api-docs');
};

module.exports = swaggerDocs;
