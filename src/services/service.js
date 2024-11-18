import axios from "axios";

const url = "https://de1.api.radio-browser.info/json/stations/search?limit=20";

export function getRadios() {
  return axios.get(url);
}

export function getRadiosByParam(searchParam, searchTerm) {
  switch (searchParam) {
    case "name":
      return axios.get(
        "http://de1.api.radio-browser.info/json/stations/byname/" + searchTerm
      );
    case "country":
      return axios.get(
        "http://de1.api.radio-browser.info/json/stations/bycountry/" +
          searchTerm
      );
    case "language":
      return axios.get(
        "http://de1.api.radio-browser.info/json/stations/bylanguage/" +
          searchTerm
      );
  }
}

export default { getRadios, getRadiosByParam };
