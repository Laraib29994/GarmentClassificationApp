import { fireEvent, render } from "@testing-library/react-native";
import Result from "../../app/result";

const mockResetAnalysis = jest.fn();
const mockReplace = jest.fn();

// MOCKS THE EXPO ROUTER NAVIGATION
jest.mock("expo-router", () => ({
  router: {
    replace: (...args: unknown[]) => mockReplace(...args),
  },
}));

// MOCKS THE ANALYSIS VIEWMODEL
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
    // RESETS THE MOCK FUNCTION CALLS
    jest.clearAllMocks();
  });

  // TESTS WHETHER START AGAIN CLEARS THE ANALYSIS
  test("START AGAIN clears the current analysis", async () => {
    const screen = await render(<Result />);

    fireEvent.press(screen.getByText("START AGAIN"));

    expect(mockResetAnalysis).toHaveBeenCalledTimes(1);
  }, 10000);

  // TESTS WHETHER START AGAIN RETURNS TO THE HOME SCREEN
  test("START AGAIN returns user to home screen", async () => {
    const screen = await render(<Result />);

    fireEvent.press(screen.getByText("START AGAIN"));

    expect(mockReplace).toHaveBeenCalledWith("/");
  }, 10000);

  // TESTS THE RESET AND NAVIGATION BEHAVIOUR
  test("analysis is reset before returning to home screen", async () => {
    const screen = await render(<Result />);

    fireEvent.press(screen.getByText("START AGAIN"));

    expect(mockResetAnalysis).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith("/");

    // CHECKS THAT RESET OCCURS BEFORE NAVIGATION
    const resetOrder = mockResetAnalysis.mock.invocationCallOrder[0];
    const navigationOrder = mockReplace.mock.invocationCallOrder[0];

    expect(resetOrder).toBeLessThan(navigationOrder);
  }, 10000);
});
