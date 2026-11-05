import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/',
  base: './',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        cart: resolve(__dirname, 'src/cart/index.html'),
        checkout: resolve(__dirname, 'src/checkout/index.html'),
        product: resolve(__dirname, 'src/product_pages/index.html'),
        productListing: resolve(__dirname, 'src/product_listing/index.html'),
        search: resolve(__dirname, 'src/search/search-index.html'),
        checkoutSuccess: resolve(__dirname, 'src/checkout/success.html'),
        marmotAjax: resolve(__dirname, 'src/product_pages/marmot-ajax-3.html'),
        northfaceTalus: resolve(__dirname, 'src/product_pages/northface-talus-4.html'),
        northfaceAlpine: resolve(__dirname, 'src/product_pages/northface-alpine-3.html'),
        cedarRidge: resolve(__dirname, 'src/product_pages/cedar-ridge-rimrock-2.html'),
      },
    },
  },
});
