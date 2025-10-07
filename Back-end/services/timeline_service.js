import timeline_schema from '../models/timelines.js'

const get_period = async (id) => {
    const result = await timeline_schema.find({FileID: id}).lean()
    return result.map(t => t.period)
}

const get_periods = async (id = []) => {

    const timelines = await timeline_schema.find({
        FileID: { $in: id }
    }).lean()

    const periods_map = new Map()
    timelines.forEach(doc => {
        const existing = periods_map.get(doc.FileID) || []
        existing.push(doc.period)
        periods_map.set(doc.FileID, existing)
    })

    return periods_map
}

const filter = async (filters) => {
    const all_files = filters.map(v => {
        FileID: v.FileID
    })
    const time = await timeline_schema.find({$or: all_files}).lean()
    const mapped_time = new Map()
    time.forEach(t => {
        const key = `${t.period}`
        mapped_time.set(key, t)
    })
    return mapped_time
}

export default {
    get_period,
    get_periods,
    filter
}