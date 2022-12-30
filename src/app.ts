process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
// import DB from '@databases';
import * as mssql from '@/databases/mssql';
import * as localmssql from '@/databases/localmssql';
import Routes from '@interfaces/routes.interface';
import errorMiddleware from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import path from 'path';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import https from 'https';
import fs from 'fs';

class App {
  public app: express.Application;
  public port: string | number;
  public env: string;
  constructor(routes: Routes[]) {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.env = process.env.NODE_ENV || 'development';

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
    this.serveStaticContent();
  }
  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
 
  }

  public getServer() {
    return this.app;
  }
  private connectToLocalDatabase() {
    localmssql.localconnect();
  }
  private connectToDatabase() {
    // DB.sequelize.sync({ force: false });
    mssql.connect();
  }
  private initializeMiddlewares() {
    if (!process.env.localhost) {
      this.app.use((req, res, next) => {
        if (req.protocol == 'http') {
          return res.redirect('https://' + req.headers.host + req.url);
        }
        next();
      });
    }
    if (this.env === 'production') {
      // this.app.use(morgan('combined', { stream }));
      this.app.use(cors({ origin: true, credentials: true }));
    } else {
      // this.app.use(morgan('dev', { stream }));
      this.app.use(cors({ origin: true, credentials: true }));
    }
    this.app.use(hpp());
    // this.app.use(helmet());
    this.app.use(compression());
    
    // this.app.use(express.json());
    // this.app.use(express.urlencoded({ extended: true }));

    // this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.urlencoded({ extended: false }))

    this.app.use(bodyParser.json());
    this.app.use(fileUpload());
    this.app.use(cookieParser());
  }
  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/api', route.router);
    });
  }
  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };
    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }
  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
  private serveStaticContent() {
    this.app.use(express.static(path.join(__dirname, '../client/build')));
    this.app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });

    var htmlPath = path.join(__dirname, '../src/uploads');

    this.app.use(express.static(htmlPath));
  }
}
export default App;
