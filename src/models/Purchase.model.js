const mongoose = require("mongoose");
const { Schema } = mongoose;

const operations_type = [
     "regular_payment",
     "money_transfer",
     "recurring_payment",
     "account_fund",
     "payment_addition",
     "cellphone_recharge",
     "pos_payment",
];
const payments_types = ["account_money", "ticket", "bank_transfer", "atm", "credit_card", "debit_card", "prepaid_card"];
const payments_methods = ["visa", "debvisa", "pagoefectivo_atm", "amex", "master", "debmaster", "diners", "medioTest"];
const docs = ["DNI", "RUC", "C.E", "Otro"];
const payer_types = ["customer", "registered", "guest"];
const status_types = ["pending", "approved", "authorized", "in_process", "in_mediation", "rejected", "cancelled", "refunded", "charged_back"];
const lerits = ["offered", "declined", "returned", "observed"];
// operation_type
// //
// 	"regular_payment": Tipificación por defecto de una compra pagada por Mercado Pago.
// 	"money_transfer": Transferencia de fondos entre usuarios.
// 	"recurring_payment": Pago recurrente automático por una suscripción de un usuario activo.
// 	"account_fund": Ingreso de fondos en la cuenta del usuario.
// 	"payment_addition": Addition of money to an existing payment, made through a Mercado Pago account.
// 	"cellphone_recharge": Recarga de la cuenta telefónica de un usuario.
// 	"pos_payment": Payment done through a Point of Sale.
// //
// payment_type_id
// //
// 	"account_money": Money in the Mercado Pago account.
// 	"ticket": Ticket impreso
// 	"bank_transfer": Transferencia bancaria.
// 	"atm": Pago en ATM.
// 	"credit_card": Pago con tarjeta de crédito.
// 	"debit_card": Pago con tarjeta de débito.
// 	"prepaid_card": Pago con tarjeta prepaga.
// //
//Payer type
// "customer": El pagador es un cliente y pertenece al collector.
// "registered": La cuenta corresponde a un usuario registrado de Mercado Pago.
// "guest": El pagador no tiene una cuenta.
// Status
// //
// 	"pending": El usuario no completó el proceso de pago todavía.
// 	"approved": El pago fue aprobado y acreditado.
// 	"authorized": El pago fue autorizado pero no capturado todavía.
// 	"in_process": El pago está en revisión.
// 	"in_mediation": El usuario inició una disputa.
// 	"rejected": El pago fue rechazado. El usuario podría reintentar el pago.
// 	"cancelled": El pago fue cancelado por una de las partes o el pago expiró.
// 	"refunded": El pago fue devuelto al usuario.
// 	"charged_back": Se ha realizado un contracargo en la tarjeta de crédito del comprador.
// //

