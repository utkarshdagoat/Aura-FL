import { TaskService } from "@/services/task.service";
import { Request, Response } from "express";
import { unlink, writeFile } from "fs";
import path from "path";
import {LayerProof} from '../../../../packages/chain/src/runtime/zkPrograms/layer'
import { LOG_DIR } from "@/config";
export class TaskController {
    public taskService = new TaskService();

    constructor(){
        this.createTask = this.createTask.bind(this);
        this.addClientToTask = this.addClientToTask.bind(this);
        this.addWeightsAndBiasToClient = this.addWeightsAndBiasToClient.bind(this);
        this.aggregateWeightsAndBias = this.aggregateWeightsAndBias.bind(this);
        this.getTasks = this.getTasks.bind(this);
        this.getClientsForTask = this.getClientsForTask.bind(this);
    }

    public async createTask(req: Request, res: Response) {
        try {
            const data = req.body;
            const task = await this.taskService.createTask(data);
            res.status(200).json({ data: task, message: 'task created' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    public async addClientToTask(req: Request, res: Response) {
        try {
            const taskId = req.params.id;
            const data = req.body;
            const client = await this.taskService.addClientToTask(parseInt(taskId), data);
            res.status(200).json({ data: client, message: 'client added to task' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    public async addWeightsAndBiasToClient(req: Request, res: Response) {
        try {
            const taskId = req.params.id;
            const client = req.params.client;
            const data = req.body;
            console.log(data)
            const clientData = await this.taskService.addWeightsAndBiasToClient(parseInt(taskId), data.weights, data.bias, client);
            res.status(200).json({ data: clientData, message: 'weights and bias added to client' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    public async aggregateWeightsAndBias(req: Request, res: Response) {
        try {
            const taskId = req.params.id;
            const data = await this.taskService.getWeightsAndBiasForATask(parseInt(taskId));
            console.log(data)
            const weight = data[0]
            const bias = data[1]
            const NUM_CLIENTS = weight.length

            const sumArray :number[]= Array(weight[0].length).fill(0);
            weight.forEach(arr => {
              arr.forEach((value, index) => {
                sumArray[index] += value;
              });
            });
          
            const aggregateWeights= sumArray.map(sum => sum / weight.length);

            let aggregateBias: number[] = []
 
            const sumArray2 = new Array(NUM_CLIENTS).fill(0);
            weight.forEach(arr => {
              arr.forEach((value, index) => {
                sumArray[index] += value;
              });
            });           
            aggregateBias = sumArray2.map(sum => sum / bias.length);
           
            const weightsAndBiases = {
                weights: aggregateWeights,
                bias: aggregateBias
            }
            res.json(weightsAndBiases)

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    public async getTasks(req: Request, res: Response) {
        try {
            const tasks = await this.taskService.getAllTasks();
            res.status(200).json({ data: tasks });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    public async getClientsForTask(req: Request, res: Response) {
        try {
            const taskId = req.params.id;
            const clients = await this.taskService.getClientsForTask(parseInt(taskId));
            res.status(200).json({ data: clients });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }


}