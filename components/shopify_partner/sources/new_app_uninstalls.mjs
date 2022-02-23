import common from "../common.mjs";
import shopify from "../shopify_partner.app.mjs";
import getAppUninstalls from "../queries/getAppUninstalls.mjs";

export default {
  key: "shopify_partner-new-app-uninstalls",
  name: "New App Uninstalls",
  type: "source",
  version: "0.0.6",
  description: "Emit new events when new shops uninstall your app.",
  ...common,
  props: {
    ...common.props,
    appId: {
      propDefinition: [
        shopify,
        "appId",
      ],
    },
    occurredAtMin: {
      propDefinition: [
        shopify,
        "occurredAtMin",
      ],
    },
    occurredAtMax: {
      propDefinition: [
        shopify,
        "occurredAtMax",
      ],
    },
    paginationDirection: {
      propDefinition: [
        shopify,
        "paginationDirection",
      ],
    },
  },
  async run() {
    const {
      appId,
      occurredAtMin,
      occurredAtMax,
      db,
    } = this;

    const variables = {
      appId,
      ...(occurredAtMin || {}),
      ...(occurredAtMax || {}),
    };

    await this.shopify.query({
      db,
      query: getAppUninstalls,
      variables,
      key: "shopify_partner-uninstalls",
      handleEmit: (data) => {
        data.app.events.edges.map(({ node: { ...event } }) => {
          this.$emit(event, {
            id: event.occurredAt,
            summary: `${event.shop.name} (${event.shop.myshopifyDomain}) uninstalled ${event.app.name}`,
          });
        });
      },
      getCursor: (data) => {
        const edges = data?.app?.events?.edges;
        return edges.reverse()[0]?.cursor;
      },
      hasNextPagePath: "app.events.pageInfo.hasNextPage",
    });
  },
};
