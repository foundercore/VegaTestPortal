export class EditTestMetaData {
  instructions: string;
  minimumDurationInMinutes: 0;
  name: string;
  sectionOrder: [string];
  sections: [
    {
      difficultyLevel: string;
      durationInMinutes: 0;
      instructions: string;
      name: string;
      parentSection: string;
      questions: [
        {
          id: string;
          negativeMark: 0;
          positiveMark: 0;
          skipMark: 0;
        }
      ];
      subSectionOrder: [string];
    }
  ];
  status: string;
  subject: string;
  tags: string[];
  totalDurationInMinutes = 0;
  totalMarks = 0;
  type: string;
  calculatorRequired: boolean;
}
