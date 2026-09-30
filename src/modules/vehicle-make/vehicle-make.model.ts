import { Schema, model, Document } from 'mongoose';
import { VehicleMake, VehicleType } from './vehicle-make.types';

export type VehicleMakeDocument = VehicleMake & Document;

const VehicleTypeSchema = new Schema<VehicleType>(
  {
    typeId: { type: String, required: true },
    typeName: { type: String, required: true },
  },
  { _id: false },
);

const VehicleMakeSchema = new Schema<VehicleMake>(
  {
    makeId: { type: String, required: true, unique: true, index: true },
    makeName: { type: String, required: true },
    vehicleTypes: { type: [VehicleTypeSchema], default: [] },
  },
  { timestamps: true },
);

export const VehicleMakeModel = model<VehicleMake>('VehicleMake', VehicleMakeSchema);
