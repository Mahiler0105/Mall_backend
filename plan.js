// 1. Completar logica de soporte en frontend
// CODE: GENERAL_SUPPORT,
// let variables = { name: "", lastname: "", email: "", phone: "", message: "" };

// 2. Avisos -> Avisos de negocio
// Nueva ruta /business/publicity
// Views:[plans:"Planes", advices:"Avisos de negocio", carousel:"Carrusel", social_network:"Redes Sociales"]
// Eliminar Publicity y Avisos de "Gestion de negocio"

//3. Tres modelos: Publicity, Booking, Program
// let Publicity = {
//      idBusiness: "",
//      ?idOrder: "",
//      ?idPurchase: "",
//      permissions: [],
//      expired: false,
//      months_contracted: 0,
//      current_month: 0,
//      start_date: "",
//      end_date: "",
//      amount_paid: 0,
//      payment_date: "",
//      bookings_quantity: 0,
//      bookings: [],
// };
//   booking_type, permissions:[
//      "HOME_DIALOGUE_ADVERTISEMENT",
//      "BANNER_CAROUSEL_SUBSCRIPTION",
//      "SOCIAL_NETWORK_POSTS",
//      "CATEGORIES_CAROUSEL_ARTICLE",
//      "BUSINESS_CAROUSEL_HIGHLIGHT"
//   ]
// let publicity_codes = {
//      HOME_DIALOGUE_ADVERTISEMENT: {
//           name: "HOME_DIALOGUE_ADVERTISEMENT",
//           item_price: 0,
//           min_item: 1,
//           max_item: 5,
//      },
//      BANNER_CAROUSEL_SUBSCRIPTION: {
//           name: "BANNER_CAROUSEL_SUBSCRIPTION",
//           item_price: 0,
//           min_item: 1,
//           max_item: 5,
//      },
//      SOCIAL_NETWORK_POSTS: {
//           name: "SOCIAL_NETWORK_POSTS",
//           item_price: 0,
//           min_item: 1,
//           max_item: 5,
//      },
//      CATEGORIES_CAROUSEL_ARTICLE: {
//           name: "CATEGORIES_CAROUSEL_ARTICLE",
//           item_price: 0,
//           min_item: 1,
//           max_item: 5,
//      },
//      BUSINESS_CAROUSEL_HIGHLIGHT: {
//           name: "BUSINESS_CAROUSEL_HIGHLIGHT",
//           item_price: 0,
//           min_item: 1,
//           max_item: 5,
//      },
// };

// let Booking = {
//      idBusiness: "",
//      idPublicity: "",
//      booking_type: "",
//      requested_date: "",
//      approved_date: "",
//      variables: { image: "", article: "", business: "" },
//      processed: false,
//      status: ["pending", "approved", "rejected"],
// };

// let Program = {
//      date_in_question: "",
//      advices: [],
//      banners: [],
//      posts: [],
//      articles: [],
//      topCategory: [],
//      topBusiness: [],
//      business: [],
// };

// 4. Notificaciones en vivo

// let Notifications = {
//      idBusiness: "",
//      idCustomer: "",
//      sender: ["system", ""],
//      message: "",
//      image: "",
//      seen: false,
// };

// 5. Los envios

// let Shipments = {
//      idProduct: "",
//      idCustomer: "",
//      quantity: 0,
//      description: "",
//      picture_url: "",
//      title: "",
//      unit_price: 0,
//      category_id: "",

//      sender: { name: "", doc_number: "" },
//      sent_date: "",
//      estimated_arrival_date: "",
//      origin: "",
//      destination: "",
//      status: ["dispatched", "confirmed"],
//      confirmed_date: "",
// };

// 6. Los chats

// let Sessions = {
//      idBusiness: "",
//      idCustomer: "",
//      closed_at: "",
// };
// let Chat = {
//      idSession: "",
//      idAfter: "",
//      sender: ["business", "customer"],
//      message: "",
// };
