import { VehicleMakeRepository } from '../modules/vehicle-make/vehicle-make.repository';

export interface GraphQLContext {
  repository: VehicleMakeRepository;
}

export function buildContext(): GraphQLContext {
  return { repository: new VehicleMakeRepository() };
}
