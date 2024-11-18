import axios from "axios";

// Check if we're in the local development environment
const isLocal = window.location.hostname === "localhost";

// Set the base URL depending on whether we're in local or production environment
const baseURL = isLocal
  ? "https://de1.api.radio-browser.info/json" // Assuming you're using a local proxy server
  : "/api/"; // The API URL for production

// Function to get radios
export function getRadios() {
  return axios.get(`${baseURL}/stations/search?limit=20`);
}

// Function to get radios by a search parameter
export function getRadiosByParam(searchParam, searchTerm) {
  switch (searchParam) {
    case "name":
      return axios.get(`${baseURL}/stations/byname/${searchTerm}`);
    case "country":
      return axios.get(`${baseURL}/stations/bycountry/${searchTerm}`);
    case "language":
      return axios.get(`${baseURL}/stations/bylanguage/${searchTerm}`);
    default:
      return Promise.reject("Invalid search parameter");
  }
}

export default { getRadios, getRadiosByParam };
