/* tslint:disable */
/* eslint-disable */
/**
 * Car Repair Register API
 * Evidence of customers and vehicles for small workshops.
 *
 * The version of the OpenAPI document: 0.0.1-SNAPSHOT
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
 * @interface FieldError
 */
export interface FieldError {
    /**
     * 
     * @type {string}
     * @memberof FieldError
     */
    fieldName: string;
    /**
     * 
     * @type {string}
     * @memberof FieldError
     */
    errorMessage: string;
}

/**
 * Check if a given object implements the FieldError interface.
 */
export function instanceOfFieldError(value: object): value is FieldError {
    if (!('fieldName' in value) || value['fieldName'] === undefined) return false;
    if (!('errorMessage' in value) || value['errorMessage'] === undefined) return false;
    return true;
}

export function FieldErrorFromJSON(json: any): FieldError {
    return FieldErrorFromJSONTyped(json, false);
}

export function FieldErrorFromJSONTyped(json: any, ignoreDiscriminator: boolean): FieldError {
    if (json == null) {
        return json;
    }
    return {
        
        'fieldName': json['fieldName'],
        'errorMessage': json['errorMessage'],
    };
}

  export function FieldErrorToJSON(json: any): FieldError {
      return FieldErrorToJSONTyped(json, false);
  }

  export function FieldErrorToJSONTyped(value?: FieldError | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'fieldName': value['fieldName'],
        'errorMessage': value['errorMessage'],
    };
}

