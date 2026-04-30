export interface LocaleContent {
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogTitle: string;
    ogDescription: string;
  };

  nav: {
    home: string;
    projects: string;
    properties: string;
    areas: string;
    developers: string;
    agents: string;
    about: string;
    contact: string;
    callUs: string;
    whatsapp: string;
  };

  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    description: string;
    searchPlaceholder: string;
    propertyType: string;
    location: string;
    priceRange: string;
    bedrooms: string;
    search: string;
    stats: {
      properties: string;
      clients: string;
      years: string;
      developers: string;
    };
    propertyTypes: {
      all: string;
      apartment: string;
      villa: string;
      penthouse: string;
      townhouse: string;
    };
    locations: {
      all: string;
      downtown: string;
      marina: string;
      palm: string;
      creek: string;
      hills: string;
    };
    prices: {
      all: string;
      under1m: string;
      '1m-3m': string;
      '3m-5m': string;
      '5m-10m': string;
      above10m: string;
    };
    bedroomOptions: {
      any: string;
      studio: string;
      '1br': string;
      '2br': string;
      '3br': string;
      '4plus': string;
    };
  };

  projects: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    viewDetails: string;
    startingFrom: string;
    paymentPlan: string;
    handover: string;
    launchPrice: string;
    developer: string;
    filters: {
      all: string;
      offPlan: string;
      readyToMove: string;
      underConstruction: string;
    };
    viewAll: string;
  };

  properties: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    tabs: {
      sale: string;
      rent: string;
    };
    price: string;
    perYear: string;
    beds: string;
    baths: string;
    sqft: string;
    featured: string;
    exclusive: string;
    newListing: string;
    viewDetails: string;
    viewAll: string;
  };

  areas: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    avgPrice: string;
    properties: string;
    growth: string;
    explore: string;
  };

  developers: {
    title: string;
    subtitle: string;
  };

  agents: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    properties: string;
    deals: string;
    experience: string;
    contact: string;
    languages: string;
    specializations: string;
  };

  about: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    features: {
      expertise: {
        title: string;
        description: string;
      };
      trust: {
        title: string;
        description: string;
      };
      service: {
        title: string;
        description: string;
      };
      global: {
        title: string;
        description: string;
      };
    };
    stats: {
      transactions: string;
      volume: string;
      satisfaction: string;
    };
  };

  footer: {
    description: string;
    quickLinks: string;
    propertyTypes: string;
    contactInfo: string;
    newsletter: {
      title: string;
      description: string;
      placeholder: string;
      button: string;
    };
    copyright: string;
    links: {
      privacy: string;
      terms: string;
      cookies: string;
    };
    propertyTypesList: {
      apartments: string;
      villas: string;
      penthouses: string;
      townhouses: string;
      offPlan: string;
      commercial: string;
    };
  };

  common: {
    aed: string;
    sqft: string;
    learnMore: string;
    viewAll: string;
    contactUs: string;
    getStarted: string;
    readMore: string;
    loading: string;
    error: string;
    retry: string;
  };

  profile: {
    title: string;
    description: string;
    fullName: string;
    phone: string;
    country: string;
    submit: string;
    placeholderName: string;
    placeholderPhone: string;
    success: string;
  };
}
