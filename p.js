// {
//   "name": "Lerietbool",
//   "description":"Empresa de E-commerce",
//   "location":{
//         "latitude": "-45182",
//         "longitude": "-45182"
//    },
//    "logo":"https://www.siama.app",
//    "images":["https://www.siama.app", "https://www.siama.app" , "https://www.siama.app"],
//    "email": "siama@ucsm.edu.pe",
//    "phone":"945236846",
//    "telephone":"561245",
//    "category":"Deportes",
//    "subCategories": ["PriCat", "SecCat", "TerCat"],
//    "owner":{
//         "name":"Fernando Mahile",
//         "first_lname":"Chullo",
//         "second_lname":"Mamani",
//         "birthdate":"2020-10-25T21:06:30.696+00:00",
//         "sex": true,
//         "dni":"72797033",
//         "phone":"945373476"
//    },
//    "delivery": true,
//    "backAccount": "94961311313164",
//    "billing":{
//        "cardNumber": "466464646460",
//        "cvv":"465",
//        "expireDate":"2020-10-25T21:06:30.696+00:00"
//    },
//    "advertisement":{
//        "title": "Cierre por temporada de conejo",
//        "description":"Cerramos por temporada de conejo plox"
//    },
//    "openClose":{
//        "l":{
//            "open": "2020-10-25T21:06:30.696+00:00",
//            "close":"2020-10-25T21:06:30.696+00:00",
//            "enabled": true
//        },
//        "m":{
//         "open": "2020-10-25T21:06:30.696+00:00",
//         "close":"2020-10-25T21:06:30.696+00:00",
//         "enabled": true
//        },
//        "w":{
//         "open": "2020-10-25T21:06:30.696+00:00",
//         "close":"2020-10-25T21:06:30.696+00:00",
//         "enabled": true
//        },
//        "j":{
//         "open": "2020-10-25T21:06:30.696+00:00",
//         "close":"2020-10-25T21:06:30.696+00:00",
//         "enabled": true
//        },
//        "v":{
//         "open": "2020-10-25T21:06:30.696+00:00",
//         "close":"2020-10-25T21:06:30.696+00:00",
//         "enabled": true
//        },
//        "s":{
//         "open": "2020-10-25T21:06:30.696+00:00",
//         "close":"2020-10-25T21:06:30.696+00:00",
//         "enabled": true
//        },
//        "d":{
//         "open": "2020-10-25T21:06:30.696+00:00",
//         "close":"2020-10-25T21:06:30.696+00:00",
//         "enabled": true
//        }
//    },
//    "password":"josejose",
//    "active":true,
//    "plan":false,
//    "socialNetwork":{
//        "fecebook":"https://www.siama.com",
//        "instagram":"https://www.siama.com"
//    }
// }

// {
//     "name": "Fernando",
//     "first_lname":"Chullo",
//     "second_lname":"Mamani",
//     "birthdate":"",
//     "sex": true,
//     "dni":"72797033",
//     "phone": "945373476",
//     "email":"fernan@gmail.com",
//     "address":{
//         "latitude": "-50.000",
//         "longitude": "-50.000",
//         "department": "Arequipa",
//         "province": "Arequipa",
//         "district": "Distrito",
//     },
//     "billing":{
//         "cardNumber": "94512121313",
//         "cvv":"123",
//         "expireDate":""
//     },
//     "cart":[
//         {"productId":"4646461613131",
//         "quantity": 2,
//         "specifications":{ "color": "Red", "size":"xl"}
//         }
//     ],
//     "preferences":["aea", "anuma"],
//     "password": "123"
// }

// {
//     "name":"Coca Cola",
//     "price":2.50,
//     "images":["http", "http"],
//     "description": "Bebida energetica",
//     "stock":20,
//     "available":true,
//     "promotion":{
//         "type": true,
//         "dates":{
//             "start":"2020-10-25T21:06:30.696+00:00"
//             "end":"2020-10-25T21:06:30.696+00:00"
//         },
//         "value": 15
//     },
//     "category":"Nuenva",
//     "specificacion":{
//         "color":["rojo","azul"],
//         "size":["xl","xxl"]
//     },
//     "businessId":"5f9b4d844c990017f381a76a"
// }

// {
// "review":"Me parece un buen producto",
// "stars":2,
// "idClient":"5f9b40f72689d77ae41c5abe",
// "idProduct":"5f9c8ba8264c9a78e9301dd2"
// }

// v1/api/auth/signup/business
// v1/api/auth/signin/business

// v1/api/business               GETALL
// v1/api/business/:businessid   GET
// v1/api/business/:businessid   UPDATE
// v1/api/business/:businessid   DELETE

// v1/api/auth/signup/customer
// v1/api/auth/signin/customer

