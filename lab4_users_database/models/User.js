const mongoose = require("mongoose");
const validator = require("validator");

const phoneRegex = /^\d-\d{3}-\d{3}-\d{4}$/;     // 1-123-123-1234
const zipRegex = /^\d{5}-\d{4}$/;               // 12345-1234
const cityRegex = /^[A-Za-z ]+$/;               // alphabets + space only

const GeoSchema = new mongoose.Schema(
    {
        lat: { type: String, required: [true, "Geo lat is required"] },
        lng: { type: String, required: [true, "Geo lng is required"] },
    },
    { _id: false }
);

const AddressSchema = new mongoose.Schema(
    {
        street: { type: String, required: [true, "Street is required"] },
        suite: { type: String, required: [true, "Suite is required"] },
        city: {
            type: String,
            required: [true, "City is required"],
            validate: {
                validator: (v) => cityRegex.test(v),
                message: "City must contain only alphabets and spaces",
            },
        },
        zipcode: {
            type: String,
            required: [true, "Zipcode is required"],
            validate: {
                validator: (v) => zipRegex.test(v),
                message: "Zipcode must be in format 12345-1234",
            },
        },
        geo: { type: GeoSchema, required: [true, "Geo is required"] },
    },
    { _id: false }
);

const CompanySchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, "Company name is required"] },
        catchPhrase: { type: String, required: [true, "Company catchPhrase is required"] },
        bs: { type: String, required: [true, "Company bs is required"] },
    },
    { _id: false }
);

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, "Name is required"] },

        username: {
            type: String,
            required: [true, "Username is required"],
            minlength: [4, "Username must be at least 4 characters"],
            maxlength: [100, "Username must be at most 100 characters"],
            trim: true,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            validate: {
                validator: (v) => validator.isEmail(v),
                message: "Email must be a valid email address",
            },
        },

        address: { type: AddressSchema, required: [true, "Address is required"] },

        phone: {
            type: String,
            required: [true, "Phone is required"],
            validate: {
                validator: (v) => phoneRegex.test(v),
                message: "Phone must be in format 1-123-123-1234",
            },
        },

        website: {
            type: String,
            required: [true, "Website is required"],
            validate: {
                validator: (v) =>
                    validator.isURL(v, { require_protocol: true, protocols: ["http", "https"] }),
                message: "Website must be a valid URL starting with http or https",
            },
        },

        company: { type: CompanySchema, required: [true, "Company is required"] },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
