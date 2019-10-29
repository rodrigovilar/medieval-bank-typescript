export class Atendee {
  public id: number = 0;
  public name: string = '';
  public date: Date | undefined;
  public email: string = '';

  setCreation(date: Date) {
    throw new Error("Method not implemented.");
  }

  getCreation(): Date {
    throw new Error("Method not implemented.");
  }
}