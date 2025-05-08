const API_URL = process.env.NEXT_PUBLIC_API_URL;

// --- Product ---
export const fetchProducts = async () => {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};
export const fetchProductById = async (id: number) => {
  const res = await fetch(`${API_URL}/products/${id}`);
  if (!res.ok) throw new Error('Not found');
  return res.json();
};
export const createProduct = async (product: any) => {
  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
};
export const updateProduct = async (id: number, product: any) => {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error('Failed to update');
};
export const deleteProduct = async (id: number) => {
  const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
};

// --- Customer ---
export const fetchCustomers = async () => {
  const res = await fetch(`${API_URL}/customers`);
  if (!res.ok) throw new Error('Failed to fetch customers');
  return res.json();
};
export const fetchCustomerById = async (id: number) => {
  const res = await fetch(`${API_URL}/customers/${id}`);
  if (!res.ok) throw new Error('Not found');
  return res.json();
};
export const createCustomer = async (customer: any) => {
  const res = await fetch(`${API_URL}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customer),
  });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
};
export const updateCustomer = async (id: number, customer: any) => {
  const res = await fetch(`${API_URL}/customers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customer),
  });
  if (!res.ok) throw new Error('Failed to update');
};
export const deleteCustomer = async (id: number) => {
  const res = await fetch(`${API_URL}/customers/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
};

// --- Employee ---
export const fetchEmployees = async () => {
  const res = await fetch(`${API_URL}/employees`);
  if (!res.ok) throw new Error('Failed to fetch employees');
  return res.json();
};
export const fetchEmployeeById = async (id: number) => {
  const res = await fetch(`${API_URL}/employees/${id}`);
  if (!res.ok) throw new Error('Not found');
  return res.json();
};
export const createEmployee = async (employee: any) => {
  const res = await fetch(`${API_URL}/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employee),
  });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
};
export const updateEmployee = async (id: number, employee: any) => {
  const res = await fetch(`${API_URL}/employees/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employee),
  });
  if (!res.ok) throw new Error('Failed to update');
};
export const deleteEmployee = async (id: number) => {
  const res = await fetch(`${API_URL}/employees/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
};

// --- Warehouse ---
export const fetchWarehouses = async () => {
  const res = await fetch(`${API_URL}/warehouses`);
  if (!res.ok) throw new Error('Failed to fetch warehouses');
  return res.json();
};
export const fetchWarehouseById = async (id: number) => {
  const res = await fetch(`${API_URL}/warehouses/${id}`);
  if (!res.ok) throw new Error('Not found');
  return res.json();
};
export const createWarehouse = async (warehouse: any) => {
  const res = await fetch(`${API_URL}/warehouses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(warehouse),
  });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
};
export const updateWarehouse = async (id: number, warehouse: any) => {
  const res = await fetch(`${API_URL}/warehouses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(warehouse),
  });
  if (!res.ok) throw new Error('Failed to update');
};
export const deleteWarehouse = async (id: number) => {
  const res = await fetch(`${API_URL}/warehouses/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
};

// --- Supplier ---
export const fetchSuppliers = async () => {
  const res = await fetch(`${API_URL}/suppliers`);
  if (!res.ok) throw new Error('Failed to fetch suppliers');
  return res.json();
};
export const fetchSupplierById = async (id: number) => {
  const res = await fetch(`${API_URL}/suppliers/${id}`);
  if (!res.ok) throw new Error('Not found');
  return res.json();
};
export const createSupplier = async (supplier: any) => {
  const res = await fetch(`${API_URL}/suppliers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(supplier),
  });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
};
export const updateSupplier = async (id: number, supplier: any) => {
  const res = await fetch(`${API_URL}/suppliers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(supplier),
  });
  if (!res.ok) throw new Error('Failed to update');
};
export const deleteSupplier = async (id: number) => {
  const res = await fetch(`${API_URL}/suppliers/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
};

// --- Order ---
export const fetchOrders = async () => {
  const res = await fetch(`${API_URL}/orders`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
};
export const fetchOrderById = async (id: number) => {
  const res = await fetch(`${API_URL}/orders/${id}`);
  if (!res.ok) throw new Error('Not found');
  return res.json();
};
export const createOrder = async (order: any) => {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
};
export const updateOrder = async (id: number, order: any) => {
  const res = await fetch(`${API_URL}/orders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  if (!res.ok) throw new Error('Failed to update');
};
export const deleteOrder = async (id: number) => {
  const res = await fetch(`${API_URL}/orders/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
};

// --- Discount ---
export const fetchDiscounts = async () => {
  const res = await fetch(`${API_URL}/discounts`);
  if (!res.ok) throw new Error('Failed to fetch discounts');
  return res.json();
};
export const fetchDiscountById = async (id: number) => {
  const res = await fetch(`${API_URL}/discounts/${id}`);
  if (!res.ok) throw new Error('Not found');
  return res.json();
};
export const createDiscount = async (discount: any) => {
  const res = await fetch(`${API_URL}/discounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(discount),
  });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
};
export const updateDiscount = async (id: number, discount: any) => {
  const res = await fetch(`${API_URL}/discounts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(discount),
  });
  if (!res.ok) throw new Error('Failed to update');
};
export const deleteDiscount = async (id: number) => {
  const res = await fetch(`${API_URL}/discounts/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
};

// --- Shipping ---
export const fetchShippings = async () => {
  const res = await fetch(`${API_URL}/shippings`);
  if (!res.ok) throw new Error('Failed to fetch shippings');
  return res.json();
};
export const fetchShippingById = async (id: number) => {
  const res = await fetch(`${API_URL}/shippings/${id}`);
  if (!res.ok) throw new Error('Not found');
  return res.json();
};
export const createShipping = async (shipping: any) => {
  const res = await fetch(`${API_URL}/shippings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(shipping),
  });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
};
export const updateShipping = async (id: number, shipping: any) => {
  const res = await fetch(`${API_URL}/shippings/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(shipping),
  });
  if (!res.ok) throw new Error('Failed to update');
};
export const deleteShipping = async (id: number) => {
  const res = await fetch(`${API_URL}/shippings/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
}; 