const axios = require('axios');
const aws4 = require('aws4');

const accessKey = process.env.AMAZON_ACCESS_KEY;
const secretKey = process.env.AMAZON_SECRET_KEY;
const associateTag = process.env.AMAZON_ASSOCIATE_TAG;

const host = 'webservices.amazon.com';
const region = 'us-east-1';
const endpoint = `https://${host}/paapi5/searchitems`;

async function buscarAmazon(termino) {
  const payload = {
    "Keywords": termino,
    "SearchIndex": "All",
    "Resources": [
      "ItemInfo.Title",
      "Offers.Listings.Price",
      "Images.Primary.Large",
      "DetailPageURL"
    ],
    "PartnerTag": associateTag,
    "PartnerType": "Associates",
    "Marketplace": "www.amazon.com"
  };

  const request = {
    host,
    method: 'POST',
    url: endpoint,
    path: '/paapi5/searchitems',
    service: 'execute-api',
    region,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(payload)
  };

  aws4.sign(request, {
    accessKeyId: accessKey,
    secretAccessKey: secretKey
  });

  try {
    const { data } = await axios.post(endpoint, payload, {
      headers: request.headers
    });

    const items = data.SearchResult?.Items || [];

    return items.map(item => ({
      titulo: item.ItemInfo?.Title?.DisplayValue || 'Sin título',
      precio: item.Offers?.Listings?.[0]?.Price?.Amount || null,
      link: item.DetailPageURL,
      fuente: 'Amazon',
      imagen: item.Images?.Primary?.Large?.URL || null
    }));
  } catch (error) {
    console.error('Error al consultar Amazon:', error.response?.data || error.message);
    return [];
  }
}

module.exports = { buscarAmazon };
