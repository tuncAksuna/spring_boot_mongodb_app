/* FIND KOMUTLARI */

/* Greater than ($gt) - Less than ($lt) */

db.car.find({
  price: {
    $gt: 10000,
  },
});

db.car.find({
  price: {
    $lt: 10000,
  },
});

/* Like */

db.car.find({
  name: /Hyundai/, // Like %Hyundai%
});

db.car
  .find({
    name: /Dodge/,
  })
  .pretty(); // Like lowerCase()

db.car.find({
  name: /^Hyundai/, // Like %Hyundai
});

/* Belirtilen kolonu alma */

// name kolonunu alır :
db.car.find(
  {},
  {
    name: 1, // select c.name from car c
    _id: 0,
  }
);

// name ve model kolonunu alır :
db.car.find(
  {},
  {
    _id: 0, // select c.name,c.model from car c
    name: 1,
    model: 1,
  }
);

/* IN */
db.car.find({
  sale_frequency: {
    $in: ["Daily", "Often"], // select * from car c where c.sale_frequency in ("Often","Daily");
  },
});

/* IN uygula ve name-model-price kolonlarını çek !*/
db.car.find(
  {
    sale_frequency: {
      $in: ["Often", "Daily"], // select c.model,c.price,c.name from car c where c.in ("Often","Daily");
    },
  },
  {
    _id: 0,
    name: 1,
    moodel: 1,
    price: 1,
  }
);

/* ÖRNEK : source jazzy olanları al, model ve name kolonlarını getir, total fieldı ekle ve değeri year + price olsun */
db.car.find(
  {
    source: "Jazzy",
  },
  {
    total: {
      $sum: ["$year", "$price"],
    },
  },
  {
    _id: 0,
    name: 1,
    model: 1,
  }
);

/* Sonucu değişkene atama - cursor  */
var carCursor = db.car.find({
  name: "Ford",
});
carCursor.next();
carCursor.close(); // memoryi çok yediği için close etmek gerekir !

/* collection içindeki embedded dökumanın elemanlarına erişme : */
db.car.find({
  name: "Ford",
  "variations.variation": "Teal",
  "varitaions.quantity": {
    $gt: 15,
  },
});

/* Array elemanını çekmek */
db.movies.find({
  actors: "Lonni",
});

db.movies.find({
  actors: {
    $all: ["Lonni"],
  },
});

/* genres'lerden 0. elemanı comedy olanları ver */
db.movies.find({
  "genres.0": "Comedy",
});

/* UPDATE  - updateOne - updateMany*/
db.car.updateOne(
  {
    _id: "737516871-7",
  },
  {
    $set: { year: 2000 },
  }
);

/*  updateOne - Field silme */
db.car.updateOne(
  {
    _id: "737516871-7",
  },
  {
    $unset: {
      lastMo: "",
    },
  }
);

/* updateOne - push - car collection'ı içerisindeki variations array'ine değer ekleme */
db.car.updateOne(
  {
    _id: "577931198-6",
  },
  {
    $push: {
      variations: {
        variation: "Added new",
        quantity: 500,
      },
    },
  }
);

/* updateOne - pop -- variations arrayinin içindeki son değeri siler.*/
db.car.updateOne(
  {
    _id: "259810435-8",
  },
  {
    $pop: {
      variations: 1,
    },
  }
);

/* name'i Ford olanlar variationslarından 0. elemanın quantitylerini 5 yap */
db.car.updateMany(
  { name: "Ford" },
  {
    $set: {
      "variations.0.quantity": 0,
    },
  }
);

/* replaceOne : updateOne'dan farklı olarak varolan alanı günceller. updateOne yeni bir alan(field) ekler ve orayı değeri set eder yani eski fieldı silmez
https://stackoverflow.com/questions/35848688/whats-the-difference-between-replaceone-and-updateone-in-mongodb
*/
db.car.replaceOne(
  {
    _id: "244167659-8",
  },
  { name: "BMW", model: "520" }
);

//* INDEXING BAK ! https://muratcabuk.com/mongodbde-index-kullanımı-ve-sorgu-optimizasyonu-mongodb-öğreniyoruz-5-fa09843cc05

