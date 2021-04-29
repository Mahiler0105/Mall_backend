const mongoose = require("mongoose");

const { Schema } = mongoose;
const statuses = ["opened", "closed", "expired"];
const order_statuses = ["payment_required", "reverted", "paid", "partially_reverted", "partially_paid", "payment_in_process", "undefined", "expired"];
// status
// Localización: Body
// Muestra el estado actual de la orden
// "opened": Orden sin pagos.
// "closed": Orden con pagos que cubren el monto total.
// "expired": Orden cancelada que no posee pagos aprobados ni pendientes (todos rechazados o devueltos).

// orderstatus
// Estado actual de la orden según el estado de los pagos
// "payment_required": Order without payments or with all payments "rejected" or "cancelled".
// "reverted": Order with all payments "refunded" or "chargeback".
// "paid": Order with the sum of all payments "approved", "chargeback" or "in_mediation" covers the order total amount.
// "partially_reverted": Order with at least one payment "refunded" or "chargeback".
// "partially_paid": Order with at least one payment "approved" and not covering order total amount.
// "payment_in_process": Order with payments "in_process", "pending" or "authorized".
// "undefined": Orden creada antes de la existencia del estado order_status.
// "expired": Orden cancelada que no posee pagos aprobados ni pendientes (todos rechazados o devueltos).

const OrderSchema = new Schema(
     {
          idClient: {
               type: Schema.Types.ObjectId,
               ref: "customer",
               required: true,
               autopopulate: false,
          },
          idBusiness: {
               type: Schema.Types.ObjectId,
               ref: "business",
               required: true,
               autopopulate: false,
          },
          merchant_order_id: { type: String, default: null },

          status: { type: String, default: null, enum: statuses },
          order_status: { type: String, default: "payment_required", enum: order_statuses },
          preference_id: { type: String, default: null },
          cancelled: { type: Boolean, default: false },
          amounts: {
               type: new Schema(
                    {
                         shipping_cost: { type: Number, default: null },
                         total_amount: { type: Number, default: null },
                         paid_amount: { type: Number, default: null },
                         refunded_amount: { type: Number, default: null },
                    },
                    { _id: false }
               ),
          },
          payments: [
               {
                    type: Schema.Types.ObjectId,
                    ref: "purchase",
                    required: true,
                    autopopulate: false,
               },
          ],
          // shipments: [],
          items: [
               {
                    type: new Schema(
                         {
                              id: { type: Schema.Types.ObjectId, ref: "product", required: false, autopopulate: false },
                              quantity: { type: Number, default: null },
                              description: { type: String, default: null },
                              picture_url: { type: String, default: null },
                              title: { type: String, default: null },
                              unit_price: { type: Number, default: null },
                              category_id: { type: String, default: null },
                              specification: {
                                   type: new Schema(
                                        {
                                             color: [{ type: String }],
                                             size: [{ type: String }],
                                        },
                                        { _id: false }
                                   ),
                              },
                         },
                         { _id: false }
                    ),
               },
          ],
          // delivered: { typse: Boolean },
          // date: { type: Date },
          // deliveredPersonName: { type: String },
          // phone: { type: String },
          // dni: { type: String },
          // status: { type: String, enum: ["0", "1", "2"] },
     },
     { timestamps: { createdAt: true, updatedAt: true } }
);

module.exports = mongoose.model("Order", OrderSchema);

// let a = {
//      //  id: 2566447491,
//      status: "closed",
//      order_status: "reverted",
//      preference_id: "744446817-38b6b9bc-1dee-44c6-9914-e53f951a3ee3",
//      cancelled: false,
//      shipping_cost: 0,
//      total_amount: 10,
//      paid_amount: 10,
//      refunded_amount: 10,

//      payments: [
//           {
//                id: 14496039686,
//           },
//      ],
//      shipments: [],
//      items: [
//           {
//                id: "",
//                category_id: "",
//                currency_id: "PEN",
//                description: "",
//                picture_url:
//                     "https://storage.googleapis.com/lerietmall-302923/5ff872826992d2000e9d0e86/products/5ff87cde6992d2000e9d0e88/74b044bb-8caf-44ce-8803-846394d0a79a.jpeg",
//                picture_id: "836023-MPE45610274115_042021",
//                title: "Mitos de Cthulhu",
//                quantity: 1,
//                unit_price: 10,
//           },
//      ],
// };
