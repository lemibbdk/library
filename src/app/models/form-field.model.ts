export interface FormFieldModel {
  field: string;
  label: string;
  placeholder: string;
  inputType: FieldType;
  width: 25 | 33 | 100;
}

export enum FieldType {
  INPUT = 'input',
  SELECT = 'select',
  TEXTAREA = 'textarea',
}
