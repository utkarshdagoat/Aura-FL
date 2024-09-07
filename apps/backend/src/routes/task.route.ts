import { Router } from 'express';
import { TaskController } from '@/controllers/task.controller';
import { ValidationMiddleware } from '@/middleware/validation.middleware';
import { ClientDataDTO, CreateTaskDTO } from '@/dtos/task.dto';
import { Routes } from '@/interfaces/route.interface';
export class TaskRoutes implements Routes {
    public path = '/api/';
    public router = Router();
    public task = new TaskController();


    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/task`, ValidationMiddleware(CreateTaskDTO), this.task.createTask);
        this.router.post(`${this.path}/task/:id/client`, ValidationMiddleware(ClientDataDTO), this.task.addClientToTask);
        this.router.post(`${this.path}/task/:id/client/:client`, this.task.addWeightsAndBiasToClient)
    }
}