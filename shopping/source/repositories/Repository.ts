import { cwd } from 'node:process';
import { accessSync, writeFileSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';

export interface Attributes {
  id: number;
}

export class Repository<T extends Attributes> {
  protected filePath: string;
  constructor(protected fileName: string) {
    this.filePath = `${cwd()}/database/${fileName}`;
    try {
      accessSync(this.filePath);
    } catch (err) {
      writeFileSync(this.filePath, '[]');
    }
  }

  /* Read */
  async getAll(): Promise<T[]> {
    return JSON.parse(
      await readFile(this.filePath, { encoding: 'utf8' })
    ) as T[];
  }

  async getById(id: number): Promise<T | undefined> {
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }

  async filter(attributes: Partial<T> & Record<string, unknown>): Promise<T[]> {
    let records = (await this.getAll()) as (T & Record<string, unknown>)[];
    Object.keys(attributes).forEach((key) => {
      records = records.filter((record) => record[key] === attributes[key]);
    });
    return records;
  }

  /* Write */
  async create(attributes: Omit<T, 'id'>): Promise<T> {
    const records = await this.getAll();
    const id = this.generateId(records);
    const record = { ...attributes, id } as T;

    records.push(record);
    await this.commit(records);
    return record;
  }

  async delete(id: number): Promise<void> {
    const records = await this.getAll();
    await this.commit(records.filter((record) => record.id !== id));
  }

  async update(attributes: Partial<T> & Pick<T, 'id'>): Promise<void> {
    const records = await this.getAll();
    const record = records.find((record) => record.id === attributes.id);
    if (!record)
      throw new Error(
        `Can not find a record with provided ID: ${attributes.id}`
      );
    Object.assign(record, attributes);
    await this.commit(records);
  }

  /* Helpers */
  generateId(records: T[]): number {
    if (!records.length) return 1;
    return records[records.length - 1].id + 1;
  }

  async commit(records: T[]): Promise<void> {
    return writeFile(this.filePath, JSON.stringify(records, null, 2), {
      encoding: 'utf8',
    });
  }
}
