// https://github.com/vitejs/vite/discussions/3448
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';

// ----------------------------------------------------------------------

// export default defineConfig({
//   plugins: [react(), jsconfigPaths()],
//   // https://github.com/jpuri/react-draft-wysiwyg/issues/1317
//   base: '/', // accessing env variable is not possible here. So hard coding this.
//   define: {
//     global: 'window'
//   },
//   resolve: {
//     alias: [
//       {
//         find: /^~(.+)/,
//         replacement: path.join(process.cwd(), 'node_modules/$1')
//       },
//       {
//         find: /^src(.+)/,
//         replacement: path.join(process.cwd(), 'src/$1')
//       }
//     ]
//   },
//   server: {
//     // this ensures that the browser opens upon server start
//     open: true,
//     // this sets a default port to 3000
//     port: 3002,
//     proxy: {
//       '/api': import.meta.env.VITE_API_URL
//     }
//   },
//   preview: {
//     // this ensures that the browser opens upon preview start
//     open: true,
//     // this sets a default port to 3000
//     port: 3002
//   }
// });



export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  
  return {
    plugins: [react(), jsconfigPaths()],
    // https://github.com/jpuri/react-draft-wysiwyg/issues/1317
    base: '/', // accessing env variable is not possible here. So hard coding this.
    define: {
      global: 'window'
    },
    resolve: {
      alias: [
        {
          find: /^~(.+)/,
          replacement: path.join(process.cwd(), 'node_modules/$1')
        },
        {
          find: /^src(.+)/,
          replacement: path.join(process.cwd(), 'src/$1')
        }
      ]
    },
    server: {
      // this ensures that the browser opens upon server start
      open: true,
      // this sets a default port to 3000
      port: env.VITE_PORT ?? 3000,
      proxy: {
        '/api': env.VITE_API_URL
      }
    },
    preview: {
      // this ensures that the browser opens upon preview start
      open: true,
      // this sets a default port to 3000
      port: env.VITE_PORT ?? 3000,
      proxy: {
        '/api': env.VITE_API_URL
      }
    }
  };
});
