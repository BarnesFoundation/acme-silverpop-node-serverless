interface AcmeReportPayload {
  collectionName: string;
  recordCount: number;
  skippedRecordCount: number;
  resultFieldList: ResultItem[];
}

interface ResultItem {
  fieldName: string;
  analyticsDataType: string;
  values: any[];
}

export { AcmeReportPayload, ResultItem };
