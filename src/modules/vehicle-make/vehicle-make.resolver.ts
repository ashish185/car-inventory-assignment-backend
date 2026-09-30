import { VehicleMakeRepository } from './vehicle-make.repository';
import { VehicleMake } from './vehicle-make.types';

export interface VehicleMakeContext {
  repository: VehicleMakeRepository;
}

export const vehicleMakeResolvers = {
  Query: {
    vehicleMakes: async (
      _parent: unknown,
      args: { makeNameContains?: string },
      context: VehicleMakeContext,
    ): Promise<VehicleMake[]> => {
      const makes = await context.repository.findAll();

      if (!args.makeNameContains) {
        return makes;
      }

      const needle = args.makeNameContains.toLowerCase();
      return makes.filter((make) => make.makeName.toLowerCase().includes(needle));
    },

    vehicleMake: async (
      _parent: unknown,
      args: { makeId: string },
      context: VehicleMakeContext,
    ): Promise<VehicleMake | null> => {
      return context.repository.findByMakeId(args.makeId);
    },
  },
};
