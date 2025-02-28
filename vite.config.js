import { defineConfig } from 'vite'
import { resolve } from 'path'
import vitePluginPugI18n from 'vite-plugin-pug-i18n'
import vitePluginGenerateIndex from './vite-plugin-generate-index'
import dateformat from './dateformat'

export default defineConfig({
    resolve: {
        alias: {
            '~': resolve(__dirname, './node_modules'),
            '@': resolve(__dirname, './src'),
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
            locals: {
                "moment": dateformat
            },
            options: {
                "pretty": process.env.NODE_ENV === "development"
            },
        }),
        vitePluginGenerateIndex()
    ],
    build: {
        rollupOptions: {
            output: {
                chunkFileNames: 'assets/main-[hash].js'
            }
        }
    }
})