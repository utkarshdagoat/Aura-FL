export const BACKEND = 'http://localhost:9090/api/'
export const CREATE_TASK = `${BACKEND}task`
export const ADD_CLIENT = (id:number) => `${BACKEND}task/${id}/client`
export const ADD_WEIGHTS_BIASES = (id:number,client:string) => `${BACKEND}task/${id}/client/${client}`
export const AGGREGATE = (id:number) => `${BACKEND}task/${id}/aggregate`
export const GETALLTASKS = `${BACKEND}tasks`
export const GETCLIENTS = (id:number) => `${BACKEND}task/${id}/clients`