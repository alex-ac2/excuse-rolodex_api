import { Router, Request, Response } from 'express';
import ExcuseService from '../../services/excuseService';

const route = Router();

export default (app) => {
  app.use('/excuses', route);

  route.get('/', async (req, res) => {
    const allExcuses = await ExcuseService.getAllExcuses();
    
    return res.json(allExcuses).status(200);
  });

  route.get('/:category', async (req, res) => {
    console.log('Request params: ', req.params);

    const excuseObject = await ExcuseService.getExcusesByCategory(req.params.category);

    if (excuseObject.excuse === null) {
      return res.json(excuseObject.statusMessage).status(200);
    }
    
    return res.json(excuseObject.excuse).status(200);
  })

  route.post('/', async (req, res) => {
    const excuseBody = req.body.excuse;
    // console.log(req.body);

    const excuseObject = await ExcuseService.createExcuse(excuseBody).catch((err) => {
      if (err) {
        console.log('CreateExcuse error: ', err);
      }
    });
    
    // if (excuseObject.added) {
    //   return res.json(excuseObject.statusMessage).status(200);
    // } else {
      // }
      
    return res.json(excuseObject.statusMessage).status(200);
  });
 
}
