import axios from 'axios'

export const updateUser = async (ac,tb,userAddress,userToken) => {

    let data = JSON.stringify({
        "address" : userAddress,
        "actualBalance" : ac,
        "totalBalance" : tb
      })
      let config = {
        method: 'put',
        url: 'http://localhost:4000/user/update',
        headers: {
          'Authorization': 'Bearer ' + userToken,
          'Content-Type': 'application/json'
        },
        data : data
      };
      axios(config)
      .then(() => {
        console.log("user updated")

      })
  }