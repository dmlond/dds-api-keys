import axios from "axios";
import config from "../config/ddsconfig.js";

const ddsApiBaseURL = config["dds_api_base_url"];

var ddsClient = {
  send(payload, processData, handleFailure) {
    axios(payload)
      .then(processData)
      .catch((error) => {
        handleFailure(error.response.data);
      })
  },

  getJwtToken(accessToken, handleToken, handleFailure) {
    var url = `${ddsApiBaseURL}/user/api_token`;
    this.send(
      {
        url: url,
        method: 'get',
        params: {access_token: accessToken}
      },
      (response) => {
        var thisData = response.data;
        handleToken(thisData.api_token, thisData.expires_on, thisData.time_to_live);
      },
      handleFailure
    )
  },

  getCurrentUser(jwtToken, handleUser, handleFailure) {
    var url = `${ddsApiBaseURL}/current_user`
    this.send(
      {
        url: url,
        method: 'get',
        headers: {Authorization: jwtToken}
      },
      (response) => { handleUser(response.data) },
      handleFailure
    )
  },

  getUserApiKey(jwtToken, handleUserApiKey, handleFailure) {
    var url = `${ddsApiBaseURL}/current_user/api_key`;
    this.send(
      {
        url: url,
        method: 'get',
        headers: {Authorization: jwtToken}
      },
      (response) => {
        handleUserApiKey(response.data.key);
      },
      handleFailure
    );
  },

  setUserApiKey(jwtToken, handleUserApiKey, handleFailure) {
    var url = `${ddsApiBaseURL}/current_user/api_key`
    this.send(
      {
        url: url,
        method: 'put',
        headers: {Authorization: jwtToken}
      },
      (response) => { handleUserApiKey(response.data.key) },
      handleFailure
    )
  },

  destroyUserApiKey(jwtToken, handleSuccess, handleFailure) {
    var url = `${ddsApiBaseURL}/current_user/api_key`
    this.send(
      {
        url: url,
        method: 'delete',
        headers: {Authorization: jwtToken}
      },
      (response) => { handleSuccess() },
      handleFailure
    )
  },

  getDefaultOauthProvider(handleProvider, handleFailure) {
    var url = `${ddsApiBaseURL}/auth_providers`
    this.send(
      {
        url: url,
        method: 'get'
      },
      (response) => {
        let defaultProviderFound = false;
        response.data.results.some(function(provider) {
          if(provider.is_default) {
            defaultProviderFound = true;
            handleProvider(provider);
          }
          return provider.is_default;
        });
        if (!defaultProviderFound) {
          handleProvider(null);
        }
      },
      handleFailure
    )
  }
};
export default ddsClient;
