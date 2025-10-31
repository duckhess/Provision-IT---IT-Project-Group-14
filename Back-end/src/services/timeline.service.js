import timeline_schema from "../models/timelines.js";

export async function get_period(file_ids = []) {
  // file_ids expected to be an array of numbers

  if (!Array.isArray(file_ids) || file_ids.length === 0) {
    return new Map(); // return empty map if no file_ids
  }

  // Query Timelines collection with the FileIDs
  const timelines = await timeline_schema.find({ FileID: { $in: file_ids } }).lean();

  // Map FileID => period
  const period_map = new Map();
  timelines.forEach((doc) => {
    period_map.set(doc.FileID, doc.period);
  });

  return period_map;
}
