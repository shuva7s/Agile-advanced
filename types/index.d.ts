declare type CreateProjectParams = {
  projectName: string;
  projectDescription: string;
  members: Types.ObjectId[];
  joinRequests: Types.ObjectId[];

  requirements: ITask[];
  designing: ITask[];
  pending_designing: ITask[];
  development: ITask[];
  pending_development: ITask[];
  testing: ITask[];
  pending_testing: ITask[];
  deployment: ITask[];
  pending_deployment: ITask[];
  done: ITask[];

  timeSlice: number;
  hasStarted: boolean;
  hasCompleted: boolean;
  dayCount: number;
  createdAt: Date;
  updatedAt: Date;
};
