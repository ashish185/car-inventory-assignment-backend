import axios from 'axios';
import { VehicleMakeRepository } from './vehicle-make.repository';
import { parseAllMakes, parseVehicleTypes } from './vehicle-make.transform';
import { VehicleMake } from './vehicle-make.types';
import { NetworkError } from '../../common/errors/app-error';
import { childLogger } from '../../config/logger';
import { config } from '../../config/config';

const log = childLogger('ingestion-service');

export interface IngestionResult {
  totalMakes: number;
  succeeded: number;
  failed: number;
  failures: Array<{ makeId: string; makeName: string; reason: string }>;
}

export class IngestionService {
  constructor(
    private readonly repository: VehicleMakeRepository = new VehicleMakeRepository(),
    private readonly persistBatchSize: number = config.nhtsa.ingestionPersistBatchSize,
    private readonly skipExistingMakes: boolean = config.nhtsa.skipExistingMakes,
  ) {}

  async run(): Promise<IngestionResult> {
    const allMakesXml = await this.fetchXml(`${config.nhtsa.baseUrl}/getallmakes?format=XML`);
    let bareMakes = parseAllMakes(allMakesXml);

    if (this.skipExistingMakes) {
      const existingMakeIds = await this.repository.findAllMakeIds();
      bareMakes = bareMakes.filter((make) => !existingMakeIds.has(make.makeId));
    }

    log.info(`Ingesting ${bareMakes.length} makes`);

    const result: IngestionResult = {
      totalMakes: bareMakes.length,
      succeeded: 0,
      failed: 0,
      failures: [],
    };

    const totalBatches = Math.ceil(bareMakes.length / this.persistBatchSize);

    for (let chunkStart = 0; chunkStart < bareMakes.length; chunkStart += this.persistBatchSize) {
      const batchNumber = chunkStart / this.persistBatchSize + 1;
      const chunk = bareMakes.slice(chunkStart, chunkStart + this.persistBatchSize);
      const resolvedChunk: VehicleMake[] = [];

      log.info(`Executing batch ${batchNumber}/${totalBatches} (${chunk.length} makes)`);

      for (const make of chunk) {
        try {
          const typesXml = await this.fetchXml(
            `${config.nhtsa.baseUrl}/GetVehicleTypesForMakeId/${make.makeId}?format=xml`,
          );
          console.log("url", `${config.nhtsa.baseUrl}/GetVehicleTypesForMakeId/${make.makeId}?format=xml`)
          const vehicleTypes = parseVehicleTypes(typesXml, make.makeId);
          resolvedChunk.push({ makeId: make.makeId, makeName: make.makeName, vehicleTypes });
          result.succeeded += 1;
        } catch (error) {
          result.failed += 1;
          const reason = error instanceof Error ? error.message : String(error);
          result.failures.push({ makeId: make.makeId, makeName: make.makeName, reason });
          log.warn(`Failed to ingest ${make.makeName} (${make.makeId}): ${reason}`);
        }
      }

      if (resolvedChunk.length > 0) {
        await this.repository.upsertMany(resolvedChunk);
      }

      log.info(`Batch ${batchNumber}/${totalBatches} complete`);
    }

    log.info(`Ingestion done: ${result.succeeded} succeeded, ${result.failed} failed`);

    return result;
  }

  private async fetchXml(url: string): Promise<string> {
    try {
      const response = await axios.get<string>(url, {
        timeout: config.nhtsa.requestTimeoutMs,
        responseType: 'text',
      });
      return response.data;
    } catch (error) {
      throw new NetworkError(`Failed to fetch ${url}`, url, error);
    }
  }
}
