import { jest } from "@jest/globals";

jest.unstable_mockModule("../../src/services/abs.service.js", () => ({
  filter_abs: jest.fn(),
}));

const { filter_abs } = await import("../../src/services/abs.service.js");
const { fetch_abs_controller } = await import("../../src/controllers/abs.controller.js");

const make_res = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("fetch_abs_controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("✅ positive: returns filtered documents and lowercases query keys", async () => {
    const req = {
      query: {
        abs_id: "1",
        file_id: "2",
      },
    };
    const res = make_res();

    const mock_data = [{ abs_id: 1, value: 100 }];
    filter_abs.mockResolvedValue(mock_data);

    await fetch_abs_controller(req, res);

    expect(filter_abs).toHaveBeenCalledWith({
      abs_id: "1",
      file_id: "2",
    });

    expect(res.json).toHaveBeenCalledWith(mock_data);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("❌ negative: service throws error, responds 500", async () => {
    const req = { query: { abs_id: "1" } };
    const res = make_res();

    const error = new Error("DB failure");
    filter_abs.mockRejectedValue(error);

    const console_spy = jest.spyOn(console, "error").mockImplementation(() => {});

    await fetch_abs_controller(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DB failure" });

    console_spy.mockRestore();
  });
});
