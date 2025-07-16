sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/odata/v2/ODataModel",
  "sap/m/MessageToast",
  "sap/ui/core/format/DateFormat",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
], function (Controller, JSONModel, ODataModel, MessageToast, DateFormat, Filter, FilterOperator) {
  "use strict";

  return Controller.extend("ZQUALITY_PM.controller.Usage", {

    onInit: function () {
      this._loadUsageData(""); // Load all initially
    },

    _loadUsageData: function (sStatus) {
      var oODataModel = new ODataModel("/sap/opu/odata/sap/ZODATA_QUALITY_PM_SRV/");
      var aFilters = [];

      if (sStatus) {
        aFilters.push(new Filter("UsageDecisionStatus", FilterOperator.EQ, sStatus));
      }

      var that = this;
      oODataModel.read("/QualityUsage", {
        filters: aFilters,
        success: function (oData) {
          var oJsonModel = new JSONModel(oData.results);
          that.getView().setModel(oJsonModel, "usageModel");
        },
        error: function () {
          MessageToast.show("Failed to load Quality Usage data.");
        }
      });
    },

    onFilterChange: function (oEvent) {
      var sKey = oEvent.getSource().getSelectedKey();
      this._loadUsageData(sKey);
    },

    formatDate: function (sDate) {
      if (!sDate) return "";
      var oDate = new Date(sDate);
      return DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" }).format(oDate);
    },

    onNavBack: function () {
      this.getOwnerComponent().getRouter().navTo("Home");
    }

  });
});
