const { Schema, model } = require("mongoose");

const ListingSchema = Schema({
  created_by: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [
      true,
      "Establecer el usuario que ha creado el anuncio es obligatorio",
    ],
  },
  state: {
    type: Boolean,
    default: true,
  },
  address: {
    type: Schema.Types.ObjectId,
    ref: "Address",
    required: [true, "Establecer la dirección del anuncio es obligatorio"],
  },
  date_publication: {
    type: Date,
    default: Date.now,
  },
  pets_allowed: {
    type: Schema.Types.ObjectId,
    ref: "Pets_allowed",
    required: [
      true,
      "Establecer las mascotas admitidas en el anuncio es obligatorio",
    ],
  },
  photos: [
    
      {
        type: Schema.Types.ObjectId,
        ref: "Photo",
      },
    
  ],
  // photos: [
  //   {
  //     id: {
  //       type: Schema.Types.ObjectId,
  //       ref: "Photo",
  //     },
  //   },
  // ],
  price: {
    type: Number,
    required: [
      true,
      "Establecer el precio del piso en el anuncio es obligatorio",
    ],
  },
  description: {
    type: String,
  },
});

ListingSchema.methods.toJSON = function () {
  const { __v, _id, ...listing } = this.toObject();
  listing.uid = _id;
  return listing;
};

module.exports = model("Listing", ListingSchema);
