import { loadHeaderFooter } from './utils.mjs';
await loadHeaderFooter();

import { getParam } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';
import ProductDetails from './ProductDetails.mjs';

const legacyProductIds = {
  'marmot-ajax-3.html': '880RR',
  'northface-talus-4.html': '985RF',
  'northface-alpine-3.html': '985PR',
  'cedar-ridge-rimrock-2.html': '344YJ',
};
const productId = getParam('product') || legacyProductIds[window.location.pathname.split('/').pop()];
const dataSource = new ExternalServices();

const product = new ProductDetails(productId, dataSource);
product.init();
