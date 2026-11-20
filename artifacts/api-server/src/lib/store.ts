import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { logger } from "./logger";

const dataDir = process.env["DATA_DIR"]
  ? path.resolve(process.env["DATA_DIR"])
  : path.resolve(process.cwd(), "data");

export interface StoredSurvey {
  room: string;
  submittedAt: number;
  overallRating: number;
  difficulty: number;
  mostInteresting: string;
  leastClear: string;
  wouldRecommend: string;
  comments: string;
}

/**
 * Appends one anonymous survey answer as a JSON line.
 * No student name or id is stored, only the class code, so feedback stays anonymous.
 */
export async function appendSurvey(record: StoredSurvey): Promise<void> {
  try {
    await mkdir(dataDir, { recursive: true });
    await appendFile(path.join(dataDir, "surveys.jsonl"), JSON.stringify(record) + "\n", "utf8");
  } catch (err) {
    logger.error({ err }, "Could not save survey response");
  }
}
