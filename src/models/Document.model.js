const mongoose = require("mongoose");

const { Schema } = mongoose;

const DocumentSchema = new Schema(
     {
          dni: { type: String, maxlength: 8, minlength: 8 },
          digito: { type: String, maxlength: 1 },
          apellido_paterno: { type: String },
          apellido_materno: { type: String },
          nombres: { type: String },
          nombres_completos: { type: String },
          f_nacimiento: { type: String },
          sexo: { type: String },
          direccion: { type: String },
          departamento: { type: String },
          provincia: { type: String },
          distrito: { type: String },

          denomination: { type: String },
          ruc: { type: String, maxlength: 11, minlength: 11 },
          comercial_name: { type: String },
          type_society: { type: String },
          status: { type: String },
          condition: { type: String },
          person: {
               type: new Schema(
                    {
                         dni: { type: String, maxlength: 8, minlength: 8 },
                         name: { type: String },
                         address: { type: String },
                         department: { type: String },
                         province: { type: String },
                         district: { type: String },
                         date_from: { type: Date },

                         document: { type: String },
                         doc_number: { type: String, maxlength: 11, minlength: 8 },
                         charge: { type: String },
                    },
                    { _id: false }
               ),
          },
          //COMMON
          type: { type: String, enum: ["ruc", "dni"], required: true },
     },
     { timestamps: { createdAt: true, updatedAt: true } }
);

DocumentSchema.methods.toJSON = function () {
     const document = this.toObject();
     return document;
};

module.exports = mongoose.model("Document", DocumentSchema);
