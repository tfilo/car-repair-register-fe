/* tslint:disable */
/* eslint-disable */
/**
 * Car Repair Register API
 * Evidence of customers and vehicles for small workshops.
 *
 * The version of the OpenAPI document: 1.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface RepairLogCreate
 */
export interface RepairLogCreate {
    /**
     * 
     * @type {string}
     * @memberof RepairLogCreate
     */
    content: string;
    /**
     * 
     * @type {number}
     * @memberof RepairLogCreate
     */
    vehicleId: number;
    /**
     * 
     * @type {number}
     * @memberof RepairLogCreate
     */
    odometer: number | null;
    /**
     * 
     * @type {string}
     * @memberof RepairLogCreate
     */
    repairDate: string;
}

/**
 * Check if a given object implements the RepairLogCreate interface.
 */
export function instanceOfRepairLogCreate(value: object): value is RepairLogCreate {
    if (!('content' in value) || value['content'] === undefined) return false;
    if (!('vehicleId' in value) || value['vehicleId'] === undefined) return false;
    if (!('odometer' in value) || value['odometer'] === undefined) return false;
    if (!('repairDate' in value) || value['repairDate'] === undefined) return false;
    return true;
}

export function RepairLogCreateFromJSON(json: any): RepairLogCreate {
    return RepairLogCreateFromJSONTyped(json, false);
}

export function RepairLogCreateFromJSONTyped(json: any, ignoreDiscriminator: boolean): RepairLogCreate {
    if (json == null) {
        return json;
    }
    return {
        
        'content': json['content'],
        'vehicleId': json['vehicleId'],
        'odometer': json['odometer'],
        'repairDate': json['repairDate'],
    };
}

  export function RepairLogCreateToJSON(json: any): RepairLogCreate {
      return RepairLogCreateToJSONTyped(json, false);
  }

  export function RepairLogCreateToJSONTyped(value?: RepairLogCreate | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'content': value['content'],
        'vehicleId': value['vehicleId'],
        'odometer': value['odometer'],
        'repairDate': value['repairDate'],
    };
}

