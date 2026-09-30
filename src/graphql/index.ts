import { vehicleMakeResolvers } from '../modules/vehicle-make/vehicle-make.resolver';

export function createResolvers() {
  return vehicleMakeResolvers;
}

export { GraphQLContext, buildContext } from './context';
