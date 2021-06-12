export interface AssignmentRequest {
  assignedToBatch?: [];
  assignedToStudent?: [];
  description: string;
  passcode: string;
  releaseDate: string;
  scoringType?: string;
  tags?: [];
  testId: string;
  validFrom: string;
  validTo: string;
}
