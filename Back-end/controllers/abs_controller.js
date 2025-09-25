import abs_schema from '../models/abs_benchmarkings.js'
import abs_value_schema from '../models/abs_values.js'

export async function fetch_abs(req, res, next) {
    const id = req.query.absid
    const document = await abs_schema.findOne({ ABSID: id })
    const value = await abs_value_schema.find({ ABSID: id })
    const response = value.map(value => ({
        ABSID: document.ABSID,
        Benchmark: document.Benchmark,
        Unit: document.Unit,
        ApplicationID: value.ApplicationID,
        ANZICCode: value.ANZICCode,
        Field: value.Field,
        ABSValue: value.ABSValue,
        CalcValue: value.CalcValue,
        Analysis: value.Analysis
    }))

    res.json(response)
}

export async function fetch_benchmark(req, res, next) {
    const metric = req.query.Benchmark
    const result = await abs_schema.find({ Benchmark: {$regex: metric, $options: 'i'} })
    res.json(result)
}

export async function fetch_all_abs(req, res, next) {
    try {
        const documents = await abs_schema.find()
        res.json(documents)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}