// src/services/Folder/index.ts

export {
  createFolder,
  getFoldersByUser,
  getFolder,
  updateFolder,
  deleteFolder,
  getStudySetsInFolder,
  moveStudySetToFolder,
  moveMultipleStudySets,
} from './folderService';

export type { Folder, StudySetInFolder, DragItem, DropTarget, FolderWithStudySets } from '@/@types/folder';