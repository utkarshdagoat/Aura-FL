import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import { TaskRoutes } from './routes/task.route';
ValidateEnv();

const app = new App([new TaskRoutes()]);
app.listen();
