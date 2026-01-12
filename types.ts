
export type SplitMode = 'horizontal' | 'vertical';

export interface ImageData {
  url: string;
  width: number;
  height: number;
  name: string;
}

export interface SplitResult {
  url: string;
  id: number;
}
