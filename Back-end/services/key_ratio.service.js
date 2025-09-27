import keyRatioModel from "../models/key_ratio.model.js";

const FILE_TIMELINE = {
    1: '2023',
    2: '2024',
    3: '2025',
};

function toTimeline(fileId) {
  return FILE_TIMELINE[fileId] || `File ${fileId}`;
}

// get values by metric name, app.ID and optional file id 
// return only ONE row if file id provided
export async function getRatioByMetricNameService({ metricName, applicationId, fileId }) {
  validateInputs(metricName, applicationId);

  const pipeline = buildPipeline(metricName, applicationId, fileId);
  const docs = await keyRatioModel.aggregate(pipeline).allowDiskUse(true);

  return formatResult(docs, metricName);
}

function validateInputs(metricName, applicationId) {
  if (!metricName || applicationId == null) {
    const err = new Error('metricName and applicationId are required');
    err.status = 400;
    throw err;
  }
}

function formatResult(docs, metricName) {
  if (!docs.length || !docs[0].data.length) {
    return {
      metricName,
      unit: docs[0]?.unit ?? null,
      data: [],
    };
  }
  return docs[0];
}

function buildPipeline(metric, applicationId, fileId) {
  const baseMatch = {
    Metric: { $regex: `^${escapeRegex(metric)}$`, $options: 'i' },
  };

  return [
    { $match: baseMatch },
    {
      $lookup: {
        from: 'key_ratios_values',
        localField: 'KeyRatioID',
        foreignField: 'KeyRatioID',
        as: 'rows',
        pipeline: [
          { $match: { ApplicationID: Number(applicationId) } },
          ( fileId != null ? [{ $match: { FileID: Number(fileId) } }] : []),
          { $project: { _id: 0, KeyRatioID: 1, ApplicationID: 1, FileID: 1, Value: 1 } },
          { $sort: { FileID: 1 } },
        ],
      },
    },
    {
      $project: {
        _id: 0,
        metric: '$Metric',
        unit: '$Unit',
        data: {
          $map: {
            input: '$rows',
            as: 'r',
            in: {
              timeline: fileIdToTimeline('$$r.FileID'),
              value: '$$r.Value',
            },
          },
        },
      },
    },
  ];
}




