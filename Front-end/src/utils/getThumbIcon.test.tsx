import getThumbIcon from "./getThumbIcon";
import { FaThumbsUp, FaHandPaper, FaThumbsDown } from "react-icons/fa";

describe("getThumbIcon", () => {
  it("returns FaThumbsUp when score >= 75", () => {
    const element = getThumbIcon(90);
    expect(element.type).toBe(FaThumbsUp);
    expect(element.props.className).toContain("text-green-600");
  });

  it("returns FaHandPaper when 50 <= score < 75", () => {
    const element = getThumbIcon(60);
    expect(element.type).toBe(FaHandPaper);
    expect(element.props.className).toContain("text-yellow-600");
  });

  it("returns FaThumbsDown when score < 50", () => {
    const element = getThumbIcon(40);
    expect(element.type).toBe(FaThumbsDown);
    expect(element.props.className).toContain("text-red-500");
  });
});