// v1/api/customer              GETALL
// v1/api/customer/:customerid  GET
// v1/api/customer/:customerid  UPDATE
// v1/api/customer/:customerid  DELETE
const { PRIVATE_KEY } = require("./src/config");
let a = {
  type: "service_account",
  project_id: "lerietmall",
  private_key_id: "be9efc3ee5d72c1a5d2605072081085b87de5e60",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCtCYKW1bXdMTre\nczuUw3dALSLBtJv4ud2SJk9gsA4G+ukI6g2coksxNhR/DxHejcGZOM6xuzSNpk71\ni5EzcVAtCP8hkS2lNEY8Gg2fBq94IDSY49FXqFz1Uh3EJXQnjSCmtxaiAMA1uU0q\n22xsjq3NUSSFvLshaWvQqHwhZ+gqoAkPeEEVnQwQ+E7cyrf6mszEY/4MjMBa5dhZ\nv/hawVvSfBdRB6+J37gFZ5hFpxzaGjEo2tUmu05TApQxG1NaR5OkW/K/EJNMseVA\nYpfXk+ycHgCgFOHRAkHYBaXRVclCA6vUFe6mmfKCJr3KIEFmY1Db26tWwL6Preef\nWxagy5KXAgMBAAECggEAA9YbJBb24kGOKZJqdsDiqvSVObA0aQ5N4EijJ+SfWv5D\nHmR6Csf6XMvzJmICJmoEKc59nqkk4CMYyw7eGELh4S264laiqXAAQqLdPHJcf5BP\nOjiK0qOz8+hvKoMeESZq2+dhRBQ6Lra+BD47KCj9p3iuE5z8lSAOOOETZ3YzSoaa\nZQ1LqpTI67qSp+2zszhd5HLFElioIDEkJ91T1pY5/OZitSB4iXLi6z0cu0YAQ6vU\n1VSkmqjIYm12u5og85ZeegaWg814c1aN6YnK1AcvI6Dju5WrLcmdzzvnduJjseg3\nhHZtgmTuo9Q4kvYidN61UmnKx42+p75ZRJjEWz9pGQKBgQDubf2HxSLJ1vNT6vHy\nywG5Y/wAEwi6g+tC+60CyQ9NC14r3AuEtAM41mn4MRuaaGKfxl3qK2jLTJ0jEMUo\n5YIvVZiHXAI8Kwr8fiuvYMyjZr06dehYreexXzZzLVjcmvZ4bPcmfcnoD18qxHPx\nbVwQQ3AOymrQ76jkEpNrgVNZfQKBgQC5yeF9m85jQmOzgCSYn9FCc35z0s1o4jUx\nSsjWOQ/dPzXzS4yzN+xJ8/ZoKTS7DtvzI9uKuvIhNDtODa9lLS69kKVfVl+Enxiu\nmb5U2csh86e2wL5Iv5gUo39DEDFTfl4sDzZlWYnpix4v+Qn4aCxk3li5u/1yCCVB\nDIJvZJN4owKBgBA1K+HZ1caQtRPESdQuVpyqnkvG/3XmV8zC3Pzue/rJxgoHOEU6\nE2n+sU9szyqM4/9mdaXgc4w2Vgw3LJ/eEh5znB2/dGtwpZuKXB/c3axR5JUfxL6a\ne8CD72ie8YZ1hkGjbp2QOXRr7xUyK4uC2ppEa06mFeLEF+ABH0JUlTzlAoGAdO90\n5ptHRsBFgng4EHweuKV6xKm8sbQW6MR6LiNSMd4UNeKqVy7uoQlVYO/2iXnrxFgg\nWWwa8/0tCo6gg5zxm0zMWXpCunVskpCf9EX0jZUPTX55Bc7ZiLvzYKFzemrCGRcm\nFJpLrFvsjyM/PENNFdvAmn6RIdGwqQWXn0b9buMCgYBYSVvrDQZNMgzk+npicOQQ\nYNztrZS7cPVmVGuCTDsQYpeKaDLuhRBIuOSmxE2vKAcz1BLQULsnkmpnzEoNwYOQ\n/pACu5KcCgqC/RnQk1s8rBkccNcyxvk2wNM+v3WyTx3FgEkT9Re2IiZABsLn2Y7w\nzXLU7ELbghDi2/aeWQGkfw==\n-----END PRIVATE KEY-----\n",
  client_email: "lerietmallstorage@lerietmall.iam.gserviceaccount.com",
  client_id: "117459304125690530892",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/lerietmallstorage%40lerietmall.iam.gserviceaccount.com",
};

console.log(JSON.stringify(a));
console.log("----------");
console.log("----------");
console.log(PRIVATE_KEY);
console.log("----------");
console.log("----------");
