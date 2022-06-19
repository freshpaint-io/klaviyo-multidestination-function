async function onTrack(event, settings) {
  const klaviyoEvent = eventToKlaviyoEvent(event, settings);
  if (!klaviyoEvent) {
    return;
  }

  const buff = new Buffer.from(JSON.stringify(klaviyoEvent));
  const url = "https://a.klaviyo.com/api/track?data=" + buff.toString("base64");

  const options = { method: "GET", headers: { Accept: "text/html" } };
  const response = await fetch(url, options)
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((err) => console.error("error:" + err));

  console.log(response);
}

const propertyMapping = {
  email: "$email",
  firstName: "$first_name",
  lastName: "$last_name",
  phone: "$phone_number",
  title: "$title",
};

function eventToKlaviyoEvent(event, settings) {
  const apiKey = apiKeyForShop(
    event.properties.shopId.toString(),
    settings.shopIdMapping
  );
  if (!apiKey) {
    return null;
  }

  return {
    token: apiKey,
    event: event.event,
    customer_properties: {
      $id: event.userId || event.anonymousId,
    },
    properties: event.properties,
  };
}

function apiKeyForShop(id, shopIdMapping) {
  for (let { key, value } of shopIdMapping) {
    if (id === key) {
      return value;
    }
  }

  return null;
}

/**
 * Handle identify event
 */
async function onIdentify(event, settings) {
  // Learn more at https://documentation.freshpaint.io/developer-docs/freshpaint-sdk-reference#identify
  throw new EventNotSupported("identify is not supported");
}

/**
 * Handle group event
 */
async function onGroup(event, settings) {
  // Learn more at https://documentation.freshpaint.io/developer-docs/freshpaint-sdk-reference#group
  throw new EventNotSupported("group is not supported");
}

/**
 * Handle page event
 */
async function onPage(event, settings) {
  // Learn more at https://documentation.freshpaint.io/developer-docs/freshpaint-sdk-reference#page
  throw new EventNotSupported("page is not supported");
}
