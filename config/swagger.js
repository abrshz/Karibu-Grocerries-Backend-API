const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'KGL (Karibu Groceries Limited) API',
      version: '1.0.0',
      description:
        'Backend API for KGL produce procurement, sales management, and user authentication.',
      contact: {
        name: 'KGL Dev Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:{port}',
        variables: {
          port: {
            default: '3000',
          },
        },
        description: 'Development server',
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
      schemas: {
        Procurement: {
          type: 'object',
          required: [
            'produceName',
            'produceType',
            'date',
            'time',
            'tonnage',
            'cost',
            'dealerName',
            'branch',
            'contact',
            'sellingPrice',
          ],
          properties: {
            produceName: {
              type: 'string',
              example: 'Tomatoes123',
              description: 'Alpha-numeric name of produce',
            },
            produceType: {
              type: 'string',
              example: 'Vegetables',
              description: 'Alphabetic only, min 2 chars',
            },
            date: { type: 'string', format: 'date', example: '2025-06-15' },
            time: { type: 'string', example: '10:30' },
            tonnage: {
              type: 'number',
              example: 500,
              description: 'Min 3 digits (100+)',
            },
            cost: {
              type: 'number',
              example: 25000,
              description: 'Cost in UgX, min 5 digits',
            },
            dealerName: {
              type: 'string',
              example: 'Dealer One',
              description: 'Alpha-numeric, min 2 chars',
            },
            branch: {
              type: 'string',
              enum: ['Maganjo', 'Matugga'],
              example: 'Maganjo',
            },
            contact: {
              type: 'string',
              example: '+256701234567',
              description: 'Valid phone number',
            },
            sellingPrice: {
              type: 'number',
              example: 30000,
              description: 'Price to sell at in UgX',
            },
          },
        },
        CashSale: {
          type: 'object',
          required: [
            'produceName',
            'tonnage',
            'amountPaid',
            'buyerName',
            'salesAgentName',
            'date',
            'time',
          ],
          properties: {
            produceName: { type: 'string', example: 'Tomatoes' },
            tonnage: { type: 'number', example: 200 },
            amountPaid: {
              type: 'number',
              example: 15000,
              description: 'Min 5 digits in UgX',
            },
            buyerName: {
              type: 'string',
              example: 'John Doe',
              description: 'Alpha-numeric, min 2 chars',
            },
            salesAgentName: {
              type: 'string',
              example: 'Agent Smith',
              description: 'Alpha-numeric, min 2 chars',
            },
            date: { type: 'string', format: 'date', example: '2025-06-15' },
            time: { type: 'string', example: '14:00' },
          },
        },
        CreditSale: {
          type: 'object',
          required: [
            'buyerName',
            'nationalId',
            'location',
            'contacts',
            'amountDue',
            'salesAgentName',
            'dueDate',
            'produceName',
            'produceType',
            'tonnage',
            'dispatchDate',
          ],
          properties: {
            buyerName: {
              type: 'string',
              example: 'Jane Doe',
              description: 'Alpha-numeric, min 2 chars',
            },
            nationalId: {
              type: 'string',
              example: 'CM90002800HNBQ',
              description: 'Valid Uganda NIN',
            },
            location: {
              type: 'string',
              example: 'Kampala',
              description: 'Alpha-numeric, min 2 chars',
            },
            contacts: {
              type: 'string',
              example: '+256701234567',
              description: 'Valid phone number',
            },
            amountDue: {
              type: 'number',
              example: 50000,
              description: 'Min 5 digits in UgX',
            },
            salesAgentName: { type: 'string', example: 'Agent Smith' },
            dueDate: { type: 'string', format: 'date', example: '2025-07-15' },
            produceName: { type: 'string', example: 'Onions' },
            produceType: { type: 'string', example: 'Vegetables' },
            tonnage: { type: 'number', example: 300 },
            dispatchDate: {
              type: 'string',
              format: 'date',
              example: '2025-06-20',
            },
          },
        },
        User: {
          type: 'object',
          required: ['username', 'email', 'password', 'role'],
          properties: {
            username: { type: 'string', example: 'john_manager' },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@kgl.com',
            },
            password: {
              type: 'string',
              example: 'SecurePass123!',
              description: 'Min 6 characters',
            },
            role: {
              type: 'string',
              enum: ['Manager', 'SalesAgent'],
              example: 'Manager',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'john@kgl.com' },
            password: { type: 'string', example: 'SecurePass123!' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js'],
};

module.exports = swaggerJsdoc(options);
