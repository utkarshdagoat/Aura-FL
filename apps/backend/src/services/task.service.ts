import { Service } from 'typedi';
import { PrismaClient } from '@prisma/client';
import { ClientDataDTO, CreateTaskDTO } from '@/dtos/task.dto';
@Service()
export class TaskService {
    public task = new PrismaClient().task;
    public client = new PrismaClient().client;

    public async createTask(data: CreateTaskDTO) {
        const res = await this.task.create({
            data: {
                title: data.name,
                onChainId: data.onChainId
            }
        });
        return res;
    }

    public async addClientToTask(taskId: number, clientData: ClientDataDTO) {
        const res = await this.client.create({
            data: {
                taskId: taskId,
                address: clientData.address,
            }
        });
        return res;
    }

    public async addWeightsAndBiasToClient(taskId: number, weights: bigint[], bias: bigint[], client: string) {
        const res = await this.client.update({
            where: {
                address_taskId: {
                    address: client,
                    taskId: taskId
                }
            },
            data: {
                weight: weights,
                bias: bias
            }
        });
        return res;
    }

    public async getWeightsAndBiasForATask(taskId: number) : Promise<bigint[][][]> {
        const res = await this.client.findMany({
            where: {
                taskId: taskId
            }
        });
        const weights = res.map((client)=>{
            return client.weight
        })
        const bias = res.map((client)=>{
            return client.bias
        })
        return [weights, bias]
    }

    public async getAllTasks() {
        const res = await this.task.findMany();
        return res;
    }
}