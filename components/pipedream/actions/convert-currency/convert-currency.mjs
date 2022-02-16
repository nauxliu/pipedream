// legacy_hash_id: a_nji8bM
import { axios } from "@pipedream/platform";

export default {
  key: "pipedream-convert-currency",
  name: "Convert Currency via exchangerate.host",
  version: "0.1.1",
  type: "action",
  props: {
    pipedream: {
      type: "app",
      app: "pipedream",
    },
    fromCurrency: {
      type: "string",
    },
    toCurrency: {
      type: "string",
    },
    value: {
      type: "string",
    },
  },
  async run({ $ }) {
    const url = `https://api.exchangerate.host/latest?base=${this.fromCurrency}&symbols=${this.toCurrency}`;
    const conversionResult = (await axios($, url));
    const rate = conversionResult["rates"][this.toCurrency];
    return rate * this.value;
  },
};
