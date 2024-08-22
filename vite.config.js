import { defineConfig } from 'vite'
import { resolve } from 'path'
import vitePluginPugI18n from 'vite-plugin-pug-i18n'

export default defineConfig({
    //base: './', // running the website inside a sub directory
    resolve: {
        alias: {
            '~': resolve(__dirname, './node_modules')
        }
    },
    preview: {
        host: "0.0.0.0",
        port: 8000
    },
    plugins: [
        vitePluginPugI18n({
            pages: {
                baseDir: resolve(__dirname, 'src/pages')
            },
            //langs: {
            //    baseDir: resolve(__dirname, 'src/language')
            //},
            locals: {},
            options: {},
        })
    ],
    build: {
        rollupOptions: {
            output: {
                assetFileNames: 'assets/main-[hash][extname]',
                entryFileNames: 'assets/main-[hash].js'
            }
        }
    }
});