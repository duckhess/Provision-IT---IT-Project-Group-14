import timeline_schema from '../models/timelines.js'

export async function get_period(fileIDs = []) {
    // fileIDs expected to be an array of numbers

    if (!Array.isArray(fileIDs) || fileIDs.length === 0) {
    return new Map() // return empty map if no fileIDs
    }

    // Query Timelines collection with the FileIDs
    const timelines = await timeline_schema.find({ FileID: { $in: fileIDs } }).lean()

    // Map FileID => period
    const periodMap = new Map()
    timelines.forEach(doc => {
    periodMap.set(doc.FileID, doc.period)
    })

    return periodMap
}