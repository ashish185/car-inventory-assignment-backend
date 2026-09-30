import { PersistenceError } from '../../common/errors/app-error';
import { VehicleMake } from './vehicle-make.types';
import { VehicleMakeModel } from './vehicle-make.model';

export class VehicleMakeRepository {
  // Upserts by makeId so repeated ingestion runs are idempotent.
  async upsertMany(makes: VehicleMake[]): Promise<void> {
    if (makes.length === 0) return;

    try {
      const operations = makes.map((make) => ({
        updateOne: {
          filter: { makeId: make.makeId },
          update: { $set: make },
          upsert: true,
        },
      }));

      await VehicleMakeModel.bulkWrite(operations, { ordered: false });
    } catch (error) {
      throw new PersistenceError('Failed to persist vehicle makes', error);
    }
  }

  async findAll(): Promise<VehicleMake[]> {
    try {
      const docs = await VehicleMakeModel.find().sort({ makeName: 1 }).lean();
      return docs.map((doc) => ({
        makeId: doc.makeId,
        makeName: doc.makeName,
        vehicleTypes: doc.vehicleTypes,
      }));
    } catch (error) {
      throw new PersistenceError('Failed to read vehicle makes', error);
    }
  }

  async findByMakeId(makeId: string): Promise<VehicleMake | null> {
    try {
      const doc = await VehicleMakeModel.findOne({ makeId }).lean();
      if (!doc) return null;
      return {
        makeId: doc.makeId,
        makeName: doc.makeName,
        vehicleTypes: doc.vehicleTypes,
      };
    } catch (error) {
      throw new PersistenceError(`Failed to read vehicle make ${makeId}`, error);
    }
  }

  async count(): Promise<number> {
    try {
      return await VehicleMakeModel.countDocuments();
    } catch (error) {
      throw new PersistenceError('Failed to count vehicle makes', error);
    }
  }

  async findAllMakeIds(): Promise<Set<string>> {
    try {
      const ids = await VehicleMakeModel.distinct('makeId');
      return new Set(ids);
    } catch (error) {
      throw new PersistenceError('Failed to read persisted makeIds', error);
    }
  }
}
