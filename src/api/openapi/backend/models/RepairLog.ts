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
import type { Vehicle } from './Vehicle';
import {
    VehicleFromJSON,
    VehicleFromJSONTyped,
    VehicleToJSON,
    VehicleToJSONTyped,
} from './Vehicle';
import type { Attachment } from './Attachment';
import {
    AttachmentFromJSON,
    AttachmentFromJSONTyped,
    AttachmentToJSON,
    AttachmentToJSONTyped,
} from './Attachment';

/**
 * 
 * @export
 * @interface RepairLog
 */
export interface RepairLog {
    /**
     * 
     * @type {number}
     * @memberof RepairLog
     */
    id: number;
    /**
     * 
     * @type {string}
     * @memberof RepairLog
     */
    content: string;
    /**
     * 
     * @type {Vehicle}
     * @memberof RepairLog
     */
    vehicle: Vehicle;
    /**
     * 
     * @type {string}
     * @memberof RepairLog
     */
    repairDate: string;
    /**
     * 
     * @type {number}
     * @memberof RepairLog
     */
    odometer: number | null;
    /**
     * 
     * @type {Array<Attachment>}
     * @memberof RepairLog
     */
    attachments: Array<Attachment>;
    /**
     * 
     * @type {string}
     * @memberof RepairLog
     */
    created: string;
    /**
     * 
     * @type {string}
     * @memberof RepairLog
     */
    modified: string | null;
}

/**
 * Check if a given object implements the RepairLog interface.
 */
export function instanceOfRepairLog(value: object): value is RepairLog {
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('content' in value) || value['content'] === undefined) return false;
    if (!('vehicle' in value) || value['vehicle'] === undefined) return false;
    if (!('repairDate' in value) || value['repairDate'] === undefined) return false;
    if (!('odometer' in value) || value['odometer'] === undefined) return false;
    if (!('attachments' in value) || value['attachments'] === undefined) return false;
    if (!('created' in value) || value['created'] === undefined) return false;
    if (!('modified' in value) || value['modified'] === undefined) return false;
    return true;
}

export function RepairLogFromJSON(json: any): RepairLog {
    return RepairLogFromJSONTyped(json, false);
}

export function RepairLogFromJSONTyped(json: any, ignoreDiscriminator: boolean): RepairLog {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'],
        'content': json['content'],
        'vehicle': VehicleFromJSON(json['vehicle']),
        'repairDate': json['repairDate'],
        'odometer': json['odometer'],
        'attachments': ((json['attachments'] as Array<any>).map(AttachmentFromJSON)),
        'created': json['created'],
        'modified': json['modified'],
    };
}

  export function RepairLogToJSON(json: any): RepairLog {
      return RepairLogToJSONTyped(json, false);
  }

  export function RepairLogToJSONTyped(value?: RepairLog | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'id': value['id'],
        'content': value['content'],
        'vehicle': VehicleToJSON(value['vehicle']),
        'repairDate': value['repairDate'],
        'odometer': value['odometer'],
        'attachments': ((value['attachments'] as Array<any>).map(AttachmentToJSON)),
        'created': value['created'],
        'modified': value['modified'],
    };
}

