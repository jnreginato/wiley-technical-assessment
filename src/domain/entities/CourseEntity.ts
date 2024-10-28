export default class CourseEntity {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly duration: number,
    public readonly instructor: string,
    public readonly id?: number,
  ) {}
}
