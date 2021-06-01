import { Router } from 'express';
import storiesRoute from './routes/stories';

export default () => {
  const app = Router();
  storiesRoute(app);
  return app;
};
