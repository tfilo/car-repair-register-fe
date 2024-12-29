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
 * @interface CustomerCreate
 */
export interface CustomerCreate {
    /**
     * 
     * @type {string}
     * @memberof CustomerCreate
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof CustomerCreate
     */
    surname: string | null;
    /**
     * 
     * @type {string}
     * @memberof CustomerCreate
     */
    mobile: string | null;
    /**
     * 
     * @type {string}
     * @memberof CustomerCreate
     */
    email: string | null;
}

/**
 * Check if a given object implements the CustomerCreate interface.
 */
export function instanceOfCustomerCreate(value: object): value is CustomerCreate {
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('surname' in value) || value['surname'] === undefined) return false;
    if (!('mobile' in value) || value['mobile'] === undefined) return false;
    if (!('email' in value) || value['email'] === undefined) return false;
    return true;
}

export function CustomerCreateFromJSON(json: any): CustomerCreate {
    return CustomerCreateFromJSONTyped(json, false);
}

export function CustomerCreateFromJSONTyped(json: any, ignoreDiscriminator: boolean): CustomerCreate {
    if (json == null) {
        return json;
    }
    return {
        
        'name': json['name'],
        'surname': json['surname'],
        'mobile': json['mobile'],
        'email': json['email'],
    };
}

  export function CustomerCreateToJSON(json: any): CustomerCreate {
      return CustomerCreateToJSONTyped(json, false);
  }

  export function CustomerCreateToJSONTyped(value?: CustomerCreate | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'name': value['name'],
        'surname': value['surname'],
        'mobile': value['mobile'],
        'email': value['email'],
    };
}

