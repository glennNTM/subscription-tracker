import mongoose from "mongoose"

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription is required"],
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    price: {
      type: Number,
      required: [true, "Subscription price is required"],
      min: [0, "Price must be greater than 0"],
      max: [1000, "Price must be less than 1000"],
    },
    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP"],
      default: "USD",
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      default: "monthly",
    },
    category: {
      type: String,
      enum: [
        "sports",
        "news",
        "entertainment",
        "business",
        "technology",
        "education",
        "finance",
        "politics",
        "other",
      ],
      default: "other",
      required: [true, "Subscription category is required"],
    },
    paymentMethod: {
      type: String,
      required: [true, "Subscription payment method is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "expired"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: "Start date must be in the past",
      },
    },
    renewalDate: {
      type: Date,
      required: true,
      default: Date.now,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "Renewal date must be after start date",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Subscription user is required"],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hook: calcule automatiquement la renewalDate si elle est absente
subscriptionSchema.pre("save", function (next) {
  if (!this.renewalDate) {
    const renewalPeriods = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };
    const daysToAdd = renewalPeriods[this.frequency] || 30;
    const newDate = new Date(this.startDate);
    newDate.setDate(newDate.getDate() + daysToAdd);
    this.renewalDate = newDate;
  }

  if (this.renewalDate < new Date()) {
    this.status = "expired";
  }

  next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
