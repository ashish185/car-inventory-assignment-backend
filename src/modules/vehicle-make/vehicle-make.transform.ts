import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { TransformationError, XmlParseError } from '../../common/errors/app-error';
import {
  RawGetAllMakesResponse,
  RawMakeEntry,
  RawVehicleTypeEntry,
  RawVehicleTypesResponse,
  VehicleMake,
  VehicleType,
} from './vehicle-make.types';

const xmlParser = new XMLParser({
  ignoreAttributes: true,
  trimValues: true,
});

/** fast-xml-parser omits arrays of length 1, normalize to always return an array. */
function toArray(value: any): any[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function parseXml<T>(xml: string, source: string): T {
  if (!xml || !xml.trim()) {
    throw new XmlParseError(`Received empty XML payload from ${source}`, source);
  }

  const validation = XMLValidator.validate(xml);
  if (validation !== true) {
    throw new XmlParseError(
      `Malformed XML from ${source}: ${validation.err.msg}`,
      source,
      validation.err,
    );
  }

  try {
    return xmlParser.parse(xml) as T;
  } catch (error) {
    throw new XmlParseError(`Failed to parse XML from ${source}`, source, error);
  }
}

export function parseAllMakes(xml: string): Array<Pick<VehicleMake, 'makeId' | 'makeName'>> {
  const parsed = parseXml<RawGetAllMakesResponse>(xml, 'getallmakes');
  const entries: RawMakeEntry[] = toArray(parsed.Response?.Results?.AllVehicleMakes);

  try {
    return entries.map((entry) => ({
      makeId: String(entry.Make_ID),
      makeName: String(entry.Make_Name),
    }));
  } catch (error) {
    throw new TransformationError('Failed to transform getallmakes results', error);
  }
}

export function parseVehicleTypes(xml: string, makeId: string): VehicleType[] {
  const parsed = parseXml<RawVehicleTypesResponse>(xml, `GetVehicleTypesForMakeId/${makeId}`);
  const entries: RawVehicleTypeEntry[] = toArray(parsed.Response?.Results?.VehicleTypesForMakeIds);

  try {
    return entries.map((entry) => ({
      typeId: String(entry.VehicleTypeId),
      typeName: String(entry.VehicleTypeName),
    }));
  } catch (error) {
    throw new TransformationError(
      `Failed to transform vehicle types for make ${makeId}`,
      error,
    );
  }
}
