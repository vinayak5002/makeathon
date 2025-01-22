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

type ChatMessage = {
  question: string;
  answer: string;
}

export enum QueryType {
  TEXT2SQL = "text2sql",
  SQL2TEXT = "sql2text",
}

type UserRepoPath = {
  path: string;
  lastIndexed: string
};

type HistoryRecord = {
  query: string;
  timeStamp: Date;
}

export type { Snippet, UserRepoPath, HistoryRecord, ChatMessage};