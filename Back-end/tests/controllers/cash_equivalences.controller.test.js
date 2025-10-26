import { jest } from "@jest/globals";

jest.unstable_mockModule("../../src/services/cash_equivalences.service.js", () => ({
  filter_cash_equivalences: jest.fn(),
}));

const { filter_cash_equivalences } = await import(
  "../../src/services/cash_equivalences.service.js"
);
const { fetch_cash_equivalences } = await import(
  "../../src/controllers/cash_equivalences.controller.js"
);

const make_res = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("fetch_cash_equivalences_controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("positive: returns filtered documents and lowercases query keys", async () => {
    const req = {
      query: {
        company_id: "1002",
        application_id: "2",
        file_id: "3",
        unit: "$",
      },
    };
    const res = make_res();

    const mock_data = [{ company_id: 1002, value: 500 }];
    filter_cash_equivalences.mockResolvedValue(mock_data);

    await fetch_cash_equivalences(req, res);

    expect(filter_cash_equivalences).toHaveBeenCalledWith({
      company_id: "1002",
      application_id: "2",
      file_id: "3",
      unit: "$",
    });
    expect(res.json).toHaveBeenCalledWith(mock_data);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("negative: service throws → responds 500 with error message", async () => {
    const req = { query: { company_id: "1002" } };
    const res = make_res();

    const err = new Error("DB failure");
    filter_cash_equivalences.mockRejectedValue(err);

    await fetch_cash_equivalences(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DB failure" });
  });
});
