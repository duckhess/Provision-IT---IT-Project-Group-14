// tests/controllers/abs.controller.test.js
import { jest } from "@jest/globals";

jest.unstable_mockModule("../../src/services/abs.service.js", () => ({
  filter_abs: jest.fn(),
}));

const { filter_abs } = await import("../../src/services/abs.service.js");
const { fetch_abs } = await import("../../src/controllers/abs.controller.js");


const makeRes = () => {
  const res = {};
  res.status = jest.fn(() => res); 
  res.json = jest.fn(() => res);
  return res;
};

describe("fetch_abs controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test(" Positive: returns filtered documents and lowercases query keys", async () => {
    const req = {
      query: {
        ABSID: "1",
        FileID: "2",
      },
    };
    const res = makeRes();

    const mockData = [{ absid: 1, value: 100 }];
    filter_abs.mockResolvedValue(mockData);

    await fetch_abs(req, res);

    expect(filter_abs).toHaveBeenCalledWith({
      absid: "1",
      fileid: "2",
    });

    expect(res.json).toHaveBeenCalledWith(mockData);
    expect(res.status).not.toHaveBeenCalled();
  });

  test(" Negative: service throws error, responds 500", async () => {
    const req = { query: { ABSID: "1" } };
    const res = makeRes();

    const error = new Error("DB failure");
    filter_abs.mockRejectedValue(error);

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await fetch_abs(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DB failure" });

    consoleSpy.mockRestore();
  });
});
