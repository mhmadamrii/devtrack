import { type RouterOutputs } from '~/trpc/react';

export type ProjectDetailsType =
  RouterOutputs['project']['getDetailProjectById'];

export type AllProjectType = RouterOutputs['project']['getAllProjects'];
