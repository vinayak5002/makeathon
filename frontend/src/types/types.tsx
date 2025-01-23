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
  type: QueryType;
}

export enum QueryType {
  TEXT2SQL = "text2sql",
  SQL2TEXT = "sql2text",
}

type LoginResponse = {
  userID: string;
  message: string;
}

type UserRepoPath = {
  path: string;
  lastIndexed: string
};

type HistoryRecord = {
  query: string;
  timeStamp: Date;
}

export type { Snippet, UserRepoPath, HistoryRecord, ChatMessage, LoginResponse};