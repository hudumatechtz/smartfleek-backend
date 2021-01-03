const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    product: {
      type: String,
      required: true,
    },
    retailPrice: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      default: "General",
      required: true,
    },
    catalog: {
      type: String,
      default: "General",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    shop: {
      email: {
        type: String,
        required: true,
      },
      shopId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Shop",
      },
    },
    images: {
      imagePaths: [],
    },
    wholeSalePrice: {
      type: String,
      required: false,
    },
    wholeSaleQuantity: {
      type: String,
      required: false,
    },
    unit: {
      type: String,
      required: false,
    },
    saleable: {
      type: Boolean,
      required: false,
      default: true,
    },
    stockable: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  { timestamps: true }
);
// productSchema.methods.addToImagesArray = function(imagePaths){
//   const imagePathsList = [...this.images.imagePaths];
//   imagePaths.forEach(element => {
//     imagePathsList.push({
//       imagePath : element
//     });
//   });
//   const updatedImagePaths = { images : imagePathsList};
//   return updatedImagePaths;
// };
module.exports = mongoose.model("Product", productSchema);
