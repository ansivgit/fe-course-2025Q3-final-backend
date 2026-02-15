export type DictionaryItem = {
  id: string;
  name: string;
};

export const TOPICS: DictionaryItem[] = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'react', name: 'React' },
  { id: 'node', name: 'Node.js' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'vue', name: 'Vue.js' },
  { id: 'angular', name: 'Angular' },
];

export const DIFFICULTIES: DictionaryItem[] = [
  { id: 'junior', name: 'Junior' },
  { id: 'middle', name: 'Middle' },
  { id: 'senior', name: 'Senior' },
];