const PurchaseSchema = new Schema(
     {
          idClient: {
               type: Schema.Types.ObjectId,
               ref: "customer",
               required: true,
               autopopulate: false,
          },
          business: [
               {
                    type: Schema.Types.ObjectId,
                    ref: "business",
                    required: true,
                    autopopulate: false,
               },
          ],
          // idBusiness: {
          //      type: Schema.Types.ObjectId,
          //      ref: "business",
          //      required: true,
          //      autopopulate: false,
          // },
          orders: [
               {
                    type: Schema.Types.ObjectId,
                    ref: "order",
                    required: true,
                    autopopulate: false,
               },
          ],
          // idOrder: {
          //      type: Schema.Types.ObjectId,
          //      ref: "order",
          //      required: true,
          //      autopopulate: false,
          // },
          payment_id: { type: String, default: null },
          merchant_order_id: { type: String, default: null },

          issuer_id: { type: String, default: null },
          currency_id: { type: String, default: null },
          operation_type: { type: String, default: null, enum: operations_type },
          payment_type_id: { type: String, default: null, enum: payments_types },
          payment_method_id: { type: String, default: null, enum: payments_methods },
          description: { type: String, default: null },
          statement_descriptor: { type: String, default: null },
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
          card: {
               type: new Schema(
                    {
                         identification: {
                              type: new Schema(
                                   {
                                        number: { type: String, required: true },
                                        type: { type: String, required: true, enum: docs },
                                   },
                                   { _id: false }
                              ),
                         },
                         name: { type: String, default: null },
                         expiration_month: { type: Number, default: null },
                         expiration_year: { type: Number, default: null },
                         first_six_digits: { type: String, default: null },
                         last_four_digits: { type: String, default: null },
                    },
                    { _id: false }
               ),
          },
          dates: {
               type: new Schema(
                    {
                         date_approved: { type: Date, default: null },
                         date_created: { type: Date, default: null },
                         date_last_updated: { type: Date, default: null },
                    },
                    { _id: false }
               ),
          },
          refunds: [
               {
                    type: new Schema(
                         {
                              adjustment_amount: { type: Number, default: null },
                              amount: { type: Number, default: null },
                              date_created: { type: Date, default: null },
                              id: { type: String, default: null },
                              payment_id: { type: String, default: null },
                              reason: { type: String, default: null },
                              refund_mode: { type: String, default: null },
                              status: { type: String, default: null },
                              source: {
                                   type: new Schema(
                                        {
                                             id: { type: String, default: null },
                                             name: { type: String, default: null },
                                             type: { type: String, default: null },
                                        },
                                        { _id: false }
                                   ),
                              },
                         },
                         { _id: false }
                    ),
               },
          ],
          amounts: {
               type: new Schema(
                    {
                         installments: { type: Number, default: null },
                         coupon_amount: { type: Number, default: null },
                         fee_amount: { type: Number, default: null },
                         shipping_amount: { type: Number, default: null },
                         taxes_amount: { type: Number, default: null },
                         transaction_amount: { type: Number, default: null },
                         transaction_amount_refunded: { type: Number, default: null },
                         installment_amount: { type: Number, default: null },
                         net_received_amount: { type: Number, default: null },
                         overpaid_amount: { type: Number, default: null },
                         total_paid_amount: { type: Number, default: null },
                    },
                    { _id: false }
               ),
          },
          status: {
               type: new Schema(
                    {
                         lerit_status: { type: String, default: null, enum: lerits }, //offered: when payment finish and its visible to user, declined: when user sends a request to be withdrawn, returned: payment return to customer, observed:no able to return money
                         mp_status: { type: String, default: null, enum: status_types },
                    },
                    { _id: false }
               ),
          },
          additional_info: {
               type: new Schema(
                    {
                         ip_address: { type: String, default: null },
                         payer: {
                              type: new Schema(
                                   {
                                        id: { type: String, default: null },
                                        type: { type: String, default: "guest", enum: payer_types },
                                   },
                                   { _id: false }
                              ),
                         },
                    },
                    { _id: false }
               ),
          },
     },
     { timestamps: { createdAt: true, updatedAt: true } }
);

module.exports = mongoose.model("Purchase", PurchaseSchema);

// let a = {
// payment_id: 14496039686,
// order_id: 2566447491,
// customerId: "",
// businessId: "",
// internal_orderId: "",
// issuer_id: "1070",
// currency_id: "PEN",
// operation_type: "regular_payment",
// description: "Mitos de Cthulhu",
// payment_method_id: "debvisa",
// payment_type_id: "debit_card",
// statement_descriptor: "LERIETMALL",
// additional_info: {
//      ip_address: "179.7.225.225",
//      items: [
//           {
//                category_id: null,
//                description: null,
//                id: null,
//                picture_url:
//                     "https://storage.googleapis.com/lerietmall-302923/5ff872826992d2000e9d0e86/products/5ff87cde6992d2000e9d0e88/74b044bb-8caf-44ce-8803-846394d0a79a.jpeg",
//                quantity: "1",
//                title: "Mitos de Cthulhu",
//                unit_price: "10.0",
//           },
//      ],
// },
// card: {
//      identification: {
//           number: "72797033",
//           type: "DNI",
//      },
//      name: "FERNANDO MAHILER CHULLO MAMANI",
//      expiration_month: 6,
//      expiration_year: 2024,
//      first_six_digits: "421355",
//      last_four_digits: "6420",
// },
// payer: {
//      id: "738191046",
//      type: "guest",
// },
// dates: {
//      date_approved: "2021-04-17T19:09:59.000-04:00",
//      date_created: "2021-04-17T19:09:56.000-04:00",
//      date_last_updated: "2021-04-17T19:15:05.000-04:00",
// },
// refunds: [
//      {
//           adjustment_amount: 0,
//           amount: 10,
//           date_created: "2021-04-17T19:15:00.000-04:00",
//           id: 867182640,
//           payment_id: 14496039686,
//           reason: null,
//           refund_mode: "standard",
//           source: {
//                id: "744446817",
//                name: "Legión Revolucionaria de Innov Legión Revolucionaria de Innov",
//                type: "collector",
//           },
//           status: "approved",
//      },
// ],
// amounts: {
//      installments: 1,
//      coupon_amount: 0,
//      fee_amount: 1.65,
//      shipping_amount: 0,
//      taxes_amount: 0,
//      transaction_amount: 10,
//      transaction_amount_refunded: 10,
//      installment_amount: 10,
//      net_received_amount: 8.35,
//      overpaid_amount: 0,
//      total_paid_amount: 10,
// },
// status: {
//      lerit_status: "pending",
//      mp_staus: "refunded",
// },
// };
