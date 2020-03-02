const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  // making copy of request . query
  const reqQuery = { ...req.query };

  // create a aray of fields to remove to match
  const removeFields = ["select", "sort", "page", "limit"];

  // loop over fields to remove
  removeFields.forEach(param => delete reqQuery[param]);

  // creates a query string
  let queryStr = JSON.stringify(reqQuery);

  // create operators $gte, $gt, $lt ect
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // finding resources
  query = model.find(JSON.parse(queryStr));

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // sort
  if (req.query.sort) {
    const sortby = req.query.sort.split(",").join(" ");
    query = query.sort(sortby);
  } else {
    query = query.sort("-createdAt");
  }

  // pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // population
  if(populate) {
    query = query.populate(populate)
  }

  // executing query
  const results = await query;

  // pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results
  };

  next();
};

module.exports = advancedResults;
