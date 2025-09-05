export class OrderBy {
  constructor(readonly value: string) {}

  toString(): string {
    return this.value;
  }
}
