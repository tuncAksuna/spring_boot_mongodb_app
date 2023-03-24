db.customer.insertOne({
  firstName: "ali",
  lastName: "veli",
});

db.customer.find({ height: 200 }); // select * from customer where height=200
db.customer.find({ height: 200 }, { firstName: 1 }); // select firstName from customer where height=200

db.movies
  .find({ runtime_min: 191, gross: { $gte: 185000000 } })
  .explain("executionStats");

db.movies
  .find({ genres: "Drama", gross: { $gte: 180000000 } })
  .explain("executionStats");

db.car.aggregate([
  {
    $match: { _id: "737516871-7" },
  },
  {
    $addFields: {
      myArray: "$variations",
      total: {
        $round: [{ $sum: ["$year", "$price"] }, 1],
      },
    },
  },
  {
    $project: { name: 1, model: 1, myArray: 1, total: 1 },
  },
  {
    $addFields: {
      length: { $size: "$myArray" },
    },
  },
]);

db.car.aggregate([
  {
    $match: { name: "Ford" },
  },
  {
    $addFields: {
      myArray: "$variations",
      total: {
        $round: [{ $sum: ["$year", "$price"] }, 1],
      },
    },
  },
  {
    $project: { name: 1, model: 1, myArray: 1, total: 1 },
  },
  {
    $unwind: "$myArray",
  },
  {
    $limit: 5,
  },
  {
    $sort: { model: 1 },
  },
]);

db.car.aggregate([
  {
    $match: { name: "Ford" },
  },
  {
    $addFields: {
      myArray: "$variations",
      total: {
        $round: [{ $sum: ["$year", "$price"] }, 1],
      },
    },
  },
  {
    $project: { name: 1, model: 1, myArray: 1, total: 1 },
  },
  {
    $unwind: "$myArray",
  },
]);

db.car.aggregate([
  {
    $unwind: "$variations",
  },
  {
    $group: {
      _id: "$variations.variation",
      item_count: { $sum: 1 },
      avg_price: {
        $avg: "$price",
      },
    },
  },
  {
    $addFields: {
      avg_prc: {
        $round: ["$avg_price", 2],
      },
    },
  },
  {
    $project: { avg_price: 0 },
  },
  { $out: "car_group" },
]);

db.imdb.aggregate([
  {
    $group: {
      _id: "$year",
      total: {
        $sum: 1,
      },
      avg_runtime: {
        $avg: "$runtime",
      },
      total_runtime: {
        $sum: "$runtime",
      },
      imdb: {
        $avg: "$imdb.rating",
      },
      awards: {
        $sum: "$awards.wins",
      },
      countries: {
        $addToSet: { $first: "$countries" },
      },
    },
  },
]);

db.orders.aggregate([
  {
    $lookup: {
      from: "car",
      localField: "car_id",
      foreignField: "_id",
      as: "car",
    },
  },
]);

db.car.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "car_id",
      as: "orders",
    },
  },
]);

db.imdb.aggregate([
  {
    $bucket: {
      groupBy: "$year",
      boundaries: [1910, 1970, 1980, 1990, 2000, 2010, 2020],
      default: "other",
      output: {
        total: {
          $sum: 1,
        },
        avg_runtime: {
          $avg: "$runtime",
        },
        total_runtime: {
          $sum: "$runtime",
        },
        imdb: {
          $avg: "$imdb.rating",
        },
        awards: {
          $sum: "$awards.wins",
        },
      },
    },
  },
]);

db.imdb.aggregate([
  {
    $bucketAuto: {
      groupBy: "$year",
      buckets: 10,
      output: {
        total: {
          $sum: 1,
        },
        avg_runtime: {
          $avg: "$runtime",
        },
        total_runtime: {
          $sum: "$runtime",
        },
        imdb: {
          $avg: "$imdb.rating",
        },
        awards: {
          $sum: "$awards.wins",
        },
      },
    },
  },
]);

db.car.aggregate([
  {
    $group: {
      _id: ["$year", "$name"],
      total: {
        $sum: 1,
      },
      avg_price: {
        $avg: "$price",
      },
      total_price: {
        $sum: "$price",
      },
    },
  },
]);

db.imdb.find({
  $text: {
    $search: '"camera looks"',
  },
});

db.imdb.find({
  $text: {
    $search: "William",
  },
});

db.customer.aggregate([
  { $match: { last_name: "veli" } },
  { $sort: { firstName: 1 } },
]);

db.customer.aggregate([
  {
    $group: {
      _id: "$height",
      total: {
        $sum: 1,
      },
      avg_weight: {
        $avg: "$weight",
      },
      total_weight: {
        $sum: "$weight",
      },
    },
  },
]);

/* ****************************************************************************************************************************** */

/* SCHEMA VALIDATION */
db.createCollection("student_with_validation", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "firstName",
        "lastName",
        "country",
        "isStudentActive",
        "email",
        "totalSpentInBooks",
        "gender",
      ],
      properties: {
        firstName: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        lastName: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        country: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        isStudentActive: {
          bsonType: "bool",
          description: "must be a bool and is required",
        },
        gender: {
          enum: ["M", "F"],
          description: "can only be one of the enum values and is required",
        },
        favouriteSubjects: {
          bsonType: "array",
          description: "favourite subject is required",
        },
        totalSpentInBooks: {
          bsonType: "double",
          description: "must be a double if the field exists",
        },
        email: {
          bsonType: "string",
          pattern: "@adenon.com$",
          description:
            "must be a string and match the regular expression pattern",
        },
      },
    },
  },
});
