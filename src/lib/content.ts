export type Locale = 'it' | 'en';

export interface LocalizedString {
  it: string;
  en: string;
  align?: string;
}

export interface SiteContent {
  seo: {
    title: string;
    description: string;
    ogImage: string;
    keywords: string;
  };
  header: {
    nav: Array<{
      label: LocalizedString;
      href: string;
    }>;
  };
  footer: {
    copyright: string;
    links: Array<{
      label: LocalizedString;
      href: string;
      action?: string;
    }>;
  };
  sections: {
    hero: {
      videoUrl: string;
      videoStart: number;
      videoAutoplay: boolean;
      mediaType: 'video' | 'image';
      showLogo: boolean;
      logoPlacement?: 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
      /* Deprecated sticky behavior */
      stickyLogo?: boolean;
      backgroundImage: string;
      title: LocalizedString;
      subtitle: LocalizedString;
      cta: Array<{
        label: LocalizedString;
        href: string;
        type: string;
        icon: string;
      }>;
      scrollLabel: LocalizedString;
    };
    operaViva: {
      kicker: LocalizedString;
      title: LocalizedString;
      lead: LocalizedString;
      paragraphs: LocalizedString[];
      gallery: Array<{ src: string; alt: string }>;
    };
    /* Deprecated unused section */
    cosaFacciamo?: any;
    comeLoFacciamo: {
      kicker: LocalizedString;
      title: LocalizedString;
      lead: LocalizedString;
      cta: { label: LocalizedString; href: string };
      items: Array<{
        id: string;
        icon: string;
        title: LocalizedString;
        text: LocalizedString;
      }>;
      gallery: Array<{ src: string; alt: string }>;
    };
    eventi: {
      kicker: LocalizedString;
      title: LocalizedString;
      lead: LocalizedString;
    };
    galleria: {
      kicker: LocalizedString;
      title: LocalizedString;
      lead: LocalizedString;
      items: Array<{ src: string; alt: string }>;
    };
    contatti: {
      kicker: LocalizedString;
      title: LocalizedString;
      lead: LocalizedString;
      location: LocalizedString;
      cardLead: LocalizedString;
      email: string;
      instagram: string;
      showEmail?: boolean;
      showInstagram?: boolean;
      showWhatsApp?: boolean;
      whatsappNumber?: string;
      homeLabel: LocalizedString;
    };
  };
  offer: {
    kicker: LocalizedString;
    title: LocalizedString;
    lead: LocalizedString;
    backLabel: LocalizedString;
    sections: Array<{
      id: string;
      image: string;
      title: LocalizedString;
      paragraphs: LocalizedString[];
    }>;
  };
  techniques: {
    kicker: LocalizedString;
    title: LocalizedString;
    lead: LocalizedString;
    backLabel: LocalizedString;
    sections: Array<{
      id: string;
      image: string;
      images?: Array<{ src: string; alt: string }>;
      title: LocalizedString;
      paragraphs: LocalizedString[];
    }>;
    locked?: boolean;
    passwordHash?: string;
  };
  login: {
    title: string;
    passwordLabel: string;
    loginBtn: string;
  };
  events?: Event[];
  eventsTimeline: {
    title: LocalizedString;
    lead: LocalizedString;
    detailsLabel: LocalizedString;
  };
  contactsSection: {
    buttonLabel: LocalizedString;
  };
  adminConfig?: {
    storage: 'vercel-blob' | 'github';
    maxDimension: number;
    maxSizeKB: number;
  };
};

export interface Event {
  title: LocalizedString;
  date: string; // ISO date string YYYY-MM-DD
  description: LocalizedString;
  link?: string;
}

export function getLocalizedValue(value: LocalizedString | string, locale: Locale): string {
  if (typeof value === 'string') return value;
  return value[locale] || value['it'];
}

export function getAlignment(value: LocalizedString | string | undefined | null): 'left' | 'center' | 'right' | 'justify' {
  if (value && typeof value === 'object' && 'align' in value && value.align) {
    return value.align as any;
  }
  return 'left';
}
