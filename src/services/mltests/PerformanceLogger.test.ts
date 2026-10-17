jest.mock("expo-file-system", () => ({
  Paths: {
    document: "file:///documents/",
  },
  File: jest.fn(),
}));

describe("PerformanceLogger", () => {
  const mockCreate = jest.fn();
  const mockWrite = jest.fn();
  const mockText = jest.fn();

  let logPerformance: typeof import("../PerformanceLogger").logPerformance;

  const mockFile = {
    exists: false,
    uri: "file:///documents/performance-results.csv",
    create: mockCreate,
    write: mockWrite,
    text: mockText,
  };

  const record = {
    timestamp: "2026-10-17T10:00:00.000Z",
    preprocessingMs: 420.5,
    modelLoadMs: 150.25,
    inferenceMs: 850.75,
    totalMs: 1450.5,
    status: "SUCCESS" as const,
  };

  beforeEach(() => {
    // RESETS THE FILE MOCKS AND LOGGER MODULE
    jest.resetModules();
    jest.clearAllMocks();

    mockFile.exists = false;
    mockText.mockResolvedValue("");

    const { File } = require("expo-file-system");

    File.mockImplementation(() => mockFile);

    logPerformance = require("../PerformanceLogger").logPerformance;
  });

  it("creates a CSV file when it does not exist", async () => {
    // CHECKS THAT THE PERFORMANCE FILE IS CREATED
    await logPerformance(record);

    expect(mockCreate).toHaveBeenCalledTimes(1);

    expect(mockWrite).toHaveBeenCalledWith(
      expect.stringContaining("Timestamp,Preprocessing_ms"),
    );
  });

  it("writes the performance results", async () => {
    // CHECKS THAT THE RESULTS ARE FORMATTED CORRECTLY
    await logPerformance(record);

    expect(mockWrite).toHaveBeenCalledWith(
      expect.stringContaining("420.50,150.25,850.75,1450.50,SUCCESS"),
    );
  });

  it("preserves existing performance results", async () => {
    // CHECKS THAT PREVIOUS RESULTS ARE PRESERVED
    mockFile.exists = true;

    mockText.mockResolvedValue(
      "Timestamp,Preprocessing_ms,ModelLoad_ms,Inference_ms,Total_ms,Status\n" +
        "2026-10-16T10:00:00.000Z,400.00,100.00,700.00,1250.00,SUCCESS\n",
    );

    await logPerformance(record);

    expect(mockCreate).not.toHaveBeenCalled();

    expect(mockWrite).toHaveBeenCalledWith(
      expect.stringContaining("2026-10-16T10:00:00.000Z"),
    );

    expect(mockWrite).toHaveBeenCalledWith(
      expect.stringContaining("2026-10-17T10:00:00.000Z"),
    );
  });

  it("records failed analyses", async () => {
    // CHECKS THAT FAILED ANALYSES ARE RECORDED
    await logPerformance({
      ...record,
      status: "FAILED",
    });

    expect(mockWrite).toHaveBeenCalledWith(expect.stringContaining("FAILED"));
  });

  it("handles file writing errors", async () => {
    // CHECKS THAT FILE ERRORS DO NOT CRASH THE APP
    mockWrite.mockImplementation(() => {
      throw new Error("File writing failed");
    });

    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(logPerformance(record)).resolves.toBeUndefined();

    expect(errorSpy).toHaveBeenCalled();

    errorSpy.mockRestore();
  });
});
