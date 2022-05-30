export interface GetInsightInterfaceResponse {
  contextFields: Record<string, string>;
  searchHub: string;
  interface?: InsightInterface;
}

export interface InsightInterface {
  id: string;
  name: string;
  resultTemplates: InsightResultTemplate[];
  facets: Facet[];
  tabs: Tab[];
  settings: SettingsSection;
}

interface InsightResultTemplate {
  name: string;
  layout: string;
  conditions: Condition[];
  badge: Badge;
  details: Detail[];
  resultActions: ResultActions;
  tags: Tags;
}

type Condition<
  ConditionType = 'isDefined' | 'isNotDefined' | 'mustMatch' | 'mustNotMatch'
> = {
  field: string;
  conditionType: ConditionType;
} & (ConditionType extends 'mustMatch' | 'mustNotMatch'
  ? {values: string[]}
  : {});

interface Badge {
  field: string;
  label?: string;
  color: string;
}

interface Detail {
  field: string;
  label?: string;
}

type ResultAction =
  | 'attachToCase'
  | 'copyToClipboard'
  | 'quickview'
  | 'sendAsEmail'
  | 'sendToFeed';

interface InsightOption {
  enabled: boolean;
}

type ResultActions = Record<ResultAction, InsightOption>;

type Tag = 'recommended' | 'viewedByCustomer';

interface TagParams {
  enabled: boolean;
  color: string;
}

type Tags = Record<Tag, TagParams>;

interface Facet {
  field: string;
  label?: string;
  displayValueAs?: string;
}

interface Tab {
  label: string;
  conditions: Condition[];
}

interface SettingsSection {
  createArticle: InsightOption;
  fullSearch: InsightOption;
  userActions: InsightUserActionOptions;
}

interface InsightUserActionOptions {
  enabled: boolean;
  recentClickedDocuments: InsightOption;
  recentQueries: InsightOption;
  timeline: InsightOption;
}
