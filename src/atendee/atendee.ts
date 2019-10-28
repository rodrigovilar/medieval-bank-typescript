export class Atendee {
  public id: number = 0;
  public name: string = '';
  public date: Date | undefined;

  setCreation(date: Date) {
    throw new Error("Method not implemented.");
  }

  getCreation(): Date {
    throw new Error("Method not implemented.");
  }
}