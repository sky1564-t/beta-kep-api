import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksCardGrid extends Struct.ComponentSchema {
  collectionName: 'components_blocks_card_grids';
  info: {
    description: 'Cards in a grid (programs, features, etc.)';
    displayName: 'Card grid';
    icon: 'grid';
  };
  attributes: {
    anchor: Schema.Attribute.String;
    cards: Schema.Attribute.Component<'shared.card', true>;
    heading: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
  };
}

export interface BlocksCollectionList extends Struct.ComponentSchema {
  collectionName: 'components_blocks_collection_lists';
  info: {
    description: 'Show latest posts / upcoming courses / albums / teachers';
    displayName: 'Collection list';
    icon: 'stack';
  };
  attributes: {
    anchor: Schema.Attribute.String;
    collection: Schema.Attribute.Enumeration<
      ['posts', 'courses', 'albums', 'teachers']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'posts'>;
    heading: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    limit: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 24;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<3>;
  };
}

export interface BlocksCta extends Struct.ComponentSchema {
  collectionName: 'components_blocks_ctas';
  info: {
    description: 'Short message with a button';
    displayName: 'Call to action';
    icon: 'cursor';
  };
  attributes: {
    anchor: Schema.Attribute.String;
    backgroundImage: Schema.Attribute.Media<'images'>;
    buttonLabel: Schema.Attribute.String;
    buttonUrl: Schema.Attribute.String;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    text: Schema.Attribute.Text;
  };
}

export interface BlocksFaq extends Struct.ComponentSchema {
  collectionName: 'components_blocks_faqs';
  info: {
    description: 'Questions and answers';
    displayName: 'FAQ';
    icon: 'question';
  };
  attributes: {
    anchor: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    items: Schema.Attribute.Component<'shared.faq-item', true>;
  };
}

export interface BlocksGallery extends Struct.ComponentSchema {
  collectionName: 'components_blocks_gallerys';
  info: {
    description: 'Grid of photos';
    displayName: 'Gallery';
    icon: 'slideshow';
  };
  attributes: {
    anchor: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    images: Schema.Attribute.Media<'images' | 'videos', true>;
  };
}

export interface BlocksHero extends Struct.ComponentSchema {
  collectionName: 'components_blocks_heros';
  info: {
    description: 'Big banner at the top of a page';
    displayName: 'Hero';
    icon: 'landscape';
  };
  attributes: {
    anchor: Schema.Attribute.String;
    backgroundImage: Schema.Attribute.Media<'images'>;
    buttonLabel: Schema.Attribute.String;
    buttonUrl: Schema.Attribute.String;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksImageText extends Struct.ComponentSchema {
  collectionName: 'components_blocks_image_texts';
  info: {
    description: 'Image beside text';
    displayName: 'Image + text';
    icon: 'picture';
  };
  attributes: {
    anchor: Schema.Attribute.String;
    body: Schema.Attribute.Blocks;
    buttonLabel: Schema.Attribute.String;
    buttonUrl: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    imagePosition: Schema.Attribute.Enumeration<['left', 'right']> &
      Schema.Attribute.DefaultTo<'left'>;
  };
}

export interface BlocksRichText extends Struct.ComponentSchema {
  collectionName: 'components_blocks_rich_texts';
  info: {
    description: 'Heading + formatted text';
    displayName: 'Rich text';
    icon: 'write';
  };
  attributes: {
    anchor: Schema.Attribute.String;
    body: Schema.Attribute.Blocks;
    heading: Schema.Attribute.String;
  };
}

export interface BlocksTimetable extends Struct.ComponentSchema {
  collectionName: 'components_blocks_timetables';
  info: {
    description: 'Daily schedule';
    displayName: 'Timetable';
    icon: 'clock';
  };
  attributes: {
    anchor: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    items: Schema.Attribute.Component<'shared.schedule-item', true>;
  };
}

export interface BlocksVideo extends Struct.ComponentSchema {
  collectionName: 'components_blocks_videos';
  info: {
    description: 'YouTube / Facebook video';
    displayName: 'Video';
    icon: 'play';
  };
  attributes: {
    anchor: Schema.Attribute.String;
    caption: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    videoUrl: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_cards';
  info: {
    description: '';
    displayName: 'Card';
    icon: 'layout';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    linkLabel: Schema.Attribute.String;
    linkUrl: Schema.Attribute.String;
    text: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedContact extends Struct.ComponentSchema {
  collectionName: 'components_shared_contacts';
  info: {
    description: 'Contact details and map';
    displayName: 'Contact';
    icon: 'phone';
  };
  attributes: {
    address: Schema.Attribute.Text;
    email: Schema.Attribute.Email;
    googleMapsUrl: Schema.Attribute.String;
    mapEmbedUrl: Schema.Attribute.Text;
    openingHours: Schema.Attribute.String;
    phone: Schema.Attribute.String;
  };
}

export interface SharedDonation extends Struct.ComponentSchema {
  collectionName: 'components_shared_donations';
  info: {
    description: 'Bank / KHQR donation details';
    displayName: 'Donation';
    icon: 'handHeart';
  };
  attributes: {
    accountName: Schema.Attribute.String;
    accountNumber: Schema.Attribute.String;
    bankName: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    khqr: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_faq_items';
  info: {
    description: '';
    displayName: 'FAQ item';
    icon: 'question';
  };
  attributes: {
    answer: Schema.Attribute.Text & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedMenuItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_menu_items';
  info: {
    description: 'Top-level menu item with optional sub-menu';
    displayName: 'Menu item';
    icon: 'bulletList';
  };
  attributes: {
    children: Schema.Attribute.Component<'shared.menu-link', true>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedMenuLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_menu_links';
  info: {
    description: 'Sub-menu link';
    displayName: 'Menu link';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedScheduleItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_schedule_items';
  info: {
    description: 'One row of a timetable';
    displayName: 'Schedule item';
    icon: 'clock';
  };
  attributes: {
    activity: Schema.Attribute.String & Schema.Attribute.Required;
    note: Schema.Attribute.String;
    time: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: 'Title, description and image for Google & Facebook sharing';
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 170;
      }>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 70;
      }>;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    description: '';
    displayName: 'Social link';
    icon: 'globe';
  };
  attributes: {
    platform: Schema.Attribute.Enumeration<
      [
        'facebook',
        'youtube',
        'telegram',
        'tiktok',
        'instagram',
        'x',
        'website',
        'email',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'facebook'>;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'blocks.card-grid': BlocksCardGrid;
      'blocks.collection-list': BlocksCollectionList;
      'blocks.cta': BlocksCta;
      'blocks.faq': BlocksFaq;
      'blocks.gallery': BlocksGallery;
      'blocks.hero': BlocksHero;
      'blocks.image-text': BlocksImageText;
      'blocks.rich-text': BlocksRichText;
      'blocks.timetable': BlocksTimetable;
      'blocks.video': BlocksVideo;
      'shared.card': SharedCard;
      'shared.contact': SharedContact;
      'shared.donation': SharedDonation;
      'shared.faq-item': SharedFaqItem;
      'shared.menu-item': SharedMenuItem;
      'shared.menu-link': SharedMenuLink;
      'shared.schedule-item': SharedScheduleItem;
      'shared.seo': SharedSeo;
      'shared.social-link': SharedSocialLink;
    }
  }
}
