const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FactorySchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is a required field!"]
    },
    children: {
        type: Number,
        required: [true, "The number of children nodes is a required field! Cannot be a whole number more than 15 and less than 1."],
        // Mongoose has built in validation for numbers, so you can set the min and max for values here.
        min: [1, "Min value must be at least 1."],
        max: [15, "Max value must be at most 15."]
    },
    min: {
        type: Number,
        required: [true, "The minimum range is a required field!"],
        // Setting minimum as 0 prevents negative numbers in user input
        min: 0
    },
    max: {
        type: Number,
        required: [true, "The maximum range is a required field!"],
        max: 1000000
    },
    childArray: {
        type: Array
    }
});

module.exports = Factory = mongoose.model("factory", FactorySchema);