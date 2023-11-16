export interface Business_Response_Entity {
  id: string;
  alias: string;
  name: string;
  image_url: string;
  is_closed: boolean;
  url: string;
  review_count: number;
  categories: Array<{
    id: number;
    alias: string;
    title: string;
  }>;
  rating: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  transactions: Array<string>;
  price: number;
  location: {
    address1: string;
    address2: string;
    address3: string;
    city: string;
    zip_code: string;
    country: string;
    state: string;
    display_address: Array<string>;
  };
  phone: string;
  display_phone: string;
}
export interface Business_Request {
  alias: string;
  name: string;
  image_url: Date;
  rating: number;
  url: string;

  latitude: number;
  longitude: number;
  radius: number;
  transactions: string;

  //LOCATION
  address1: string;
  address2: string;
  address3: string;
  city: string;
  zip_code: string;
  country: string;
  state: string;

  //CLOSED
  phone: string;
  display_phone: string;
  is_closed: boolean;

  price: number;
}
export interface Business_Response_Wrapper {
  businesses: Array<Business_Response_Entity>;
  total: number;
}
export interface Business_Query {
  location: string | null;
  latitude: string | null;
  longitude: string | null;
  limit: number;
  offset: number;
  term: string;
}

export interface Additional_Business_Raw_Query {
  id: string;
  alias: string;
  name: string;
  image_url: string;
  rating: number;
  url: string;

  latitude: number;
  longitude: number;
  radius: number;
  transactions: string;

  //LOCATION
  address1: string;
  address2: string;
  address3: string;
  city: string;
  zip_code: string;
  country: string;
  state: string;

  //CLOSED
  phone: string;
  display_phone: string;
  is_closed: boolean;
  reviewCount: number;

  price: number;

  Business_Categories: {
    id: string;
    business_id: string;
    category_id: number;

    Category: {
      id: number;
      alias: string;
      title: string;
    };
  }[];
}
