export interface GeoIpData {
  ip,
  country_code,
  country,
  country_rus,
  region,
  region_rus,
  city,
  city_rus,
  latitude,
  longitude,
  zip_code,
  time_zone: string;
}

export interface ProviderIpData {
  ip,
  name_ripe,
  name_rus,
  site,
  as,
  ip_range_start,
  ip_range_end,
  route,
  mask: string;
}

export interface RequestRecord {
  type, date, info: string;
  response: {
    type: '',
    data: GeoIpData | ProviderIpData | string;
  }
}