import axios from "axios";

export function getRadios() {
  return axios.get("api/stations/search?limit=20");
}

export function getRadiosByParam(searchParam, searchTerm) {
  switch (searchParam) {
    case "name":
      return axios.get("api/stations/byname/" + searchTerm);
    case "country":
      return axios.get("api/stations/bycountry/" + searchTerm);
    case "language":
      return axios.get("api/stations/bylanguage/" + searchTerm);
  }
}

export default { getRadios, getRadiosByParam };
