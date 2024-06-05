export enum Roles {
  ADMIN_ROLE = 'ADMIN_ROLE',
  USER_ROLE = 'USER_ROLE',
}

export enum productStatus {
  IN_STOCK = 'in_stock',
  OUT_OF_STOCK = 'out_of_stock',
  LOW_STOCK = 'low_stock',
}

export enum cartStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  COMPLETED = 'completed',
}

export enum typeAddres {
  BILLING = 'billing', // facturacion
  SHIPPING = 'shipping', // envio
}

export enum orderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}
