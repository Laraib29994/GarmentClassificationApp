import { File, Paths } from "expo-file-system";

export interface PerformanceRecord {
  timestamp: string;
  preprocessingMs: number;
  modelLoadMs: number;
  inferenceMs: number;
  totalMs: number;
  status: "SUCCESS" | "FAILED";
}

const performanceFile = new File(Paths.document, "performance-results.csv");

const headers =
  "Timestamp,Preprocessing_ms,ModelLoad_ms,Inference_ms,Total_ms,Status\n";

export async function logPerformance(record: PerformanceRecord): Promise<void> {
  try {
    // CREATES THE PERFORMANCE FILE IF IT DOES NOT EXIST
    if (!performanceFile.exists) {
      performanceFile.create();
      performanceFile.write(headers);
    }

    // FORMATS THE PERFORMANCE RESULTS
    const row =
      [
        record.timestamp,
        record.preprocessingMs.toFixed(2),
        record.modelLoadMs.toFixed(2),
        record.inferenceMs.toFixed(2),
        record.totalMs.toFixed(2),
        record.status,
      ].join(",") + "\n";

    // APPENDS THE RESULTS TO THE CSV FILE
    const existingContent = await performanceFile.text();

    performanceFile.write(existingContent + row);

    console.log("Performance results saved:", performanceFile.uri);
  } catch (error) {
    console.error("Failed to save performance results:", error);
  }
}
