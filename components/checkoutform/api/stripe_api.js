const apiUrl = "http://localhost:3000"//process.env.API_URL

async function createPostData(data) {
  return {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: await JSON.stringify(data),
  };
}

async function resolveResponse(response) {

  const {data, error} = await response.json()

  if (response.ok) {
    if (data) {
      return {data: data};
    } else {
      return {error: error};
    }
  } else {
    const error = {
      message: data?.errors?.map(e => e.message).join('\n'),
    }
    return Promise.reject(error)
  }
}

async function paymentIntent(data) {
  let postData = await createPostData(data)
  try {
    return window
      .fetch(apiUrl + '/api/stripe/confirm', postData)
      .then(resolveResponse)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function paymentCancel(data) {
  try {
    return window
      .fetch(apiUrl + '/api/stripe/cancel', await createPostData(data))
      .then(resolveResponse)
  } catch(error) {
    return Promise.reject(error)
  }
}

async function refund(data) {
  try {
    return window
      .fetch(apiUrl + '/api/stripe/refund', await createPostData(data))
      .then(resolveResponse)
  } catch(error) {
    return Promise.reject(error)
  }
}

export {
  paymentIntent,
  paymentCancel,
  refund,
}