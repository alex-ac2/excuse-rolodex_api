import { Router, Request, Response } from 'express';
import ExcuseService from '../../services/excuseService';

const route = Router();

export default (app) => {
  app.use('/excuse', route);

  route.get('/', async (req, res) => {
    const randomExcuse = await ExcuseService.getRandomExcuse();
    
    return res.send(randomExcuse).status(200);
  });
}
