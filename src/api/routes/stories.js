import { Router } from 'express';
import { getLatestStories } from '../../services/storiesService';

const route = Router();

export default (app) => {
  app.use(route);

  route.get('/stories', async (req, res) => {
    const stories = await getLatestStories();
    res.setHeader('Content-Type', 'application/json');
    return res.json(stories);
  });

  route.get('/hello', async (req, res) => res.json('Hello'));
};
