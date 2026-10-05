export const N8N_WORKFLOW_TEMPLATE = {
  name: 'CertifyCraft Automated Email Dispatcher',
  nodes: [
    {
      parameters: {
        httpMethod: 'POST',
        path: 'certifycraft-email',
        responseMode: 'onReceived',
        responseData: 'allEntries',
      },
      id: 'webhook-node',
      name: 'CertifyCraft Webhook',
      type: 'n8n-nodes-base.webhook',
      typeVersion: 2,
      position: [240, 300],
      webhookId: 'certifycraft-email',
    },
    {
      parameters: {
        operation: 'toBinary',
        sourceProperty: 'body.pdf_base64',
        destinationProperty: 'data',
        options: {
          fileName: '={{ $json.body.pdf_filename }}',
          mimeType: 'application/pdf',
        },
      },
      id: 'code-binary-node',
      name: 'Convert PDF Base64',
      type: 'n8n-nodes-base.convertToFile',
      typeVersion: 1.1,
      position: [460, 300],
    },
    {
      parameters: {
        fromEmail: 'your-email@gmail.com',
        toEmail: '={{ $json.body.recipient_email }}',
        subject: '={{ $json.body.subject }}',
        text: '={{ $json.body.message }}',
        attachments: 'data',
      },
      id: 'email-node',
      name: 'Send Email with Certificate PDF',
      type: 'n8n-nodes-base.emailSend',
      typeVersion: 2.1,
      position: [680, 300],
    },
  ],
  connections: {
    'CertifyCraft Webhook': {
      main: [
        [
          {
            node: 'Convert PDF Base64',
            type: 'main',
            index: 0,
          },
        ],
      ],
    },
    'Convert PDF Base64': {
      main: [
        [
          {
            node: 'Send Email with Certificate PDF',
            type: 'main',
            index: 0,
          },
        ],
      ],
    },
  },
  settings: {
    executionOrder: 'v1',
  },
};
