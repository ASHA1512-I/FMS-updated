import { app } from './app';
import { config } from './config';

app.listen(config.port, config.host, () => {
  console.log(`Farm Manager API running on http://${config.host}:${config.port}`);
});
