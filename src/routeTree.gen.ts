/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AddImport } from './routes/add'
import { Route as IdImport } from './routes/$id'
import { Route as IndexImport } from './routes/index'
import { Route as VehicleIndexImport } from './routes/vehicle/index'
import { Route as CustomerIndexImport } from './routes/customer/index'
import { Route as VehicleAddImport } from './routes/vehicle/add'
import { Route as VehicleIdImport } from './routes/vehicle/$id'
import { Route as CustomerAddImport } from './routes/customer/add'
import { Route as CustomerIdImport } from './routes/customer/$id'

// Create/Update Routes

const AddRoute = AddImport.update({
  id: '/add',
  path: '/add',
  getParentRoute: () => rootRoute,
} as any)

const IdRoute = IdImport.update({
  id: '/$id',
  path: '/$id',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const VehicleIndexRoute = VehicleIndexImport.update({
  id: '/vehicle/',
  path: '/vehicle/',
  getParentRoute: () => rootRoute,
} as any)

const CustomerIndexRoute = CustomerIndexImport.update({
  id: '/customer/',
  path: '/customer/',
  getParentRoute: () => rootRoute,
} as any)

const VehicleAddRoute = VehicleAddImport.update({
  id: '/vehicle/add',
  path: '/vehicle/add',
  getParentRoute: () => rootRoute,
} as any)

const VehicleIdRoute = VehicleIdImport.update({
  id: '/vehicle/$id',
  path: '/vehicle/$id',
  getParentRoute: () => rootRoute,
} as any)

const CustomerAddRoute = CustomerAddImport.update({
  id: '/customer/add',
  path: '/customer/add',
  getParentRoute: () => rootRoute,
} as any)

const CustomerIdRoute = CustomerIdImport.update({
  id: '/customer/$id',
  path: '/customer/$id',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/$id': {
      id: '/$id'
      path: '/$id'
      fullPath: '/$id'
      preLoaderRoute: typeof IdImport
      parentRoute: typeof rootRoute
    }
    '/add': {
      id: '/add'
      path: '/add'
      fullPath: '/add'
      preLoaderRoute: typeof AddImport
      parentRoute: typeof rootRoute
    }
    '/customer/$id': {
      id: '/customer/$id'
      path: '/customer/$id'
      fullPath: '/customer/$id'
      preLoaderRoute: typeof CustomerIdImport
      parentRoute: typeof rootRoute
    }
    '/customer/add': {
      id: '/customer/add'
      path: '/customer/add'
      fullPath: '/customer/add'
      preLoaderRoute: typeof CustomerAddImport
      parentRoute: typeof rootRoute
    }
    '/vehicle/$id': {
      id: '/vehicle/$id'
      path: '/vehicle/$id'
      fullPath: '/vehicle/$id'
      preLoaderRoute: typeof VehicleIdImport
      parentRoute: typeof rootRoute
    }
    '/vehicle/add': {
      id: '/vehicle/add'
      path: '/vehicle/add'
      fullPath: '/vehicle/add'
      preLoaderRoute: typeof VehicleAddImport
      parentRoute: typeof rootRoute
    }
    '/customer/': {
      id: '/customer/'
      path: '/customer'
      fullPath: '/customer'
      preLoaderRoute: typeof CustomerIndexImport
      parentRoute: typeof rootRoute
    }
    '/vehicle/': {
      id: '/vehicle/'
      path: '/vehicle'
      fullPath: '/vehicle'
      preLoaderRoute: typeof VehicleIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/$id': typeof IdRoute
  '/add': typeof AddRoute
  '/customer/$id': typeof CustomerIdRoute
  '/customer/add': typeof CustomerAddRoute
  '/vehicle/$id': typeof VehicleIdRoute
  '/vehicle/add': typeof VehicleAddRoute
  '/customer': typeof CustomerIndexRoute
  '/vehicle': typeof VehicleIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/$id': typeof IdRoute
  '/add': typeof AddRoute
  '/customer/$id': typeof CustomerIdRoute
  '/customer/add': typeof CustomerAddRoute
  '/vehicle/$id': typeof VehicleIdRoute
  '/vehicle/add': typeof VehicleAddRoute
  '/customer': typeof CustomerIndexRoute
  '/vehicle': typeof VehicleIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/$id': typeof IdRoute
  '/add': typeof AddRoute
  '/customer/$id': typeof CustomerIdRoute
  '/customer/add': typeof CustomerAddRoute
  '/vehicle/$id': typeof VehicleIdRoute
  '/vehicle/add': typeof VehicleAddRoute
  '/customer/': typeof CustomerIndexRoute
  '/vehicle/': typeof VehicleIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/$id'
    | '/add'
    | '/customer/$id'
    | '/customer/add'
    | '/vehicle/$id'
    | '/vehicle/add'
    | '/customer'
    | '/vehicle'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/$id'
    | '/add'
    | '/customer/$id'
    | '/customer/add'
    | '/vehicle/$id'
    | '/vehicle/add'
    | '/customer'
    | '/vehicle'
  id:
    | '__root__'
    | '/'
    | '/$id'
    | '/add'
    | '/customer/$id'
    | '/customer/add'
    | '/vehicle/$id'
    | '/vehicle/add'
    | '/customer/'
    | '/vehicle/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  IdRoute: typeof IdRoute
  AddRoute: typeof AddRoute
  CustomerIdRoute: typeof CustomerIdRoute
  CustomerAddRoute: typeof CustomerAddRoute
  VehicleIdRoute: typeof VehicleIdRoute
  VehicleAddRoute: typeof VehicleAddRoute
  CustomerIndexRoute: typeof CustomerIndexRoute
  VehicleIndexRoute: typeof VehicleIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  IdRoute: IdRoute,
  AddRoute: AddRoute,
  CustomerIdRoute: CustomerIdRoute,
  CustomerAddRoute: CustomerAddRoute,
  VehicleIdRoute: VehicleIdRoute,
  VehicleAddRoute: VehicleAddRoute,
  CustomerIndexRoute: CustomerIndexRoute,
  VehicleIndexRoute: VehicleIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/$id",
        "/add",
        "/customer/$id",
        "/customer/add",
        "/vehicle/$id",
        "/vehicle/add",
        "/customer/",
        "/vehicle/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/$id": {
      "filePath": "$id.tsx"
    },
    "/add": {
      "filePath": "add.tsx"
    },
    "/customer/$id": {
      "filePath": "customer/$id.tsx"
    },
    "/customer/add": {
      "filePath": "customer/add.tsx"
    },
    "/vehicle/$id": {
      "filePath": "vehicle/$id.tsx"
    },
    "/vehicle/add": {
      "filePath": "vehicle/add.tsx"
    },
    "/customer/": {
      "filePath": "customer/index.tsx"
    },
    "/vehicle/": {
      "filePath": "vehicle/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
