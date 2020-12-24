import { AddressInfo } from 'net';
import * as Express from 'express';
import * as bodyParser from 'body-parser';

import { IAppConfig, IRoute } from '@interfaces/app.interfaces';

import './redis.lib';


export async function start(config: IAppConfig): Promise<void> {
  const app = Express();

  app.use(bodyParser.json({ limit: '4mb' }));
  app.use(bodyParser.urlencoded({ limit: '4mb', extended: true }));

  config.files.routes.forEach((path) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { route } = require(path) as { route: IRoute };
    app.use(route.prefix, route.r);
  });

  const server = app.listen(config.app.port, config.app.host, () => {
    const { address, port } = server.address() as AddressInfo;
    console.info('server started at http://%s:%s/', address, port);
  });
}
