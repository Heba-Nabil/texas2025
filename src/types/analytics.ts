export type CartLineMenuItemAnalyticsProps = {
    CategoryNameUnique: any;
    SelectedQuantity: number;
    DiscountAmount: number;
    PriceAfterDiscount: number;
    ID: string;
    Name: string;
    NameUnique: string;
  };
  
  export type CartLineAnalyticsProps = {
    MenuItem: CartLineMenuItemAnalyticsProps;
    Quantity: number;
    SubTotal: number;
    SubTotalAfterDiscount: number;
    Total: number;
    ID: string;
  };
  
  export type CartAnalyticsProps = {
    TotalQuantity: number;
    Lines: CartLineAnalyticsProps[];
    SubTotalAfterDiscount: number;
    DiscountAmount: number;
    Total: number;
    ID: string;
  };
  
  // Facebook Analytics
  export type facebookAnalyticItems = {
    index: number;
    id: string;
    item_name: string;
    item_category: string;
    price: number;
    currency?: string;
    discount?: number,
    quantity?: number
  }[];
  export type facebookAnalyticContent = {
    content_type: string;
    content_ids: string[];
    contents: facebookAnalyticItems;
  };
  
  // Tiktok Analytics
  export type tiktokAnalyticItems = {
      index: number;
      content_id: string;
      content_name: string;
      content_category: string;
      currency?: string;
      value: number;
      content_type: string;
      description: string;
      quantity?: number;
      discount?: number
  }[]
  export type tiktokAnalyticContent = {
    contents: tiktokAnalyticItems
  };
  
  // Google Analytics
  export type googleAnalyticItems = {
      index: number;
      item_id: string;
      item_name: string;
      item_category: string;
      price: number;
      discount?: number;
      quantity?: number;
      currency?: string
  }[];
  export type googleAnalyticContents = {
    currency: string;
    value: number;
    items: googleAnalyticItems
  };
  
  // Snapchat Analytics
  export type snapchatAnalyticContents = {
      item_ids: string[],
      item_name: string[],
      price: number,
      currency: string,
      item_categoty: string,
      number_items: number
  };