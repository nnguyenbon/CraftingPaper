import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import dotenv from 'dotenv';
import { sendPaperEmail, getGmailConfig } from './src/server/emailService.ts';

// Initial load of environment variables
dotenv.config();

function emailApiPlugin(): Plugin {
  return {
    name: 'email-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = req.url?.split('?')[0];

        // API: Check Gmail configuration status
        if (pathname === '/api/email-config-status' && req.method === 'GET') {
          // Re-read .env to catch any recent changes without needing server restart
          dotenv.config();
          const config = getGmailConfig();
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          });
          res.end(
            JSON.stringify({
              isConfigured: config.isConfigured,
              userEmail: config.user
                ? config.user.replace(/(.{2})(.*)(@.*)/, '$1***$3')
                : '',
            })
          );
          return;
        }

        // API: Send email with paper image attachment
        if (pathname === '/api/send-email' && req.method === 'POST') {
          dotenv.config();
          try {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });
            req.on('end', async () => {
              try {
                const payload = JSON.parse(body);
                const result = await sendPaperEmail(payload);
                res.writeHead(result.status, {
                  'Content-Type': 'application/json',
                });
                res.end(JSON.stringify(result));
              } catch (err: any) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(
                  JSON.stringify({
                    success: false,
                    message:
                      'Dữ liệu gửi không hợp lệ (JSON parse error): ' +
                      err.message,
                  })
                );
              }
            });
          } catch (e: any) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(
              JSON.stringify({
                success: false,
                message: 'Lỗi hệ thống khi gửi email: ' + e.message,
              })
            );
          }
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), emailApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
