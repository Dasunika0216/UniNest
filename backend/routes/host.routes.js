import { Router } from 'express';
import { getAllHosts , getHostById } from '../controllers/host.controller.js';
import authorize from '../middleware/auth.middleware.js';   


const hostRouter = Router();

hostRouter.get('/', getAllHosts);

hostRouter.get('/:id', authorize , getHostById);

hostRouter.post('/', (req,res) => res.send({'message': 'CREATE new host'}));

hostRouter.put('/:id', (req,res) => res.send({'message': `UPDATE host with id ${req.params.id}`}));

hostRouter.delete('/:id', (req,res) => res.send({'message': `DELETE host with id ${req.params.id}`}));  


export default hostRouter;