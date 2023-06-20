export enum FilterOperator {
  EQ = 'EQ',
  SM_EQ = 'SM_EQ',
  SM = 'SM',
  GT_EQ = 'GT_EQ',
  GT = 'GT',
}

export enum FieldType {
  UNKNOWN,
  BIG_INT,
  FLOAT,
  STRING,
  BOOLEAN,
}

export interface Filters {
  bigintFilters?: { field: string; value: string; operator: FilterOperator }[];
  integerFilters?: { field: string; value: number; operator: FilterOperator }[];
  floatFilters?: { field: string; value: number; operator: FilterOperator }[];
  boolFilters?: { field: string; value: boolean }[];
  stringFilters?: { field: string; contains: string }[];
}

export enum SortDirection {
  DESC = 'DESC',
  ASC = 'ASC',
}
