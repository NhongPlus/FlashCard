export interface Folder {
  id: string;
  name: string;
  description?: string;
  userId: string;
  studySetCount: number;
  createdAt: string;
  updatedAt: string;
  color?: string; // Màu folder (optional)
}

export interface StudySetInFolder {
  id: string;
  title: string;
  description?: string;
  folderId: string | null; // null = chưa phân loại
  userId: string;
  cardCount: number;
  createdAt: string;
}

export interface DragItem {
  id: string;
  type: 'studyset';
  currentFolderId: string | null;
}

export interface DropTarget {
  id: string; // folderId hoặc 'unclassified'
  type: 'folder' | 'unclassified';
}

export type FolderWithStudySets = Folder & {
  studySets: StudySetInFolder[];
};