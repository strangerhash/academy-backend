process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import 'dotenv/config';
import App from '@/app';


validateEnv();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = new App([
  

]);

app.listen();
