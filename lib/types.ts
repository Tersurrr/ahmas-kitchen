export type Category = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
};

export type MenuImage = {
  id: string;
  menu_item_id: string;
  url: string;
  sort_order: number;
};

export type MenuItemOption = {
  id: string;
  menu_item_id: string;
  name: string;
  price: number;
  sort_order: number;
  is_default: boolean;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  ingredients: string | null;
  /** Legacy/base price, used only when the item has no options. */
  price: number;
  category_id: string | null;
  is_featured: boolean;
  is_available: boolean;
  sort_order: number;
  menu_images?: MenuImage[];
  categories?: Category | null;
  menu_item_options?: MenuItemOption[];
};

export type Video = {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  sort_order: number;
};

export type FulfillmentType = "pickup" | "delivery";

export type OrderStatus = "new" | "confirmed" | "completed" | "cancelled";

export type OrderItemRecord = {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  name: string;
  quantity: number;
  unit_price: number;
  notes: string | null;
};

export type OrderRecord = {
  id: string;
  customer_name: string;
  phone: string;
  address: string | null;
  fulfillment_type: FulfillmentType;
  preferred_date: string | null;
  preferred_time: string | null;
  special_instructions: string | null;
  total_price: number;
  status: OrderStatus;
  created_at: string;
  order_items?: OrderItemRecord[];
};

export type Settings = {
  id: number;
  business_name: string;
  logo_url: string | null;
  whatsapp_number: string;
  email: string;
  theme_primary: string;
  theme_secondary: string;
  pickup_hours: string | null;
  delivery_hours: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
};

export type CartItem = {
  menuItemId: string;
  /** Selected option id, or null when the item has no options. Part of the cart line's identity. */
  optionId: string | null;
  optionName?: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  specialInstructions?: string;
};
