type Snippet = {
  lang: string;
  code: string;
  filePath: string;
  headerTree: string;
  metaData :{ 
    headerLine: number,
    actualFilePath: string
  }

}

type UserRepoPath = {
  path: string;
  lastIndexed: string
};

type HistoryRecord = {
  query: string;
  timeStamp: Date;
}

export type { Snippet, UserRepoPath, HistoryRecord};