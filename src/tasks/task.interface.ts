export interface BaseTask {
  name: string;
  price: number;
  description: string;
  image: string;
}

export interface Task extends BaseTask {
  id: number;
}
