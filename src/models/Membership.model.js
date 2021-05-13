const mongoose = require("mongoose");

const { Schema } = mongoose;

const MembershipSchema = new Schema(
     {
          idBusiness: {
               type: Schema.Types.ObjectId,
               ref: "business",
               required: true,
               autopopulate: false,
          },
          ruc: { type: Number, maxlength: 11, minlength: 11 },
          amount: { type: Number },
          frecuency: {
               type: new Schema(
                    {
                         value: { type: Number, default: 1 },
                         unit: { type: String, enum: ["months", "days"], default: "months" },
                    },
                    { _id: false }
               ),
          },
          plan: { type: String },

          renovals: { type: Number, default: 0 },
          //HOW MANY YEARS DID
          current_period: { type: Number, default: 0 },
          //NUMBER OF PAYMENTS OF SUSCRIPTION
          last_paid: { type: Date },
          next_void: { type: Date },
          must_pay: { type: Boolean, default: false },
          //IF NEXT VOID IS CURRENT DATE SHOULD BE TRUE TO NOTIFY USER IN PLATFORM TO FIRST PAY NEXT PERIOD

          authorized: { type: String, enum: ["confirmed", "rejected", "cancelled", "pending"], default: "pending" },
          //CONFIRMED: ALL INFO VALIDATED PROCEED TO USE PLATFORM, REJECTED: NOT ABLE TO USE PLATFORM, CANCELLED: USER DECIDE TO ABORT SUSCRIPTION

          free_initial: { type: Boolean, default: false },
          last_preference_id: { type: String, default: "" },
          first_paid: { type: Boolean, default: false },
          //TRUE: SE CREO LA PREFERENCIA Y SE PAGO, FALSE(TO BE DELETED): SE CREO LA PREFERENCIA PERO NO SE PAGO

          cancelled_dates: [{ type: Date }],
          last_cancelled_date: { type: Date },
          remain_days: { type: Number },
          totally_annulled: { type: Boolean },
     },
     { timestamps: { createdAt: true, updatedAt: true } }
);

MembershipSchema.methods.toJSON = function () {
     const member = this.toObject();
     return member;
};

module.exports = mongoose.model("Membership", MembershipSchema);
