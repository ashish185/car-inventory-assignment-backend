export interface VehicleType {
  typeId: string;
  typeName: string;
}

export interface VehicleMake {
  makeId: string;
  makeName: string;
  vehicleTypes: VehicleType[];
}

/** Raw shape of a single <AllVehicleMakes> entry after XML parsing. */
export interface RawMakeEntry {
  Make_ID: string | number;
  Make_Name: string;
}

/** Raw shape of the getallmakes response after XML parsing. */
export interface RawGetAllMakesResponse {
  Response?: {
    Results?: {
      AllVehicleMakes?: RawMakeEntry | RawMakeEntry[];
    };
  };
}

/** Raw shape of a single <VehicleTypesForMakeIds> entry after XML parsing. */
export interface RawVehicleTypeEntry {
  VehicleTypeId: string | number;
  VehicleTypeName: string;
}

/** Raw shape of the GetVehicleTypesForMakeId response after XML parsing. */
export interface RawVehicleTypesResponse {
  Response?: {
    Results?: {
      VehicleTypesForMakeIds?: RawVehicleTypeEntry | RawVehicleTypeEntry[];
    };
  };
}
