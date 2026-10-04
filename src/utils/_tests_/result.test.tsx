import { fireEvent, render } from "@testing-library/react-native";
import Result from "../../app/result";

const mockResetAnalysis = jest.fn();
const mockReplace = jest.fn();

jest.mock("expo-router", () => ({
  router: {
    replace: (...args: unknown[]) => mockReplace(...args),
  },
}));

jest.mock("../../viewmodels/AnalysisViewModel", () => ({
  useAnalysis: () => ({
    classificationResult: {
      garmentType: "Shirt",
      garmentConfidence: 92,
      stainType: "Coffee",
      stainConfidence: 87,
    },
    selectedFabric: "COTTON",
    resetAnalysis: mockResetAnalysis,
  }),
}));

describe("Start Again / Reset Analysis", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("START AGAIN clears the current analysis", async () => {
    const { getByText } = await render(<Result />);

    fireEvent.press(getByText("START AGAIN"));

    expect(mockResetAnalysis).toHaveBeenCalledTimes(1);
  });

  test("START AGAIN returns user to home screen", async () => {
    const { getByText } = await render(<Result />);

    fireEvent.press(getByText("START AGAIN"));

    expect(mockReplace).toHaveBeenCalledWith("/");
  });

  test("analysis is reset before returning to home screen", async () => {
    const { getByText } = await render(<Result />);

    fireEvent.press(getByText("START AGAIN"));

    expect(mockResetAnalysis).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith("/");
  });
});
