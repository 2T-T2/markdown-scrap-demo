export interface MetaData {
  content: string;
  links: string[];
  froms: string[];
  updated: number;
  created: number;  // ダミーページは作成日が負数
}
