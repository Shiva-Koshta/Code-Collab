import reportWebVitals from "../reportWebVitals";

// Mocking the web-vitals module
jest.mock("web-vitals", () => ({
  getCLS: jest.fn(),
  getFID: jest.fn(),
  getFCP: jest.fn(),
  getLCP: jest.fn(),
  getTTFB: jest.fn(),
}));

describe("reportWebVitals", () => {
  test("should call all web vitals functions with the provided onPerfEntry callback", () => {
    // Mock onPerfEntry callback function
    const onPerfEntry = jest.fn();

    // Mock web vitals functions
    const mockGetCLS = jest.fn();
    const mockGetFID = jest.fn();
    const mockGetFCP = jest.fn();
    const mockGetLCP = jest.fn();
    const mockGetTTFB = jest.fn();

    // Call the function under test with mocked arguments
    reportWebVitals(onPerfEntry, {
      getCLS: mockGetCLS,
      getFID: mockGetFID,
      getFCP: mockGetFCP,
      getLCP: mockGetLCP,
      getTTFB: mockGetTTFB,
    });

    // Ensure that all web vitals functions are called with the onPerfEntry callback
    expect(mockGetCLS).toHaveBeenCalledWith(onPerfEntry);
    expect(mockGetFID).toHaveBeenCalledWith(onPerfEntry);
    expect(mockGetFCP).toHaveBeenCalledWith(onPerfEntry);
    expect(mockGetLCP).toHaveBeenCalledWith(onPerfEntry);
    expect(mockGetTTFB).toHaveBeenCalledWith(onPerfEntry);
  });

  test("should not call any web vitals function if onPerfEntry is not provided", () => {
    // Call the function under test without providing onPerfEntry
    reportWebVitals();

    // Ensure that none of the web vitals functions are called
    expect(require("web-vitals").getCLS).not.toHaveBeenCalled();
    expect(require("web-vitals").getFID).not.toHaveBeenCalled();
    expect(require("web-vitals").getFCP).not.toHaveBeenCalled();
    expect(require("web-vitals").getLCP).not.toHaveBeenCalled();
    expect(require("web-vitals").getTTFB).not.toHaveBeenCalled();
  });
});