/* AGGREGATION - stage olarak çalışırlar ve stageler bir chain olarak çalışırlar */
// $undwind arrayi flat hale getirir. Array halinden çıkarır ve tek document haline getirir.

db.car.aggregate([
  {
    $unwind: "$variations",
  },
  {
    $group: {
      _id: "$variations.variation",
      item_count: {
        $sum: 1,
      },
      avg_price: {
        $avg: "$price", //price fieldlarının'ının ortalaması
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
    $project: { avg_price: 0 }, //avg_price dışındaki tüm kolonları getir dedik
  },
]);

/* JOIN : car ve orders arasında bağlantı var - order document'i içerisinde ilgili car document'ini koyar 
{
   $lookup:
     {
       from: <collection to join>,
       localField: <field from the input documents>,
       foreignField: <field from the documents of the "from" collection>,
       as: <output array field>
     }
}

*/
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

/* car ve orders documentlerini joinle ancak sadece car name'i BMW olanları  */
db.car.aggregate([
  {
    $match: {
      name: "BMW",
    },
  },
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

db.car.aggregate([
  {
    $group: {
      _id: ["$year", "$name "], //* year'a ve name'e göre grupla !
    },
  },
]);

/* AGGREGATION ÖRNEKLER : */

// * year'a göre grupla price ortalaması al, total ekle
db.car.aggregate([
  {
    $group: {
      _id: "$year", // year'a göre grupla (stage1)
      avg_price: {
        $avg: "$price", // price field'ının ortalamasını al (stage2)
      },
      total: {
        $sum: 1, //total field'ı ekle sum uygula (stage3)
      },
    },
  },
]);

// * modele göre group price ortalaması al, total ekle
db.car.aggregate([
  {
    $group: {
      _id: "$model",
      avg_price: {
        $avg: "$price",
      },
      total: {
        $sum: 1,
      },
    },
  },
]);

// * variation'a göre grupla price ortalaması al, total ekle
db.car.aggregate([
  {
    $group: {
      _id: "$variations.variation",
      avg_price: {
        $avg: "$price",
      },
      total: {
        $sum: 1,
      },
    },
  },
]);

// * year'a göre bucket yap price ortalaması al , total ekle

db.car.aggregate([
  {},
  {
    avg_price: {
      $avg: "$price",
    },
  },
]);

/*
 * CUSTOMER collection'ı oluştur (first_name,last_name,weight,height - CUSTOMER_PHONES collection'ı oluştur ve phone_name,phone_number,customer_id fieldı ekle)
 * 10 adet customer ekle (insertMany ile), her customer'a 2-3 tane phone ekle ve aggregation ile iki collection'ı bağla.
 */

db.createCollection("customer_collections");
db.customer_collections.insertOne({
  firstName: "*Cem Tunç",
  lastName: "Aksuna",
  weight: 93,
  height: 196,
});

db.createCollection("customer_phones");
db.customer_phones.insertOne({
  phone_name: "Iphone 11",
  phone_number: "5553511490",
  customer_id: "641d8ab9c1b4823dff191a5b",
});

/* $lookup ile documentleri joinledik */
db.customer_collections.aggregate([
  {
    $lookup: {
      from: "customer_phone",
      localField: "_id",
      foreignField: "customer_id",
      as: "customer_phone",
    },
  },
]);

db.customer_phone.aggregate([
  {
    $lookup: {
      from: "customer_collections",
      localField: "_id",
      foreignField: "customer_id",
      as: "customer_collections",
    },
  },
]);

/* TEXT SEARCH INDEX - $text*/

db.imdb.createIndex({ "$**": "text" }); //* bütün text alanlara index attık

db.imdb.find({
  $text: {
    $search: "camera looks", //* hem 'camera' hem 'look'u arar.
  },
});

db.imdb.find({
  $text: {
    $search: '"camera looks"', //* verilen her kelimeyi arar.
  },
});

db.imdb.find({
  $text: {
    $search: '"camera looks"',
    $caseSensitive: false, //* büyük küçük harfe takılmadan arar.
  },
});
