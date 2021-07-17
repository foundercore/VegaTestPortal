import { StudentBatchId } from './student-batch-id-model';
export interface StudentBatchModel {
  id?: StudentBatchId;
  description: string;
  name: string;
  students?: string[];
  student_count?: number;
  selected?: boolean;
}
