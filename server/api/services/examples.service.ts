import L from '../../common/logger';

let id = 0;
interface Example {
  id: number;
  name: string;
}

const examples: Example[] = [
  { id: id++, name: 'example 0' },
  { id: id++, name: 'example 1' },
];

export class ExamplesService {
  async all(): Promise<Example[]> {
    L.info(examples, 'fetch all examples');
    return await Promise.resolve(examples);
  }

  async byId(id: number): Promise<Example> {
    L.info(`fetch example with id ${id}`);
    return await this.all().then((r) => r[id]);
  }

  async create(name: string): Promise<Example> {
    L.info(`create example with name ${name}`);
    const example: Example = {
      id: id++,
      name,
    };
    examples.push(example);
    return await Promise.resolve(example);
  }
}

export default new ExamplesService();
