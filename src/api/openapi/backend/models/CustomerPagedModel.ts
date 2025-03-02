/* tslint:disable */
/* eslint-disable */
/**
 * Car Repair Register API
 * Evidence of customers and vehicles for small workshops.
 *
 * The version of the OpenAPI document: 1.1.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
import type { PageMetadata } from './PageMetadata';
import {
    PageMetadataFromJSON,
    PageMetadataFromJSONTyped,
    PageMetadataToJSON,
    PageMetadataToJSONTyped,
} from './PageMetadata';
import type { Customer } from './Customer';
import {
    CustomerFromJSON,
    CustomerFromJSONTyped,
    CustomerToJSON,
    CustomerToJSONTyped,
} from './Customer';

/**
 * 
 * @export
 * @interface CustomerPagedModel
 */
export interface CustomerPagedModel {
    /**
     * 
     * @type {Array<Customer>}
     * @memberof CustomerPagedModel
     */
    content?: Array<Customer>;
    /**
     * 
     * @type {PageMetadata}
     * @memberof CustomerPagedModel
     */
    page?: PageMetadata;
}

/**
 * Check if a given object implements the CustomerPagedModel interface.
 */
export function instanceOfCustomerPagedModel(value: object): value is CustomerPagedModel {
    return true;
}

export function CustomerPagedModelFromJSON(json: any): CustomerPagedModel {
    return CustomerPagedModelFromJSONTyped(json, false);
}

export function CustomerPagedModelFromJSONTyped(json: any, ignoreDiscriminator: boolean): CustomerPagedModel {
    if (json == null) {
        return json;
    }
    return {
        
        'content': json['content'] == null ? undefined : ((json['content'] as Array<any>).map(CustomerFromJSON)),
        'page': json['page'] == null ? undefined : PageMetadataFromJSON(json['page']),
    };
}

export function CustomerPagedModelToJSON(json: any): CustomerPagedModel {
    return CustomerPagedModelToJSONTyped(json, false);
}

export function CustomerPagedModelToJSONTyped(value?: CustomerPagedModel | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'content': value['content'] == null ? undefined : ((value['content'] as Array<any>).map(CustomerToJSON)),
        'page': PageMetadataToJSON(value['page']),
    };
}

