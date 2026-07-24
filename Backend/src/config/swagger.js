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
  // Serve the swagger JSON spec
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Serve a custom HTML page that loads Swagger UI from a CDN (Vercel-safe)
  app.get('/api-docs', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>HSSTORE API Docs</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.css" />
        <style>
          body { margin: 0; background: #fafafa; }
          .swagger-ui .topbar { display: none; }
        </style>
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui-bundle.js"></script>
        <script>
          window.onload = () => {
            window.ui = SwaggerUIBundle({
              url: '/api-docs.json',
              dom_id: '#swagger-ui',
              deepLinking: true,
              presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIBundle.SwaggerUIStandalonePreset
              ],
            });
          };
        </script>
      </body>
      </html>
    `);
  });

  console.log('📄 Swagger API Documentation available at http://localhost:5000/api-docs');
};

module.exports = swaggerDocs;
