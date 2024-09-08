import { TaskService } from "@/services/task.service";
import { Request, Response } from "express";
import { unlink, writeFile } from "fs";
import path from "path";
import {LayerProof} from '../../../../packages/chain/src/runtime/zkPrograms/layer'
export class TaskController {
    public taskService = new TaskService();

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
            const weight = data[0]
            const bias = data[1]
            const NUM_CLIENTS = weight.length
            const aggregateWeights: bigint[] = []


            for (let i = 0; i < NUM_CLIENTS; i++) {
                let sum = BigInt(0)
                for (let j = 0; j < weight[i].length; j++) {
                    sum += weight[i][j]
                }
                sum = sum / BigInt(NUM_CLIENTS)
                aggregateWeights.push(sum)
            }

            const aggregateBias: bigint[] = []

            for (let i = 0; i < bias.length; i++) {
                let sum = BigInt(0)
                for (let j = 0; j < bias[i].length; j++) {
                    sum += bias[i][j]
                }
                sum = sum / BigInt(NUM_CLIENTS)
                aggregateBias.push(sum)
            }
            const weightsAndBiases = {
                weights: aggregateWeights,
                bias: aggregateBias
            }
            const filePath = path.join(__dirname, `${taskId}.json`)
            writeFile(filePath, JSON.stringify(weightsAndBiases, null, 2), (err) => {
                if (err) {
                    console.error('Error writing JSON file:', err);
                    res.status(500).send('Internal Server Error');
                    return;
                }
            })
            res.download(filePath, 'params.json', (downloadErr) => {
                if (downloadErr) {
                    console.error('Error sending the file:', downloadErr);
                    res.status(500).send('Cannot send modelfiel');
                }
                unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Error deleting the file:', unlinkErr);
                    }
                });
            });

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


}