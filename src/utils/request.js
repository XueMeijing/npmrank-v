const request = async (url, options) => {
  const response = await fetch(url, ...options)
  const data = await response.clone().json();
    // switch (data.code) {
    //   case '200':
    //     break;
    //   case '401':
    //     message.error(data.message || response.message);
    //     removeToken();
    //     break;
    //   case '500':
    //     message.error(data.message);
    //     break;
    //   default:
    //     message.error(`${data.status} ${data.error}` || data.message || response.message);
    // }
    return data
}

export default request